const { PrismaClient } = require('@prisma/client');
const { generateCardHash } = require('../utils/hash');

const prisma = new PrismaClient();

const cartaoService = {
  
  async criarCartao(numeroCartao, matricula) {
    // Gere o hash usando a função disponível em utils
    const hashCartao = generateCardHash(numeroCartao, matricula);

    // Crie o cartão no banco de dados
    const cartao = await prisma.cartao.create({
      data: {
        numeroCartao,
        hashCartao,
        status: 'ATIVO',  // Defina o status inicial como 'ATIVO'
        usuario: { connect: { matricula } }  // Associe o cartão ao usuário pela matrícula
      }
    });

    return cartao;
  },

  async bloquearCartao(numeroCartao, motivo) {
    const cartao = await prisma.cartao.update({
      where: { numeroCartao },
      data: {
        status: 'BLOQUEADO'
      }
    });
  
    // Registre o motivo do bloqueio
    await prisma.bloqueioCartao.create({
      data: {
        motivoBloqueio: motivo,
        idCartao: cartao.id
      }
    });
  
    return cartao;
  },
  
  async buscarCartao(numeroCartao) {
    const cartao = await prisma.cartao.findUnique({
      where: { numeroCartao },
      include: {
        usuario: true
      }
    });
  
    return cartao;
  },

  async validarCartao(numeroCartao, matricula) {
    const hashAtual = generateCardHash(numeroCartao, matricula);
    
    const cartao = await prisma.cartao.findFirst({
      where: {
        hashCartao: hashAtual,
        status: 'ATIVO',
      },
      include: {
        usuario: true,
      },
    });

    return cartao;
  },

  async registrarAcesso(cartaoId, tipoRefeicao) {
    return await prisma.$transaction(async (tx) => {
      const cartao = await tx.cartao.findUnique({
        where: { id: cartaoId },
        include: { usuario: true },
      });

      if (!cartao || cartao.status === 'BLOQUEADO') {
        throw new Error('Cartão inválido ou bloqueado');
      }

      const valorRefeicao = 2.50; // Valor exemplo

      if (cartao.usuario.saldo < valorRefeicao) {
        throw new Error('Saldo insuficiente');
      }

      // Registra refeição e acesso
      const [refeicao, acesso] = await Promise.all([
        tx.refeicao.create({
          data: {
            tipoRefeicao,
            valorRefeicao,
            idUsuario: cartao.idUsuario,
          },
        }),
        tx.acesso.create({
          data: {
            idCartao: cartao.id,
            permitido: true,
          },
        }),
      ]);

      // Atualiza saldo do usuário
      await tx.usuario.update({
        where: { id: cartao.idUsuario },
        data: { saldo: { decrement: valorRefeicao } },
      });

      return { refeicao, acesso };
    });
  },
};

module.exports = cartaoService;