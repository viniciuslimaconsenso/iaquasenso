import type { ButtonHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-custom';
  to?: string;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  type = 'button',
  className = '',
  onClick,
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
      return `btn btn-outline-custom ${className}`;
    }
    return `btn btn-${variant} ${className}`;
  };

  return (
    <button
      type={type}
      className={getButtonClass()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}; 