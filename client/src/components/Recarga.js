import React, { useState } from 'react';
import api from '../api/api';

function Recarga() {
  const [idCartao, setIdCartao] = useState('');
  const [valor, setValor] = useState('');

  const handleRecarga = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transacao/recarga', { idCartao, valor: parseFloat(valor) });
      alert('Recarga realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao recarregar cartão:', error);
      alert('Erro ao recarregar cartão');
    }
  };

  return (
    <form onSubmit={handleRecarga}>
      <input 
        type="text" 
        value={idCartao} 
        onChange={(e) => setIdCartao(e.target.value)} 
        placeholder="ID do Cartão" 
        required 
      />
      <input 
        type="number" 
        value={valor} 
        onChange={(e) => setValor(e.target.value)} 
        placeholder="Valor da Recarga" 
        required 
      />
      <button type="submit">Recarregar Cartão</button>
    </form>
  );
}

export default Recarga;
