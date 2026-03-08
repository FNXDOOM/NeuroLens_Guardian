import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function ActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: ActionButtonProps) {
  const baseClasses =
    'flex flex-col items-center justify-center rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg py-3 px-6',
    secondary: 'bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 hover:shadow-md py-3 px-6',
    danger: 'bg-[var(--distress)] text-[var(--distress-foreground)] hover:opacity-90 hover:shadow-lg py-3 px-6',
  };

  const sizeClasses = {
    sm: 'gap-2',
    md: 'text-lg py-4 px-8 gap-3',
    lg: 'py-6 px-8 text-xl gap-4',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      <span>{label}</span>
      {description && <span className="text-xs opacity-80 font-normal">{description}</span>}
    </button>
  );
}
