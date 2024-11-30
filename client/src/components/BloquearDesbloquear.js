import React, { useState } from 'react';
import api from '../api/api';
import '../style/BloquearDesbloquear.css'; 

function BloquearDesbloquear() {
  const [idCartao, setIdCartao] = useState('');
  const [motivo, setMotivo] = useState('');
  const [isBloquear, setIsBloquear] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isBloquear ? '/usuarios/bloquear' : '/usuarios/desbloquear';
      const data = isBloquear ? { idCartao, motivo } : { idCartao };

      const response = await api.post(endpoint, data);
      alert(`${isBloquear ? 'Bloqueio' : 'Desbloqueio'} realizado com sucesso!`);
    } catch (error) {
      console.error('Erro ao alterar status do cartão:', error);
      alert(`Erro: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="bloquear-desbloquear-container">
      <h2>{isBloquear ? 'Bloquear Cartão' : 'Desbloquear Cartão'}</h2>
      <form onSubmit={handleSubmit} className="bloquear-desbloquear-form">
        <div className="form-group">
          <label htmlFor="idCartao">ID do Cartão</label>
          <input
            type="text"
            id="idCartao"
            value={idCartao}
            onChange={(e) => setIdCartao(e.target.value)}
            placeholder="Digite o ID do cartão"
            required
          />
        </div>
        {isBloquear && (
          <div className="form-group">
            <label htmlFor="motivo">Motivo do Bloqueio</label>
            <input
              type="text"
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Digite o motivo"
              required
            />
          </div>
        )}
        <div className="button-group">
          <button type="submit" className="action-button">
            {isBloquear ? 'Confirmar Bloqueio' : 'Confirmar Desbloqueio'}
          </button>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsBloquear(!isBloquear)}
          >
            {isBloquear ? 'Alternar para Desbloquear' : 'Alternar para Bloquear'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BloquearDesbloquear;
