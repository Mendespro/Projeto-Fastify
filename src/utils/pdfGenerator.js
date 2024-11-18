const jsPDF = require('jspdf').default;
require('jspdf-autotable');

async function generatePdfWithJsPDF(dados, titulo) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(titulo, 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Relatório gerado em: ${new Date().toLocaleString()}`, 10, 30);

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

  return doc.output('arraybuffer');
}

module.exports = { generatePdfWithJsPDF };
