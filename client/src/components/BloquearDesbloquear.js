import React, { useState } from 'react';
import api from '../api/api';

function BloquearDesbloquear() {
  const [idCartao, setIdCartao] = useState('');
  const [motivo, setMotivo] = useState('');
  const [isBloquear, setIsBloquear] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isBloquear) {
        await api.post('/usuarios/bloquear', { idCartao, motivo });
        alert('Cartão bloqueado com sucesso!');
      } else {
        await api.post('/usuarios/desbloquear', { idCartao });
        alert('Cartão desbloqueado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao alterar status do cartão:', error);
      alert('Erro ao alterar status do cartão');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={idCartao} 
        onChange={(e) => setIdCartao(e.target.value)} 
        placeholder="ID do Cartão" 
        required 
      />
      {isBloquear && (
        <input 
          type="text" 
          value={motivo} 
          onChange={(e) => setMotivo(e.target.value)} 
          placeholder="Motivo do Bloqueio" 
          required 
        />
      )}
      <button type="submit">{isBloquear ? 'Bloquear Cartão' : 'Desbloquear Cartão'}</button>
      <button type="button" onClick={() => setIsBloquear(!isBloquear)}>
        {isBloquear ? 'Alternar para Desbloquear' : 'Alternar para Bloquear'}
      </button>
    </form>
  );
}

export default BloquearDesbloquear;
