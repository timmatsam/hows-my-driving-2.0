import { z } from "zod";

export const featureRequestFormSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
});
