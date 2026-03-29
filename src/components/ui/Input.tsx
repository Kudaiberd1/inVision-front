import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-sm font-medium text-neutral-600">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-[#E5E5E4] bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-[#C8E63C] focus:ring-0 ${
          error ? 'border-[#F87171]' : ''
        } ${className}`}
        {...rest}
      />
      {hint && !error && <span className="text-xs text-neutral-500">{hint}</span>}
      {error && <span className="text-xs text-[#F87171]">{error}</span>}
    </label>
  );
}
