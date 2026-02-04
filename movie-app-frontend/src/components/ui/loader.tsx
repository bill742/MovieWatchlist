import { Loader2 } from "lucide-react";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ message, size = "md" }: LoaderProps) {
  const sizeClasses = {
    lg: "h-12 w-12",
    md: "h-8 w-8",
    sm: "h-6 w-6",
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Loader2
        className={`${sizeClasses[size]} text-primary animate-spin`}
        aria-hidden="true"
      />
      {message && <p className="text-muted-foreground text-lg">{message}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
