import { z } from 'zod';

const envSchema = z.object({
    N8N_WEBHOOK_URL: z.string().url().min(1, "N8N_WEBHOOK_URL is required"),
});

export const env = envSchema.parse({
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
});
