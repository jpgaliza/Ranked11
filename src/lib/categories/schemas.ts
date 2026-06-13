import { z } from "zod";

export const rankedItemSchema = z.object({
  id: z.string(),
  statValue: z.number(),
  metadata: z
    .object({
      countryCode: z.string().optional(),
      photoUrl: z.string().optional(),
    })
    .optional(),
});

export const categoryDefinitionSchema = z.object({
  id: z.string(),
  type: z.enum(["team", "player", "coach", "country", "tournament"]),
  i18nKey: z.string(),
  correctOrder: z.array(z.string()).length(10),
  items: z.record(rankedItemSchema),
});

export const categoryManifestEntrySchema = z.object({
  id: z.string(),
  type: z.enum(["team", "player", "coach", "country", "tournament"]),
  i18nKey: z.string(),
  icon: z.string(),
  featured: z.boolean().optional(),
});

export const categoryManifestSchema = z.object({
  version: z.string(),
  categories: z.array(categoryManifestEntrySchema),
});

export type CategoryDefinitionInput = z.infer<typeof categoryDefinitionSchema>;
export type CategoryManifestInput = z.infer<typeof categoryManifestSchema>;
