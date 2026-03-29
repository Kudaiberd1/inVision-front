import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'danger'
    | 'success'
    | 'publicPrimary'
    | 'publicOutline';
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8E63C] disabled:opacity-50 disabled:pointer-events-none';
  const radiusPad =
    variant === 'publicPrimary' || variant === 'publicOutline'
      ? 'rounded-lg px-6 py-3 text-sm'
      : 'rounded-lg px-6 py-2.5 text-sm';
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-[#C8E63C] text-black hover:bg-[#A8C420] font-semibold',
    secondary:
      'border border-neutral-300 bg-white font-medium text-neutral-900 hover:border-[#C8E63C] hover:bg-[#C8E63C]/5',
    ghost:
      'bg-transparent font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
    danger:
      'border border-[#F87171] bg-white font-medium text-[#F87171] hover:bg-[#F87171]/10',
    success: 'bg-[#C8E63C] text-black hover:bg-[#A8C420] font-semibold',
    publicPrimary: 'bg-[#C8E63C] text-black hover:bg-[#A8C420] font-semibold',
    publicOutline:
      'border border-neutral-300 bg-white font-medium text-neutral-900 hover:border-[#C8E63C] hover:bg-[#C8E63C]/10',
  };
  return (
    <button
      type={type}
      className={`${base} ${radiusPad} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
