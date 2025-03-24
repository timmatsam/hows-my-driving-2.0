import { z } from "zod";

export const featureRequestFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title is not long enough. ",
    })
    .describe("The title of the feature request"),
  description: z
    .string()
    .min(10, {
      message: "Please write more for the description.",
    })
    .describe("The description of the feature request"),
});
