"use server";

export async function submitFeatureRequest(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // Here you would typically save this data to a database
  // For this example, we'll just log it
  console.log("Feature Request:", { title, description });

  // Simulate a delay to mimic a database operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, message: "Feature request submitted successfully!" };
}
