import { FeatureRequestForm } from "@/components/FeatureRequestForm";

export default function FeatureRequestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mx-auto mb-6 max-w-2xl text-3xl font-bold">
        Request a Feature
      </h1>
      <div className="mx-auto max-w-2xl">
        <FeatureRequestForm />
      </div>
    </div>
  );
}
