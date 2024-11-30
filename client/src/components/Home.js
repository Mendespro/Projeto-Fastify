import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Home.css'; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bem-vindo ao Smart Campus</h1>
      <p>Selecione uma opção para continuar:</p>
      <div className="home-buttons">
        <button onClick={() => navigate('/cadastro')} className="home-button">Cadastro</button>
        <button onClick={() => navigate('/bloquear-desbloquear')} className="home-button">Bloquear/Desbloquear Cartão</button>
        <button onClick={() => navigate('/recarga')} className="home-button">Recarregar Cartão</button>
        <button onClick={() => navigate('/relatorio')} className="home-button">Gerar Relatório</button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="home-button logout-button"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default Home;
