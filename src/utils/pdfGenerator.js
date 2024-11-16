const PDFDocument = require('pdfkit');

async function generatePdf(dados, titulo) {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => console.log('PDF gerado com sucesso.'));

  doc.fontSize(16).text(titulo, { align: 'center' }).moveDown();

  dados.forEach((dado, index) => {
    doc
      .fontSize(12)
      .text(`${index + 1}. Data: ${new Date(dado.dataTransacao).toLocaleString()}`)
      .text(`   Tipo: ${dado.tipoTransacao}`)
      .text(`   Usuário: ${dado.usuario?.nome || 'N/A'}`)
      .moveDown();
  });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
}

module.exports = { generatePdf };
