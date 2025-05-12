import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
});

export type CreatePost = z.infer<typeof createPostSchema>;

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  createdAt: z.date(),
  tags: z.array(z.string()),
  imagesUrls: z.array(z.string()),
  startsAmount: z.number(),
});

export type Post = z.infer<typeof postSchema>;
