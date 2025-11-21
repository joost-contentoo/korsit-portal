import { z } from 'zod';

export const localizeRequestSchema = z.object({
    blog_content: z.string().min(1, "Blog content is required"),
    seo_context: z.string().optional(),
    additional_instructions: z.string().optional(),
    style_guide: z.string().optional(),
    glossary: z.string().optional(),
});

export type LocalizeRequest = z.infer<typeof localizeRequestSchema>;
