const prisma = require('../config/database');
const { hashPassword, generateCardHash } = require('../utils/hash');

const usuarioService = {
  async criarUsuario(usuarioData) {
    const hashedPassword = usuarioData.role !== 'ALUNO' ? hashPassword(usuarioData.senha) : null;

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: usuarioData.nome,
        matricula: usuarioData.matricula,
        email: usuarioData.email,
        senha: hashedPassword,
        fotoUsuario: usuarioData.fotoUsuario || null,
        role: usuarioData.role,
      },
    });

    if (usuarioData.role === 'ALUNO') {
      const hashCartao = generateCardHash(usuarioData.matricula);
      await prisma.cartao.create({
        data: { hashCartao, status: 'ATIVO', idUsuario: novoUsuario.id },
      });
    }

    return novoUsuario;
  },

  async atualizarUsuario(matricula, dados) {
    try {
      const usuario = await prisma.usuario.update({
        where: { matricula },
        data: dados,
      });

      return usuario;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  },

  async buscarHistoricoUsuario(matricula) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { matricula },
        include: {
          refeicoes: true,
          depositos: true,
          historicos: true,
          cartoes: {
            include: {
              acessos: true,
              bloqueios: true,
            },
          },
        },
      });

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      return usuario;
    } catch (error) {
      throw new Error(`Erro ao buscar histórico: ${error.message}`);
    }
  },
};

module.exports = {
  acessoService,
  depositoService,
  refeicaoService,
  usuarioService,
};
