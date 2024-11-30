import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../style/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Bem-vindo!</h2>
        <p>Faça login para acessar o sistema.</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
