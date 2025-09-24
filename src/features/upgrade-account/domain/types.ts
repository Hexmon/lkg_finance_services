import { z } from 'zod';

/** Request schema (BFF accepts all 4 fields; path params are mapped in route) */
export const AccountUpgradeRequestSchema = z.object({
  user_id: z.string().min(1),
  request_type: z.string().min(1),
  description: z.string().min(1),
}).strict();

export type AccountUpgradeRequest = z.infer<typeof AccountUpgradeRequestSchema>;

/** Upstream example: { message: "account successfully upgraded", status: "200" } */
export const AccountUpgradeResponseSchema = z.object({
  message: z.string().optional(),
  status: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export type AccountUpgradeResponse = z.infer<typeof AccountUpgradeResponseSchema>;
