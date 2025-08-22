import { z } from 'zod';

/** ---------- GET /secure/profile ---------- */

export const ProfileDataSchema = z
    .object({
        user_id: z.string(),
        // profile_id may be number or string (UAT); normalize to number
        profile_id: z.union([z.number(), z.string().regex(/^\d+$/)]).transform((v) => Number(v)),
        username: z.string(),
        status: z.string(),
        is_password_reset: z.boolean(),
        type: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
    })
    .passthrough(); // keep extra fields if backend adds more

export type ProfileData = z.infer<typeof ProfileDataSchema>;

export const GetProfileResponseSchema = z.object({
    data: ProfileDataSchema,
    status: z.union([z.string(), z.number()]),
});
export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;

/** ---------- GET /secure/get-user-permissions ---------- */
/**
 * Permissions tree is nested objects with optional `actions: string[]` at any level.
 * Example:
 * {
 *   PROFILE: { actions: ['VIEW'] },
 *   BILL_PAYMENT: { ONLINE: { actions: ['VIEW'] } }
 * }
 */
export type PermissionsNode = {
    actions?: string[];
    // nested nodes by arbitrary keys
    [k: string]: PermissionsNode | string[] | undefined;
};

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
export type GetUserPermissionsResponse = z.infer<typeof GetUserPermissionsResponseSchema>;
