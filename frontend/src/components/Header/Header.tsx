import { Button } from '../Button/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onCadastroClick?: () => void;
  cadastroPath?: string;
}

export const Header = ({
  title,
  subtitle,
  onCadastroClick,
  cadastroPath = '/cadastro'
}: HeaderProps) => {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      <Button
        variant="primary"
        onClick={onCadastroClick}
        to={!onCadastroClick ? cadastroPath : undefined}
      >
        Cadastrar
      </Button>
    </div>
  );
}; 