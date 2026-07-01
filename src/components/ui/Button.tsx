import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

import { hapticLight } from '../../utils/haptics';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth, children, onClick, ...props }, ref) => {
    const classNames = [
      styles.btn,
      styles[variant],
      size !== 'md' ? styles[size] : '',
      fullWidth ? styles.fullWidth : '',
      className
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      hapticLight();
      onClick?.(e);
    };

    return (
      <button ref={ref} className={classNames} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
