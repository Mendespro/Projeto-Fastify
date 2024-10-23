const depositoService = {
    async realizarDeposito(matricula, valor) {
      try {
        return await prisma.$transaction(async (tx) => {
          // Busca usuário
          const usuario = await tx.usuario.findUnique({
            where: { matricula },
          });
  
          if (!usuario) {
            throw new Error('Usuário não encontrado');
          }
  
          // Registra o depósito
          const deposito = await tx.deposito.create({
            data: {
              valorDeposito: valor,
              idUsuario: usuario.id,
            },
          });
  
          // Atualiza o saldo
          await tx.usuario.update({
            where: { id: usuario.id },
            data: {
              saldo: {
                increment: valor,
              },
            },
          });
  
          // Registra no histórico
          await tx.historicoTransacao.create({
            data: {
              tipoTransacao: 'DEPOSITO',
              valor,
              idUsuario: usuario.id,
            },
          });
  
          return {
            deposito,
            mensagem: 'Depósito realizado com sucesso',
          };
        });
      } catch (error) {
        throw new Error(`Erro ao realizar depósito: ${error.message}`);
      }
    },
  };