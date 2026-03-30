import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock featureFlags - default to local storage for most tests
vi.mock("../shared/featureFlags", () => ({
  featureFlags: { isStoreLocally: true },
}));

// Mock fs to avoid actual file writes during tests
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
  existsSync: vi.fn().mockReturnValue(true),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

// ─── Mock DB helpers ──────────────────────────────────────────────────────────

vi.mock("./db", () => ({
  getAllPaintings: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Golden Retriever",
      description: "A warm portrait",
      medium: "Oil on canvas",
      dimensions: "24 × 30 in",
      price: "1200.00",
      imageUrl: "https://example.com/painting1.jpg",
      imageKey: "paintings/abc.jpg",
      featured: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ]),
  getFeaturedPainting: vi.fn().mockResolvedValue({
    id: 1,
    title: "Golden Retriever",
    description: "A warm portrait",
    medium: "Oil on canvas",
    dimensions: "24 × 30 in",
    price: "1200.00",
    imageUrl: "https://example.com/painting1.jpg",
    imageKey: "paintings/abc.jpg",
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  }),
  getPaintingById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) return Promise.resolve({
      id: 1,
      title: "Golden Retriever",
      description: "A warm portrait",
      medium: "Oil on canvas",
      dimensions: "24 × 30 in",
      price: "1200.00",
      imageUrl: "https://example.com/painting1.jpg",
      imageKey: "paintings/abc.jpg",
      featured: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });
    return Promise.resolve(null);
  }),
  createPainting: vi.fn().mockResolvedValue(undefined),
  deletePainting: vi.fn().mockResolvedValue(undefined),
  setFeaturedPainting: vi.fn().mockResolvedValue(undefined),
  createEnquiry: vi.fn().mockResolvedValue(undefined),
  getAllEnquiries: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I am interested in the Golden Retriever painting.",
      paintingId: 1,
      paintingTitle: "Golden Retriever",
      createdAt: new Date("2024-01-02"),
    },
  ]),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/paintings/test.jpg", key: "paintings/test.jpg" }),
  storageGet: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/paintings/test.jpg", key: "paintings/test.jpg" }),
}));

// ─── Context helpers ──────────────────────────────────────────────────────────

function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  const adminUser: User = {
    id: 1,
    openId: "admin-open-id",
    name: "Admin User",
    email: "admin@example.com",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user: adminUser,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeUserCtx(): TrpcContext {
  const regularUser: User = {
    id: 2,
    openId: "user-open-id",
    name: "Regular User",
    email: "user@example.com",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user: regularUser,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("paintings.list (public)", () => {
  it("returns list of paintings for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.paintings.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Golden Retriever");
  });
});

describe("paintings.featured (public)", () => {
  it("returns the featured painting", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.paintings.featured();
    expect(result).not.toBeNull();
    expect(result?.featured).toBe(true);
  });
});

describe("paintings.byId (public)", () => {
  it("returns a painting by id", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.paintings.byId({ id: 1 });
    expect(result.id).toBe(1);
    expect(result.title).toBe("Golden Retriever");
  });

  it("throws NOT_FOUND for unknown id", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.paintings.byId({ id: 999 })).rejects.toThrow("Painting not found");
  });
});

describe("paintings.create (admin only)", () => {
  it("allows admin to create a painting", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.paintings.create({
      title: "Beagle Portrait",
      imageUrl: "https://example.com/beagle.jpg",
      medium: "Acrylic",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.paintings.create({ title: "Test", imageUrl: "https://example.com/test.jpg" })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.paintings.create({ title: "Test", imageUrl: "https://example.com/test.jpg" })
    ).rejects.toThrow();
  });
});

describe("paintings.uploadImage - local storage mode (isStoreLocally: true)", () => {
  it("stores image locally and returns a /uploads URL", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.paintings.uploadImage({
      filename: "dog.jpg",
      contentType: "image/jpeg",
      dataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgAB",
    });
    expect(result.url).toContain("/uploads/");
    expect(result.key).toMatch(/^uploads\/.+\.jpg$/);
  });

  it("rejects non-admin users from uploading", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.paintings.uploadImage({
        filename: "dog.jpg",
        contentType: "image/jpeg",
        dataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgAB",
      })
    ).rejects.toThrow();
  });
});

describe("paintings.uploadImage - S3 mode (isStoreLocally: false)", () => {
  it("uploads to S3 and returns a CDN URL when isStoreLocally is false", async () => {
    // Temporarily override the flag for this test
    const { featureFlags } = await import("../shared/featureFlags");
    (featureFlags as { isStoreLocally: boolean }).isStoreLocally = false;

    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.paintings.uploadImage({
      filename: "dog.png",
      contentType: "image/png",
      dataUrl: "data:image/png;base64,iVBORw0KGgo=",
    });
    expect(result.url).toContain("cdn.example.com");
    expect(result.key).toMatch(/^paintings\/.+\.png$/);

    // Restore flag
    (featureFlags as { isStoreLocally: boolean }).isStoreLocally = true;
  });
});

describe("paintings.delete (admin only)", () => {
  it("allows admin to delete a painting", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.paintings.delete({ id: 1 });
    expect(result.success).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.paintings.delete({ id: 1 })).rejects.toThrow();
  });
});

describe("paintings.setFeatured (admin only)", () => {
  it("allows admin to set featured painting", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.paintings.setFeatured({ id: 1 });
    expect(result.success).toBe(true);
  });
});

describe("enquiries.submit (public)", () => {
  it("allows anyone to submit an enquiry", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.enquiries.submit({
      name: "John Smith",
      email: "john@example.com",
      message: "I am interested in commissioning a painting.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.enquiries.submit({ name: "John", email: "not-an-email", message: "Hello" })
    ).rejects.toThrow();
  });

  it("rejects empty message", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.enquiries.submit({ name: "John", email: "john@example.com", message: "" })
    ).rejects.toThrow();
  });
});

describe("enquiries.list (admin only)", () => {
  it("allows admin to list enquiries", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.enquiries.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Jane Doe");
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.enquiries.list()).rejects.toThrow();
  });
});
