import { ButtonHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  to?: string;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  type = 'button',
  className = '',
  ...props 
}: ButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={to ? handleClick : props.onClick}
      {...props}
    >
      {children}
    </button>
  );
}; 