import { z } from "zod";

/** ---------- GET /secure/profile (Bhugtan AUTH UAT) ---------- */
/**
 * New upstream response (example):
 * {
 *   "data": { ...profile fields... },
 *   "user_type": "RETAILER",
 *   "user_id": "f6973b0b-....",
 *   "upgrade_requests": [],
 *   "balances": [ { ...wallet fields..., balance: number } ],
 *   "status": 200
 * }
 */

export const AddressesSchema = z.object({
  user_type: z.string(),
  address_type: z.string(),
  address_id: z.string(),
  user_id: z.string(),
  house: z.string(),
  street: z.string(),
  dist: z.string(),
  city: z.string().nullable(),
  landmark: z.string(),
  po: z.string(),
  locality: z.string(),
  vtc: z.string(),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  is_active: z.boolean()
}).passthrough();

export type Address = z.infer<typeof AddressesSchema>;

export const ProfileCoreSchema = z.object({
  profile: z.string().optional(), // base64 image string
  email: z.string().email(),
  mobile: z.string(),
  name: z.string(),
  profile_id: z.string(), // UUID in UAT sample
  urn: z.string(),
  email_verified: z.boolean(),
  mobile_verified: z.boolean(),
  aadhaar_verified: z.boolean(),
  pan_verified: z.boolean(),
  dob: z.string(), // ISO date string (e.g., "1995-02-02")
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).or(z.string()), // be lenient if API expands
  accepted_terms: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  address: z.string(),
  account_status: z.string(),
  addresses: z.array(AddressesSchema).default([])
}).passthrough(); // keep any future/extra fields

export type ProfileCore = z.infer<typeof ProfileCoreSchema>;

// Balances vary slightly by wallet; require `balance` and allow pass-through
export const BalanceSchema = z.object({
  balance: z.number(),
}).passthrough();

export type Balance = z.infer<typeof BalanceSchema>;

export const GetProfileResponseSchema = z.object({
  data: ProfileCoreSchema,
  user_type: z.string(), // e.g., "RETAILER"
  user_id: z.string(),
  upgrade_requests: z.array(z.unknown()),
  balances: z.array(BalanceSchema),
  status: z.number(),
});

export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;

/** ---------- (Optional) GET /secure/get-user-permissions ---------- */
/**
 * Permissions tree can be deeply nested, with optional `actions: string[]`
 */
export type PermissionsNode = {
  actions?: string[];
  [k: string]: PermissionsNode | string[] | undefined;
};

// Recursive schema for permissions map
export const PermissionsNodeSchema: z.ZodType<PermissionsNode> = z.lazy(() =>
  z
    .object({
      actions: z.array(z.string()).optional(),
    })
    .catchall(PermissionsNodeSchema)
);

export const GetUserPermissionsResponseSchema = z.object({
  status: z.union([z.number(), z.string()]),
  user_id: z.string(),
  permissions: z.record(z.string(), PermissionsNodeSchema),
});

export type GetUserPermissionsResponse = z.infer<
  typeof GetUserPermissionsResponseSchema
>;
