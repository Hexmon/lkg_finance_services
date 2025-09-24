import { z } from "zod";

export const InfoSchema = z.object({
  infoName: z.string(),
  infoValue: z.string(),
});

export const AdditionalInfoSchema = z.object({
  info: InfoSchema,
});

export const BillValidationResponseSchema = z.object({
  status: z.string(),
  requestId: z.string(),
  data: z.object({
    responseCode: z.string(),
    responseReason: z.string(),
    complianceCode: z.string().nullable(),
    complianceReason: z.string().nullable(),
    additionalInfo: AdditionalInfoSchema,
  }),
});

export const BillValidationRequestSchema = z.object({
  customerId: z.string(),
  billerId: z.string(),
  amount: z.string().or(z.number()),
  additionalInfo: AdditionalInfoSchema.optional(),
});

export function isBillValidationSuccessShape(input: unknown): input is BillValidationResponse {
  if (!input || typeof input !== 'object') return false;
  try {
    BillValidationResponseSchema.parse(input);
    return true;
  } catch {
    return false;
  }
}

export type Info = z.infer<typeof InfoSchema>;
export type AdditionalInfo = z.infer<typeof AdditionalInfoSchema>;
export type BillValidationResponse = z.infer<typeof BillValidationResponseSchema>;
export type BillValidationRequest = z.infer<typeof BillValidationRequestSchema>;

