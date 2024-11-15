import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/cadastro')}>Cadastro</button>
      <button onClick={() => navigate('/bloquear-desbloquear')}>Bloquear/Desbloquear Cartão</button>
      <button onClick={() => navigate('/recarga')}>Recarregar Cartão</button>
      <button onClick={() => navigate('/relatorio')}>Gerar Relatório</button>
      <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Sair</button>
    </div>
  );
}

export default Home;
