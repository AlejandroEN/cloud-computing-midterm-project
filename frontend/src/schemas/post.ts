import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
});

export type PostSchema = z.infer<typeof postSchema>;
