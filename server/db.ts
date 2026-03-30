import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { enquiries, InsertEnquiry, InsertPainting, InsertUser, paintings, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Paintings ────────────────────────────────────────────────────────────────

export async function getAllPaintings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(paintings).orderBy(desc(paintings.createdAt));
}

export async function getFeaturedPainting() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(paintings).where(eq(paintings.featured, true)).limit(1);
  return result[0] ?? null;
}

export async function getPaintingById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(paintings).where(eq(paintings.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createPainting(data: InsertPainting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(paintings).values(data);
}

export async function deletePainting(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(paintings).where(eq(paintings.id, id));
}

export async function setFeaturedPainting(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Unset all featured first
  await db.update(paintings).set({ featured: false });
  // Set the new one
  await db.update(paintings).set({ featured: true }).where(eq(paintings.id, id));
}

// ─── Enquiries ────────────────────────────────────────────────────────────────

export async function createEnquiry(data: InsertEnquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(enquiries).values(data);
}

export async function getAllEnquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
}
