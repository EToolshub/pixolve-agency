import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "w-full rounded-2xl border bg-ink-800/60 px-4 py-3.5 text-base text-heading sm:text-[15px] outline-none transition-all duration-200 placeholder:text-subtle hover:border-ink-500 focus:border-brand-500 focus:bg-ink-800 focus:ring-4 focus:ring-brand-500/15";

type FieldWrapperProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  valid?: boolean;
  optional?: boolean;
  required?: boolean;
  children: ReactNode;
};

/** Etiqueta + control + mensajes de ayuda/error accesibles. */
export function FieldWrapper({ id, label, error, hint, valid, optional, required, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center justify-between text-sm font-medium text-body-strong">
        <span>
          {label}
          {required && <span className="text-brand-400"> *</span>}
        </span>
        {optional && <span className="text-xs font-normal text-subtle">Opcional</span>}
      </label>
      <div className="relative">
        {children}
        {valid && !error && (
          <Check className="pointer-events-none absolute right-4 top-4 h-4.5 w-4.5 text-emerald-400" aria-hidden />
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function stateClasses(error?: string, valid?: boolean) {
  if (error) return "border-red-500/60 focus:border-red-500 focus:ring-red-500/15";
  if (valid) return "border-emerald-500/40 pr-11";
  return "border-input";
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: string; valid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, valid, id, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={invalid ? `${id}-error` : `${id}-hint`}
      className={cn(inputClasses, stateClasses(invalid, valid), className)}
      {...props}
    />
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: string; valid?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, valid, id, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      id={id}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={invalid ? `${id}-error` : `${id}-hint`}
      className={cn(inputClasses, "resize-y", stateClasses(invalid, valid), className)}
      {...props}
    />
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: string; valid?: boolean };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, valid, id, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      id={id}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={invalid ? `${id}-error` : `${id}-hint`}
      className={cn(inputClasses, "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2216%22%20height=%2216%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23ff7a3f%22%20stroke-width=%222%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11", stateClasses(invalid, valid), className)}
      {...props}
    >
      {children}
    </select>
  );
});
