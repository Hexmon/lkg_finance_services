import { z } from 'zod';

/** ---------- Account Upgrade (POST /secure/account-upgrade) ---------- */
export const AccountUpgradeRequestSchema = z.object({
  user_id: z.string().min(1),
  // Normalize to UPPER so "retailer_to_distributor" etc. are accepted
  request_type: z.string().min(1).transform(v => v.toUpperCase()),
  description: z.string().min(1),
});
export type AccountUpgradeRequest = z.infer<typeof AccountUpgradeRequestSchema>;

export const AccountUpgradeResponseSchema = z
  .object({
    status: z.union([z.string(), z.number()]).optional(),
    message: z.string().optional(),
    request_id: z.union([z.string(), z.number()]).optional(),
    data: z.unknown().optional(),
  })
  .passthrough();
export type AccountUpgradeResponse = z.infer<typeof AccountUpgradeResponseSchema>;

/** ---------- Request Log (GET /secure/request_log/:user_id/:request_id) ---------- */
export const RequestLogResponseSchema = z
  .object({
    status: z.union([z.string(), z.number()]).optional(),
    message: z.string().optional(),
    // Backend shape is not specified; keep flexible
    data: z.unknown().optional(),
    request: z.unknown().optional(),
  })
  .passthrough();
export type RequestLogResponse = z.infer<typeof RequestLogResponseSchema>;
