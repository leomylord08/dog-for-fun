import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createEnquiry,
  createPainting,
  deletePainting,
  getAllEnquiries,
  getAllPaintings,
  getFeaturedPainting,
  getPaintingById,
  setFeaturedPainting,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { featureFlags } from "../shared/featureFlags";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  paintings: router({
    list: publicProcedure.query(async () => {
      return getAllPaintings();
    }),

    featured: publicProcedure.query(async () => {
      return getFeaturedPainting();
    }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const painting = await getPaintingById(input.id);
        if (!painting) throw new TRPCError({ code: "NOT_FOUND", message: "Painting not found" });
        return painting;
      }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          medium: z.string().optional(),
          dimensions: z.string().optional(),
          price: z.string().optional(),
          imageUrl: z.string().url(),
          imageKey: z.string().optional(),
          featured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createPainting({
          title: input.title,
          description: input.description ?? null,
          medium: input.medium ?? null,
          dimensions: input.dimensions ?? null,
          price: input.price ?? null,
          imageUrl: input.imageUrl,
          imageKey: input.imageKey ?? null,
          featured: input.featured ?? false,
        });
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePainting(input.id);
        return { success: true };
      }),

    setFeatured: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await setFeaturedPainting(input.id);
        return { success: true };
      }),

    uploadImage: adminProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          dataUrl: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Convert base64 data URL to buffer
        const base64Data = input.dataUrl.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const ext = input.filename.split(".").pop() ?? "jpg";
        const uniqueName = `${nanoid()}.${ext}`;

        if (featureFlags.isStoreLocally) {
          // ── Local storage mode ──────────────────────────────────────────
          // Ensure uploads directory exists
          if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          }
          const filePath = path.join(UPLOADS_DIR, uniqueName);
          fs.writeFileSync(filePath, buffer);

          // Build a URL pointing to the /uploads static route on the same server
          const protocol = ctx.req.protocol ?? "http";
          const host = ctx.req.headers.host ?? "localhost:3000";
          const url = `${protocol}://${host}/uploads/${uniqueName}`;
          const key = `uploads/${uniqueName}`;
          return { url, key };
        } else {
          // ── S3 cloud storage mode ────────────────────────────────────────
          const key = `paintings/${uniqueName}`;
          const { url } = await storagePut(key, buffer, input.contentType);
          return { url, key };
        }
      }),
  }),

  enquiries: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          message: z.string().min(1),
          paintingId: z.number().optional(),
          paintingTitle: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createEnquiry({
          name: input.name,
          email: input.email,
          message: input.message,
          paintingId: input.paintingId ?? null,
          paintingTitle: input.paintingTitle ?? null,
        });
        return { success: true };
      }),

    list: adminProcedure.query(async () => {
      return getAllEnquiries();
    }),
  }),
});

export type AppRouter = typeof appRouter;
