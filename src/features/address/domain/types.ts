// src/features/address/domain/types.ts
import { z } from "zod";

/** ---------- Base record ---------- */
const AddressRecordSchema = z.object({
  user_type: z.string(),
  address_type: z.string(),
  address_id: z.string(),
  user_id: z.string(),
  house: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  dist: z.string().nullable().optional(),
  city: z.string().nullable().optional(),          // <- allow null
  landmark: z.string().nullable().optional(),
  po: z.string().nullable().optional(),
  locality: z.string().nullable().optional(),
  vtc: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),      // <- allow null
  longitude: z.number().nullable().optional(),     // <- allow null
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),    // <- allow null
  is_active: z.boolean(),
});

export type AddressRecord = z.infer<typeof AddressRecordSchema>;

/** ---------- GET /secure/address ---------- */
export const GetAddressesQuerySchema = z.object({
  user_id: z.string().optional(),
});
export type GetAddressesQuery = z.infer<typeof GetAddressesQuerySchema>;

export const GetAddressesResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  data: z.array(AddressRecordSchema),
});
export type GetAddressesResponse = z.infer<typeof GetAddressesResponseSchema>;

/** ---------- POST /secure/address ---------- */
export const AddAddressRequestSchema = z.object({
  user_id: z.string().min(1),
  country: z.string().min(1),
  address_type: z.string().min(1).transform((v) => v.toUpperCase()),
  dist: z.string().min(1),
  house: z.string().min(1),
  landmark: z.string().optional().default(""),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  po: z.string().min(1),
  state: z.string().min(1),
  street: z.string().min(1),
  subdist: z.string().min(1),
  vtc: z.string().min(1),
  locality: z.string().min(1),
});
export type AddAddressRequest = z.infer<typeof AddAddressRequestSchema>;

/** UAT returns a flat Address-like object */
export const AddAddressResponseSchema = AddressRecordSchema.passthrough();
export type AddAddressResponse = z.infer<typeof AddAddressResponseSchema>;


export const UpstreamAddAddressResponseSchema = z.object({
  message: z.string(),
  data: AddAddressResponseSchema,
}).passthrough();

/** ---------- PATCH /secure/address/ (landmark only as per spec) ---------- */
export const PatchAddressLandmarkBodySchema = z.object({
  landmark: z.string().min(1),
});
export type PatchAddressLandmarkBody = z.infer<typeof PatchAddressLandmarkBodySchema>;

export const UpdateAddressResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  data: AddressRecordSchema,
});
export type UpdateAddressResponse = z.infer<typeof UpdateAddressResponseSchema>;
