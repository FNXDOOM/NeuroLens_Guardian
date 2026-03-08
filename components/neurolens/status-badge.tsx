import { AlertCircle, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: 'safe' | 'warning' | 'distress' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const statusConfig = {
    safe: {
      bgColor: 'bg-[var(--safe)]',
      textColor: 'text-[var(--safe-foreground)]',
      label: 'Safe',
      icon: CheckCircle,
    },
    warning: {
      bgColor: 'bg-[var(--warning)]',
      textColor: 'text-[var(--warning-foreground)]',
      label: 'Warning',
      icon: AlertTriangle,
    },
    distress: {
      bgColor: 'bg-[var(--distress)]',
      textColor: 'text-[var(--distress-foreground)]',
      label: 'Distress',
      icon: AlertOctagon,
    },
    emergency: {
      bgColor: 'bg-[var(--distress)]',
      textColor: 'text-[var(--distress-foreground)]',
      label: 'Emergency',
      icon: AlertOctagon,
    },
  };

  // Fallback to 'safe' if status is invalid or undefined
  const config = statusConfig[status] || statusConfig.safe;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-3 py-1 rounded-full',
    md: 'text-lg font-semibold px-6 py-3 rounded-full',
    lg: 'text-2xl font-semibold px-8 py-4 rounded-full',
  };

  return (
    <div className={`${config.bgColor} ${config.textColor} ${sizeClasses[size]} flex items-center gap-2 w-fit`}>
      {showIcon && Icon && <Icon className={size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{config.label}</span>
    </div>
  );
}
