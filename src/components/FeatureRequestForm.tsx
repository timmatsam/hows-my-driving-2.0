"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { toast } from "sonner";
import { submitFeatureRequest } from "@/app/actions/feature-request";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { featureRequestFormSchema } from "@/types/schema";
import { useState } from "react";

export function FeatureRequestForm() {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof featureRequestFormSchema>>({
    resolver: zodResolver(featureRequestFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(formData: z.infer<typeof featureRequestFormSchema>) {
    setPending(true);
    try {
      const result = await submitFeatureRequest(formData);
      if (result.success) {
        toast.success("Feature request submitted successfully!", {
          description: formData.title,
        });
        form.reset();
      } else {
        console.error(result.message);
        toast.error("Failed to submit feature request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Provide a concise title for your feature request."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a detailed description of what you're proposing."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!form.formState.isValid || pending}>
          {pending ? "Submitting..." : "Submit Feature Request"}
        </Button>
      </form>
    </Form>
  );
}
