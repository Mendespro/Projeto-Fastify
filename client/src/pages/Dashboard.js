import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h2>Bem-vindo ao Smart Campus</h2>
      <Link to="/usuarios">Gerenciar Usuários</Link>
      <Link to="/transacoes">Registrar Transações</Link>
      <Link to="/relatorio">Gerar Relatório</Link>
    </div>
  );
};

export default Dashboard;
