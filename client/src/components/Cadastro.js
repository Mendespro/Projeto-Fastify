import React, { useState } from 'react';
import api from '../api/api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ALUNO');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', { nome, matricula, email, role });
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  return (
    <form onSubmit={handleCadastro}>
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
      <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Matrícula" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="ALUNO">Aluno</option>
        <option value="FUNCIONARIO">Funcionário</option>
        <option value="ADMIN">Administrador</option>
      </select>
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default Cadastro;
