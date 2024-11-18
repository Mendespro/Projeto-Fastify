const jsPDF = require('jspdf').default;
require('jspdf-autotable');

async function generatePdfWithJsPDF(dados, titulo) {
  const doc = new jsPDF();

  // Cabeçalho do PDF
  doc.setFontSize(18);
  doc.text(titulo, 105, 20, { align: 'center' });

  // Informações Gerais
  doc.setFontSize(12);
  doc.text(`Relatório gerado em: ${new Date().toLocaleString()}`, 10, 30);

  // Configurar a tabela
  const tableData = dados.map((item, index) => [
    index + 1,
    new Date(item.dataTransacao).toLocaleString(),
    item.tipoTransacao,
    item.usuario?.nome || 'N/A',
    item.usuario?.matricula || 'N/A',
    item.responsavel?.nome || 'N/A',
  ]);

  doc.autoTable({
    head: [['#', 'Data', 'Tipo', 'Usuário', 'Matrícula', 'Responsável']],
    body: tableData,
    startY: 40,
  });

  // Retorna o PDF em formato de Buffer
  return doc.output('arraybuffer');
}

module.exports = { generatePdfWithJsPDF };
