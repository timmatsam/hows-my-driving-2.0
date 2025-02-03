import { z } from "zod";

export const carSearchSchema = z.object({
  state: z.string().min(2, "State is required."),
  plate: z
    .string()
    .min(1, "License plate is required.")
    .max(10, "License plate cannot exceed 10 characters."),
});
