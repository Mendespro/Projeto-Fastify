import React, { useState } from 'react';
import api from '../api/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Relatorio() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoTransacao, setTipoTransacao] = useState('');
  const [relatorio, setRelatorio] = useState([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const response = await api.get('/transacao/relatorio', {
        params: { dataInicio, dataFim, tipoTransacao },
      });
      setRelatorio(response.data.relatorio || []);
    } catch (error) {
      setErro(error.response?.data?.message || 'Erro ao gerar relatório.');
    } finally {
      setLoading(false); // Libera a tela após completar
    }
  };

  const handleExportarPdf = async () => {
    if (!dataInicio || !dataFim) {
      setErro('As datas de início e fim são obrigatórias.');
      return;
    }

    setErro('');
    setLoading(true); // Ativa o estado de carregamento

    try {
      const response = await api.get('/transacao/relatorio/pdf', {
        params: { dataInicio, dataFim, tipoTransacao },
        responseType: 'blob', // Recebe o PDF como um blob
      });

      // Cria o link de download do PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${Date.now()}.pdf`;
      link.click();

    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      setErro('Erro ao exportar PDF.');
    } finally {
      setLoading(false); // Libera o estado de carregamento
    }
  };

  return (
    <div>
      <h1>Relatório de Transações</h1>
      <form onSubmit={handleGerarRelatorio}>
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        <select value={tipoTransacao} onChange={(e) => setTipoTransacao(e.target.value)}>
          <option value="">Todos</option>
          <option value="BLOQUEIO">Bloqueios</option>
          <option value="DESBLOQUEIO">Desbloqueios</option>
          <option value="DEPOSITO">Recargas</option>
          <option value="LOGIN">Logins</option>
          <option value="CADASTRO">Cadastros</option>
          <option value="REFEICAO">Refeição</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </button>
      </form>
      <button onClick={handleExportarPdf} disabled={loading}>
        {loading ? 'Exportando...' : 'Exportar PDF'}
      </button>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {relatorio.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Usuário</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.dataTransacao).toLocaleString()}</td>
                <td>{item.tipoTransacao}</td>
                <td>{item.usuario?.nome || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Relatorio;