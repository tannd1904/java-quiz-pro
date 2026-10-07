import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  style,
  ...rest
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--brand-primary)',
          color: '#ffffff',
          border: '1px solid var(--brand-primary)',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-surface-subtle)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--state-error)',
          color: '#ffffff',
          border: '1px solid var(--state-error)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '0.84rem',
          borderRadius: 'var(--radius-sm)',
          gap: '6px',
        };
      case 'md':
        return {
          padding: '10px 18px',
          fontSize: '0.92rem',
          borderRadius: 'var(--radius-md)',
          gap: '8px',
        };
      case 'lg':
        return {
          padding: '14px 26px',
          fontSize: '1.05rem',
          borderRadius: 'var(--radius-md)',
          gap: '10px',
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all var(--transition-fast)',
    width: fullWidth ? '100%' : 'auto',
    userSelect: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button
      className={`btn-modern ${className}`}
      disabled={disabled}
      style={baseStyles}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span style={{ display: 'flex' }}>{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span style={{ display: 'flex' }}>{icon}</span>}
    </button>
  );
};
