export type ButtonColor = 'primary' | 'secondary' | 'destructive' | 'success' | 'info' | 'warning' | 'muted';
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'plain';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type IconButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface BaseButtonProps {
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
