import { Loader2 } from "lucide-react";
    
interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        {message && (
          <p className="text-lg font-medium text-primary">{message}</p>
        )}
      </div>
    </div>
  );
}
