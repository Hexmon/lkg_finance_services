// src/features/upgrade-account/domain/types.ts
import { z } from "zod";

export const AccountUpgradeRequestSchema = z.object({
  user_id: z.string().min(1),
  request_type: z.string().min(1).transform(v => v.trim().toUpperCase()),
  description: z.string().min(1),
}).strict();
export type AccountUpgradeRequest = z.infer<typeof AccountUpgradeRequestSchema>;

export const AccountUpgradeResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),      // "201"
  request_id: z.string(),                          // UUID
  message: z.string(),                             // "Your request successfully submitted"
}).passthrough();
export type AccountUpgradeResponse = z.infer<typeof AccountUpgradeResponseSchema>;
