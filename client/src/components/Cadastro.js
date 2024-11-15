import React, { useState } from 'react';
import api from '../api/api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ALUNO');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Evitar múltiplos envios

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Evita envios duplicados

    setIsSubmitting(true); // Bloqueia o botão enquanto o envio é processado

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('matricula', matricula);
    formData.append('email', email);
    formData.append('role', role);
    if (role !== 'ALUNO') {
      formData.append('senha', senha);
    }
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      await api.post('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Usuário cadastrado com sucesso!');
      // Limpar campos após o sucesso
      setNome('');
      setMatricula('');
      setEmail('');
      setRole('ALUNO');
      setSenha('');
      setFoto(null);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.response?.data || error.message);
      alert('Erro ao cadastrar usuário');
    } finally {
      setIsSubmitting(false); // Libera o botão para novas submissões
    }
  };

  return (
    <form onSubmit={handleCadastro}>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        required
      />
      <input
        type="text"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
        placeholder="Matrícula"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="ALUNO">Aluno</option>
        <option value="FUNCIONARIO">Funcionário</option>
        <option value="ADMIN">Administrador</option>
      </select>
      {(role === 'FUNCIONARIO' || role === 'ADMIN') && (
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
      )}
      <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Cadastrar'}
      </button>
    </form>
  );
}

export default Cadastro;
