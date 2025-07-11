import { Button } from '../Button/Button';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  cadastroPath?: string;
  showButton?: boolean;
}

export const Header = ({
  title,
  subtitle,
  cadastroPath = '/cadastrar',
  showButton = true
}: HeaderProps) => {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      {showButton && (
        <Button
          variant="primary"
          to={cadastroPath}
        >
          Cadastrar
        </Button>
      )}
    </div>
  );
}; 