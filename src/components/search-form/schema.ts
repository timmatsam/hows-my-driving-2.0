import { z } from "zod";

export const carSearchSchema = z.object({
  state: z.string().length(2, "State abbreviation is required."),
  plate: z
    .string()
    .min(1, "License plate is required.")
    .max(10, "License plate cannot exceed 10 characters."),
});
