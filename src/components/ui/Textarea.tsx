import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...rest }: TextareaProps) {
  const tid = id ?? rest.name;
  return (
    <label className="block space-y-1.5" htmlFor={tid}>
      <span className="text-sm font-medium text-neutral-600">{label}</span>
      <textarea
        id={tid}
        className={`min-h-[160px] w-full rounded-lg border border-[#E5E5E4] bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-[#C8E63C] focus:ring-0 ${
          error ? 'border-[#F87171]' : ''
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-[#F87171]">{error}</span>}
    </label>
  );
}
