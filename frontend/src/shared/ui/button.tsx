import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { buttonClass, type ButtonSize as Size, type ButtonVariant as Variant } from '@/shared/ui/button-styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={buttonClass({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

export function ButtonLink({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}: PropsWithChildren<ButtonLinkProps>) {
  return (
    <Link
      className={buttonClass({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
