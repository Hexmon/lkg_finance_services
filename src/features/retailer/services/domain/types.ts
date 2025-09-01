import { z } from 'zod';

export const ServiceItemSchema = z.object({
  master_id: z.string().uuid().or(z.string()),
  label: z.string(),
  service_id: z.string().uuid().or(z.string()),
});

export const ServiceListResponseSchema = z.object({
  status: z.number(),
  data: z.array(ServiceItemSchema),
});

export type ServiceItem = z.infer<typeof ServiceItemSchema>;
export type ServiceListResponse = z.infer<typeof ServiceListResponseSchema>;

export type ServiceListParams = {
  category?: string;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  per_page?: number;
  page?: number;
};
