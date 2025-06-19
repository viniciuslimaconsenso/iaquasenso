import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-custom';
  to?: string;
  icon?: ReactNode;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  type = 'button',
  className = '',
  onClick,
  icon,
  ...props 
}: ButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked, to:', to);
    
    if (onClick) {
      console.log('Executing onClick handler');
      onClick(e);
    }
    
    if (to) {
      console.log('Navigating to:', to);
      navigate(to);
    }
  };

  const getButtonClass = () => {
    if (variant === 'outline-custom') {
      return `btn btn-outline-custom d-flex align-items-center gap-2 ${className}`;
    }
    return `btn btn-${variant} d-flex align-items-center gap-2 ${className}`;
  };

  return (
    <button
      type={type}
      className={getButtonClass()}
      onClick={handleClick}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}; 