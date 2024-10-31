const usuarioService = {
  async criarUsuario(dados) {
    try {
      const { nome, matricula, email, senha, fotoUsuario } = dados;

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { matricula },
      });

      if (usuarioExistente) {
        throw new Error('Já existe um usuário com esta matrícula');
      }

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          matricula,
          email,
          senha, // Lembre-se de adicionar hash na senha
          fotoUsuario,
        },
      });

      return usuario;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
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