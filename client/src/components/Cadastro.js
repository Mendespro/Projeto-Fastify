import React, { useState } from 'react';
import api from '../api/api';

function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    matricula: '',
    email: '',
    role: 'ALUNO',
    senha: '',
    foto: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Evita múltiplos envios enquanto a requisição está pendente

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      const { data } = await api.post('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.message) {
        alert(data.message);
        setForm({ nome: '', matricula: '', email: '', role: 'ALUNO', senha: '', foto: null }); // Reset do formulário
      } else {
        throw new Error(data.error || 'Erro ao processar cadastro.');
      }
    } catch (error) {
      alert(error.response?.data?.error || error.message || 'Erro ao cadastrar usuário.');
    } finally {
      setIsSubmitting(false); // Permite novos envios
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={form.nome}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="matricula"
        placeholder="Matrícula"
        value={form.matricula}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="ALUNO">Aluno</option>
        <option value="FUNCIONARIO">Funcionário</option>
        <option value="ADMIN">Administrador</option>
      </select>
      {form.role !== 'ALUNO' && (
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
      )}
      <input type="file" name="foto" onChange={handleChange} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}

export default Cadastro;
