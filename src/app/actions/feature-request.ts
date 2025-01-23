"use server";
import { featureRequestFormSchema } from "@/types/schema";
import { env } from "@/env";
import { Resend } from "resend";
import { type z } from "zod";

const resend = new Resend(env.RESEND_API_KEY);

export async function submitFeatureRequest(
  formData: z.infer<typeof featureRequestFormSchema>,
) {
  const { title, description } = featureRequestFormSchema.parse(formData);

  const res = await resend.emails.send({
    from: env.FEATURE_REQUEST_FROM_EMAIL,
    to: env.FEATURE_REQUEST_TO_EMAIL,
    subject: title,
    html: `<p>${description}</p>`,
  });
  if (res.error) return { success: false, message: res.error.message };
  return {
    success: true,
    message: null,
  };
}

