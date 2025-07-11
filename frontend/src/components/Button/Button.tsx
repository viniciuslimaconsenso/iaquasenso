import { useNavigate } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline-custom';
  to?: string;
  icon?: React.ReactNode;
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
    if (to) {
      e.preventDefault();
      navigate(to);
    } else if (onClick) {
      onClick(e);
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