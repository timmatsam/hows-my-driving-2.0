import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SearchForm } from "@/components/search-form/SearchForm";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchForm />
    </Suspense>
  );
}
