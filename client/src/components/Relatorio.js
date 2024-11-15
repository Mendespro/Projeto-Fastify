import React, { useState } from 'react';
import api from '../api/api';

function Relatorio() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [relatorio, setRelatorio] = useState(null);

  const handleGerarRelatorio = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get('/transacao/relatorio', {
        params: { dataInicio, dataFim },
      });
      setRelatorio(response.data.relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório');
    }
  };

  return (
    <div>
      <form onSubmit={handleGerarRelatorio}>
        <input 
          type="date" 
          value={dataInicio} 
          onChange={(e) => setDataInicio(e.target.value)} 
          required 
        />
        <input 
          type="date" 
          value={dataFim} 
          onChange={(e) => setDataFim(e.target.value)} 
          required 
        />
        <button type="submit">Gerar Relatório</button>
      </form>

      {relatorio && (
        <div>
          <h3>Relatório de Transações</h3>
          <ul>
            {relatorio.map((transacao) => (
              <li key={transacao.id}>
                {transacao.dataTransacao} - {transacao.tipoTransacao} - R${transacao.valor} - Usuário: {transacao.usuario.nome}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Relatorio;
