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

/** 👇 NEW: input param schemas to match upstream */
export const ValidationInputParamSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

export const ValidationInputParamsSchema = z.object({
  /** upstream accepts either ONE object or an ARRAY of objects */
  input: z.union([
    ValidationInputParamSchema,
    z.array(ValidationInputParamSchema),
  ]),
});

/** 👇 FIX: include billerId + inputParams; customerId/amount not required here */
export const BillValidationRequestSchema = z.object({
  billerId: z.string(),
  inputParams: ValidationInputParamsSchema,
  // additionalInfo: AdditionalInfoSchema.optional(),
});

export function isBillValidationSuccessShape(input: unknown) {
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
export type ValidationInputParam = z.infer<typeof ValidationInputParamSchema>;
export type ValidationInputParams = z.infer<typeof ValidationInputParamsSchema>;
export type BillValidationRequest = z.infer<typeof BillValidationRequestSchema>;
