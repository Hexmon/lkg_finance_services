import { z } from 'zod';

/** Base record returned by the address APIs */
export const AddressRecordSchema = z.object({
  address_id: z.number(),
  user_id: z.string(),
  owner_type: z.string(),
  address_type: z.string(),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
  po: z.string(),
  house: z.string(),
  dist: z.string(),
  street: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),

  /** These appear in requests and may or may not be returned by the API. */
  landmark: z.string().nullable().optional(),
  locality: z.string().nullable().optional(),
  subdist: z.string().optional(),
  vtc: z.string().optional(),
});
export type AddressRecord = z.infer<typeof AddressRecordSchema>;

/** -------- Create (POST /secure/address) -------- */
export const AddAddressRequestSchema = z.object({
  user_id: z.string().min(1),
  country: z.string().min(1),
  address_type: z.string().min(1).transform((v) => v.toUpperCase()),
  dist: z.string().min(1),
  house: z.string().min(1),
  landmark: z.string().optional().default(''),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  po: z.string().min(1),
  state: z.string().min(1),
  street: z.string().min(1),
  subdist: z.string().min(1),
  vtc: z.string().min(1),
  locality: z.string().min(1),
});
export type AddAddressRequest = z.infer<typeof AddAddressRequestSchema>;

/** UAT POST returns a flat Address-like object without status wrapper */
export const AddAddressResponseSchema = AddressRecordSchema.passthrough();
export type AddAddressResponse = z.infer<typeof AddAddressResponseSchema>;

/** -------- List (GET /secure/address) -------- */
export const GetAddressesResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  data: z.array(AddressRecordSchema),
});
export type GetAddressesResponse = z.infer<typeof GetAddressesResponseSchema>;

/** -------- Update (PATCH /secure/address/:address_id) -------- */
export const UpdateAddressBodySchema = z
  .object({
    country: z.string().optional(),
    address_type: z.string().optional().transform((v) => (v ? v.toUpperCase() : v)),
    dist: z.string().optional(),
    house: z.string().optional(),
    landmark: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
    po: z.string().optional(),
    state: z.string().optional(),
    street: z.string().optional(),
    subdist: z.string().optional(),
    vtc: z.string().optional(),
    locality: z.string().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided for update',
  });
export type UpdateAddressBody = z.infer<typeof UpdateAddressBodySchema>;

export const UpdateAddressResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  data: AddressRecordSchema,
});
export type UpdateAddressResponse = z.infer<typeof UpdateAddressResponseSchema>;

/** -------- Delete (DELETE /secure/address/:address_id) -------- */
export const DeleteAddressResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.string(), z.number()]),
});
export type DeleteAddressResponse = z.infer<typeof DeleteAddressResponseSchema>;
