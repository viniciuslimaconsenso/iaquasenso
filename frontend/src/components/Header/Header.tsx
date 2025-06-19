import { Button } from '../Button/Button';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onCadastroClick?: () => void;
  cadastroPath?: string;
  showButton?: boolean;
}

export const Header = ({
  title,
  subtitle,
  onCadastroClick,
  cadastroPath = '/cadastrar',
  showButton = true
}: HeaderProps) => {
  console.log('Header rendered with cadastroPath:', cadastroPath);
  
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      {showButton && (
        <Button
          variant="primary"
          onClick={onCadastroClick}
          to={cadastroPath}
        >
          Cadastrar
        </Button>
      )}
    </div>
  );
}; 