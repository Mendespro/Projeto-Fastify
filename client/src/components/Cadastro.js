import React, { useState } from 'react';
import api from '../api/api';
import '../style/Cadastro.css';

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

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      const { data } = await api.post('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(data.message || 'Cadastro realizado com sucesso!');
      setForm({ nome: '', matricula: '', email: '', role: 'ALUNO', senha: '', foto: null });
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao cadastrar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite o nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="matricula">Matrícula</label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            placeholder="Digite a matrícula"
            value={form.matricula}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite o email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Papel</label>
          <select id="role" name="role" value={form.role} onChange={handleChange}>
            <option value="ALUNO">Aluno</option>
            <option value="FUNCIONARIO">Funcionário</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        {form.role !== 'ALUNO' && (
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite a senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="foto">Foto</label>
          <input type="file" id="foto" name="foto" onChange={handleChange} />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}

export default Cadastro;
