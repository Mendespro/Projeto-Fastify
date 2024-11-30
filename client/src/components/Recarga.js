import React, { useState } from 'react';
import api from '../api/api';
import '../style/Recarga.css';

function Recarga() {
  const [idCartao, setIdCartao] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecarga = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/usuarios/recarregar', {
        idCartao,
        valor: parseFloat(valor),
      });
      alert('Recarga realizada com sucesso!');
      setIdCartao('');
      setValor('');
    } catch (error) {
      console.error('Erro ao recarregar cartão:', error);
      alert('Erro ao recarregar cartão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recarga-container">
      <h2>Recarga de Cartão</h2>
      <form onSubmit={handleRecarga} className="recarga-form">
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
        <div className="form-group">
          <label htmlFor="valor">Valor da Recarga</label>
          <input
            type="number"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Digite o valor"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Processando...' : 'Recarregar Cartão'}
        </button>
      </form>
    </div>
  );
}

export default Recarga;
