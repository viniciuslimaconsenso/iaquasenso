import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input/Input';
import { Button } from '../components/Button/Button';
import './styles.css';

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto, apenas redireciona para a página principal
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Bem-vindo</h2>
          <p>Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome de usuário"
            error={errors.username}
          />

          <div className="password-container">
            <Input
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              error={errors.password}
            />
            <button 
              type="button" 
              className="forgot-password-link"
              onClick={() => {/* Implementar recuperação de senha */}}
            >
              Esqueci minha senha
            </button>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}; 