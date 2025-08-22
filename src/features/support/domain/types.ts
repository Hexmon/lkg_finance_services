import { z } from 'zod';

/** ---- Ticket primitives ---- */
export const TicketPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export type TicketPriority = z.infer<typeof TicketPrioritySchema>;

/** Keep category flexible; normalize to UPPER */
export const TicketCategorySchema = z.string().min(1).transform((v) => v.toUpperCase());
export type TicketCategory = z.infer<typeof TicketCategorySchema>;

/** Status set (example shows OPEN, IN_PROGRESS, RESOLVED, CLOSED) */
export const TicketStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

/** ---- Ticket record ---- */
export const TicketSchema = z.object({
  status: z.union([TicketStatusSchema, z.string()]), // allow future values
  priority: TicketPrioritySchema,
  category: z.string(), // raw from API (already upper)
  ticket_id: z.string(),
  sr_number: z.number(),
  subject: z.string(),
  description: z.string(),
  transaction_id: z.string().nullable().optional(),
  attachment_url: z.string().nullable().optional(),
  user_id: z.string(),
  resolved_by: z.string().nullable().optional(),
  created_at: z.string(),
});
export type Ticket = z.infer<typeof TicketSchema>;

/** ---- Create Ticket ---- */
export const CreateTicketRequestSchema = z.object({
  subject: z.string().min(1),
  category: TicketCategorySchema,
  description: z.string().min(1),
  priority: TicketPrioritySchema,
  transaction_id: z.string().optional(),
});
export type CreateTicketRequest = z.infer<typeof CreateTicketRequestSchema>;

export const CreateTicketResponseSchema = z.object({
  data: TicketSchema,
  status: z.union([z.number(), z.string()]),
});
export type CreateTicketResponse = z.infer<typeof CreateTicketResponseSchema>;

/** ---- Get Tickets (list) ---- */
export const GetTicketsQuerySchema = z.object({
  per_page: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  sort_by: z.string().optional(), // e.g., created_at, priority
  ticket_id: z.string().optional(),
  status: TicketStatusSchema.optional(),
  priority: TicketPrioritySchema.optional(),
  sr_number: z.union([z.string(), z.number()]).optional(),
});
export type GetTicketsQuery = z.infer<typeof GetTicketsQuerySchema>;

export const GetTicketsResponseSchema = z.object({
  data: z.array(TicketSchema),
  status: z.union([z.number(), z.string()]),
});
export type GetTicketsResponse = z.infer<typeof GetTicketsResponseSchema>;

/** ---- Health ---- */
const DepNodeSchema = z.object({
  details: z.string(),
  status: z.string(),
});

export const HealthResponseSchema = z.object({
  build_version: z.string(),
  dependencies: z.object({
    postgresql: DepNodeSchema.optional(),
    rabbitmq: DepNodeSchema.optional(),
    redis: DepNodeSchema.optional(),
  }).passthrough(),
  service: z.string(),
  status: z.string(),
  uptime_seconds: z.number(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
