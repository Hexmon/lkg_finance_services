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



////////////////////////////////////////////////////////////////////////////////

/* -------------------- shared enums -------------------- */
export const TicketStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);
export const TicketPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

/* -------------------- GET /secure/tickets -------------------- */
export const GetTicketsQuerySchema = z.object({
  per_page: z.number().int().positive().max(100).optional(),
  page: z.number().int().positive().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  // Upstream documents `created_at, priority` explicitly; allow custom strings too
  sort_by: z.string().min(1).optional(),
  ticket_id: z.string().min(1).optional(),
  status: TicketStatusEnum.optional(),
  priority: TicketPriorityEnum.optional(),
  // upstream shows numeric sr_number, but allow string/number for flexibility
  sr_number: z.union([z.string().min(1), z.number()]).optional(),
}).strict();

export type GetTicketsQuery = z.infer<typeof GetTicketsQuerySchema>;

export const TicketItemSchema = z.object({
  status: z.string().optional(),            // e.g. "OPEN"
  priority: z.string().optional(),          // e.g. "HIGH"
  category: z.string().optional(),          // e.g. "TRANSACTION"
  ticket_id: z.string().min(1).optional(),  // uuid upstream, keep flexible on filter
  sr_number: z.number().optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  transaction_id: z.string().nullable().optional(),
  attachment_url: z.string().url().nullable().optional(),
  user_id: z.string().min(1).optional(),
  resolved_by: z.string().nullable().optional(),
  created_at: z.string().optional(),        // ISO string
}).passthrough();

export type TicketItem = z.infer<typeof TicketItemSchema>;

export const GetTicketsResponseSchema = z.object({
  data: z.array(TicketItemSchema),
  status: z.union([z.number(), z.string()]).optional(),
}).passthrough();

export type GetTicketsResponse = z.infer<typeof GetTicketsResponseSchema>;


/** =========================
 *  Create Ticket (POST)
 *  Upstream: https://auth-uat.bhugtan.in/secure/create-ticket
 *  ========================= */

export const CreateTicketRequestSchema = z.object({
  subject: z.string().min(1),
  category: z.string().min(1),          // e.g. TRANSACTION, ACCOUNT, TECHNICAL
  description: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  transaction_id: z.string().min(1).optional(),
}).strict();

export type CreateTicketRequest = z.infer<typeof CreateTicketRequestSchema>;

export const CreateTicketResponseSchema = z.object({
  data: z.object({
    status: z.string().optional(),         // e.g. "OPEN"
    priority: z.string().optional(),
    category: z.string().optional(),
    ticket_id: z.string().uuid().optional(),
    sr_number: z.number().optional(),
    subject: z.string().optional(),
    description: z.string().optional(),
    transaction_id: z.string().nullable().optional(),
    attachment_url: z.string().url().nullable().optional(),
    user_id: z.string().uuid().optional(),
    resolved_by: z.string().uuid().nullable().optional(),
    created_at: z.string().optional(),     // ISO datetime
  }).passthrough(),
  status: z.union([z.string(), z.number()]).optional(), // upstream uses "201" (string)
}).passthrough();

export type CreateTicketResponse = z.infer<typeof CreateTicketResponseSchema>;
