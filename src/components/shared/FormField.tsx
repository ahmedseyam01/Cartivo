import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Labelled input wired to react-hook-form's `register`, with an accessible error message. */
export function TextField({
  label,
  registration,
  error,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "name"> & {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}) {
  const id = props.id ?? registration.name;
  const errorId = `${id}-error`;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="h-11 rounded-xl"
        {...props}
        {...registration}
      />
      {error?.message && (
        <p id={errorId} className="text-destructive text-xs">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm">
      {message}
    </p>
  );
}
