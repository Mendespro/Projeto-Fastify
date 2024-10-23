const refeicaoService = {
    async buscarRefeicoesPorPeriodo(dataInicio, dataFim) {
      try {
        return await prisma.refeicao.findMany({
          where: {
            dataRefeicao: {
              gte: new Date(dataInicio),
              lte: new Date(dataFim),
            },
          },
          include: {
            usuario: {
              select: {
                nome: true,
                matricula: true,
              },
            },
          },
          orderBy: {
            dataRefeicao: 'desc',
          },
        });
      } catch (error) {
        throw new Error(`Erro ao buscar refeições: ${error.message}`);
      }
    },
  
    async gerarRelatorioRefeicoes(dataInicio, dataFim) {
      try {
        const refeicoes = await this.buscarRefeicoesPorPeriodo(dataInicio, dataFim);
        
        const relatorio = {
          periodo: {
            inicio: dataInicio,
            fim: dataFim,
          },
          totalRefeicoes: refeicoes.length,
          valorTotal: refeicoes.reduce((acc, ref) => acc + Number(ref.valorRefeicao), 0),
          refeicoesPorTipo: {
            ALMOCO: refeicoes.filter(r => r.tipoRefeicao === 'ALMOCO').length,
            JANTAR: refeicoes.filter(r => r.tipoRefeicao === 'JANTAR').length,
          },
          refeicoes,
        };
  
        return relatorio;
      } catch (error) {
        throw new Error(`Erro ao gerar relatório: ${error.message}`);
      }
    },
  };