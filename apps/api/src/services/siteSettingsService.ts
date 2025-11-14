import { eq } from "drizzle-orm";
import { db } from "../db";
import { siteSettings } from "../../../../drizzle/schema";

const DEFAULT_SETTINGS = {
  contactEmail: "info@premiumcandles.com",
  instagramUrl: "",
  facebookUrl: "",
  notificationEmail: "emrekocakoglu@gmail.com",
};

function sanitize<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

export async function getSiteSettings() {
  const [existing] = await db.select().from(siteSettings).limit(1);
  if (!existing) {
    return { id: undefined, ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...existing };
}

export type UpdateSiteSettingsInput = {
  contactEmail?: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  notificationEmail?: string;
};

export async function upsertSiteSettings(payload: UpdateSiteSettingsInput) {
  const normalized = sanitize({
    contactEmail: payload.contactEmail,
    instagramUrl: payload.instagramUrl ?? null,
    facebookUrl: payload.facebookUrl ?? null,
    notificationEmail: payload.notificationEmail,
  });

  const [existing] = await db.select().from(siteSettings).limit(1);
  if (existing) {
    if (Object.keys(normalized).length === 0) {
      return { ...DEFAULT_SETTINGS, ...existing };
    }
    await db
      .update(siteSettings)
      .set({ ...normalized })
      .where(eq(siteSettings.id, existing.id));
    return { ...DEFAULT_SETTINGS, ...existing, ...normalized };
  }

  const insertPayload = {
    contactEmail: normalized.contactEmail ?? DEFAULT_SETTINGS.contactEmail,
    instagramUrl: normalized.instagramUrl ?? DEFAULT_SETTINGS.instagramUrl,
    facebookUrl: normalized.facebookUrl ?? DEFAULT_SETTINGS.facebookUrl,
    notificationEmail: normalized.notificationEmail ?? DEFAULT_SETTINGS.notificationEmail,
  };

  await db.insert(siteSettings).values(insertPayload);
  const [fresh] = await db.select().from(siteSettings).limit(1);
  return { ...DEFAULT_SETTINGS, ...fresh };
}
