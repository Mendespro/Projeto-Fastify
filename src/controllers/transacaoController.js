const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { transacaoService } = require('../services/transacaoService');
const { generatePdfWithJsPDF } = require('../utils/pdfGenerator');

const transacaoController = {
  async registrarAcesso(request, reply) {
    try {
      const { hashCartao, leitorId, timestamp } = request.body;
    
      if (!hashCartao || !leitorId || !timestamp) {
        return reply.code(400).send({ error: 'Campos obrigatórios ausentes' });
      }
  
      const autenticacao = await transacaoService.realizarAutenticacaoMutua(hashCartao, leitorId);
  
      return reply.code(200).send({ message: 'Acesso registrado com sucesso!' });
    } catch (error) {
      console.error('Erro ao registrar acesso:', error.message);
      if (!reply.sent) {
        return reply.code(500).send({ error: 'Erro interno ao registrar acesso' });
      }
    }
  },

  async realizarDebito(request, reply) {
    try {
      const { cartaoId } = request.body;
  
      if (!cartaoId) {
        return reply.code(400).send({ error: 'O ID do cartão é obrigatório.' });
      }
  
      const valorRefeicao = 1.00; 
      const resultado = await transacaoService.registrarTransacao(cartaoId, 'REFEICAO', valorRefeicao);
  
      reply.code(200).send({ message: 'Débito realizado com sucesso', resultado });
    } catch (error) {
      console.error('Erro ao realizar débito:', error);
      reply.code(500).send({ error: error.message });
    }
  },  

  async realizarRecarga(request, reply) {
    try {
      const { hashCartao, matricula, valor} = request.body;
      
      const cartao = await transacaoService.validarCartao(hashCartao, matricula);
      const resultado = await transacaoService.registrarTransacao(cartao.id, 'DEPOSITO', valor);

      return reply.code(200).send({ message: 'Recarga realizada com sucesso', resultado });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  },

  async bloquearCartao(request, reply) {
    try {
      const { hashCartao, motivo} = request.body;
      
      const cartao = await transacaoService.validarCartao(hashCartao);
      const resultado = await transacaoService.bloquearCartao(cartao.id, motivo);

      return reply.code(200).send({ message: 'Cartão bloqueado com sucesso', resultado });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  },

  async gerarRelatorio(request, reply) {
    try {
      const { dataInicio, dataFim, tipoTransacao } = request.query;

      if (!dataInicio || !dataFim) {
        return reply.code(400).send({ message: 'Datas de início e fim são obrigatórias.' });
      }

      const filtros = {
        dataTransacao: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      };

      if (tipoTransacao) {
        filtros.tipoTransacao = tipoTransacao;
      }
      
      console.log('Filtros aplicados:', filtros);

      const relatorio = await prisma.historicoTransacao.findMany({
        where: filtros,
        include: {
          usuario: { select: { nome: true, matricula: true } },
        },
        orderBy: { dataTransacao: 'desc' },
      });
      
      if (!relatorio.length) {
        return reply.code(404).send({ message: 'Nenhum dado encontrado para o filtro fornecido.' });
      }
      console.log('Dados do relatório:', relatorio);
      return reply.code(200).send({ relatorio });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return reply.code(500).send({ message: 'Erro ao gerar relatório.' });
    }
  },

  async gerarRelatorioPdf(request, reply) {
    try {
      const { dataInicio, dataFim, tipoTransacao } = request.query;
  
      if (!dataInicio || !dataFim) {
        return reply.code(400).send({ message: 'Datas de início e fim são obrigatórias.' });
      }
  
      const filtros = {
        dataTransacao: {
          gte: new Date(`${dataInicio}T00:00:00`),
          lte: new Date(`${dataFim}T23:59:59`),
        },
      };
  
      if (tipoTransacao) {
        filtros.tipoTransacao = tipoTransacao;
      }
  
      const relatorio = await prisma.historicoTransacao.findMany({
        where: filtros,
        include: {
          usuario: { select: { nome: true, matricula: true } },
          responsavel: { select: { nome: true } },
        },
        orderBy: { dataTransacao: 'desc' },
      });
  
      if (!relatorio.length) {
        return reply.code(404).send({ message: 'Nenhum dado encontrado para o filtro fornecido.' });
      }
  
      const pdfBuffer = await generatePdfWithJsPDF(relatorio, 'Relatório de Transações');
      reply
        .header('Content-Type', 'application/pdf')
        .header('Content-Disposition', 'attachment; filename="relatorio.pdf"');
      return reply.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error('Erro ao gerar PDF:', error.message);
      return reply.code(500).send({ message: 'Erro ao gerar PDF.', detalhes: error.message });
    }
  }
};

module.exports = transacaoController;
