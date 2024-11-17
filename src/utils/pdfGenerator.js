const PDFDocument = require('pdfkit');

async function generatePdf(dados, titulo) {
  const doc = new PDFDocument();
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => console.log('PDF gerado com sucesso.'));

  doc
    .fontSize(18)
    .text(titulo, { align: 'center' })
    .moveDown(0.5);

  doc.fontSize(10);
  doc.text(`Período: ${dados[0].dataTransacao} - ${dados[dados.length - 1].dataTransacao}`);
  doc.moveDown(1);

  // Tabela manual
  dados.forEach((item, index) => {
    doc.text(`${index + 1}. Data: ${new Date(item.dataTransacao).toLocaleString()}`);
    doc.text(`   Tipo: ${item.tipoTransacao}`);
    doc.text(`   Usuário: ${item.usuario?.nome || 'N/A'}`);
    doc.text(`   Responsável: ${item.responsavel?.nome || 'N/A'}`);
    doc.moveDown(0.5);
  });

  doc.end();
  return Buffer.concat(buffers);
}

module.exports = { generatePdf };
