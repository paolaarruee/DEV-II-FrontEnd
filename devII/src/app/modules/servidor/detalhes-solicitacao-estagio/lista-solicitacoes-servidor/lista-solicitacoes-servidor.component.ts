import { Component, OnInit } from '@angular/core';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';
import { Solicitacoes } from 'src/app/shared/interfaces/solicitacoes';
import { Servidor } from 'src/app/shared/interfaces/servidor';

@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss'],
})
export class ListaSolicitacoesServidorComponent implements OnInit {
  listaSolicitacoes: Solicitacoes[] = [];
  filtroNome: string = '';
  filtroDataInicial: Date = new Date();
  filtroDataFinal: Date = new Date();
  filtroStatus: string = '';
  dataSolicitacao: Date = new Date();
  solicitacao: Solicitacoes | undefined;
  paginaAtual: number = 1;
  solicitacoesPorPagina: number = 5;


  constructor(private service: SolicitacoesService) {}

  ngOnInit() {
    this.filtroStatus = 'Em Andamento';
    this.obterSolicitacoes();
    this.filtrarPorStatus();
  }

    async obterSolicitacoes() {
    this.paginaAtual = 1; 
    try {
      this.listaSolicitacoes = await this.service
        .listarSolicitacoesPorEmailServidor()
        .toPromise();

      // Filtrar as solicitações pelo status padrão
      this.filtrarPorStatus();

      this.ordenarSolicitacoes();
    } catch (error) {
      console.error('Erro ao obter as solicitações:', error);
    }
  }

  isCargoInvalido(): boolean {
    return (
      this.listaSolicitacoes[1]?.servidor?.cargo === 'setor de estágio' ||
      this.listaSolicitacoes[1]?.servidor?.cargo === 'diretoria'
    );
  }

  filtrarPorNome() {
    this.paginaAtual = 1; 
    if (this.filtroNome.trim() === '') {
      this.obterSolicitacoes();
    } else {
      this.service
        .listarSolicitacoesPorEmailServidor()
        .toPromise()
        .then((solicitacoes) => {
          this.listaSolicitacoes = solicitacoes.filter((solicitacao: Solicitacoes) =>
          solicitacao.status === 'Em Andamento' &&
          solicitacao.aluno.nomeCompleto
          .toLowerCase()
          .includes(this.filtroNome.toLowerCase())
        );
        
          this.ordenarSolicitacoes();
        });
    }
  }

  filtrarPorData() {
    this.paginaAtual = 1; 
    const filtroDataInicial = new Date(this.filtroDataInicial);
    const filtroDataFinal = new Date(this.filtroDataFinal);
  
    
    const dataFinal2 = new Date(); 
    dataFinal2.setDate(filtroDataFinal.getDate() + 1);
  
    this.service
      .listarSolicitacoesPorEmailServidor()
      .toPromise()
      .then((solicitacoes) => {
        this.listaSolicitacoes = solicitacoes.filter((solicitacao: Solicitacoes) => {
          // Verifica se a solicitação está em andamento
          if (solicitacao.status === 'Em Andamento') {
            // Converte a data da solicitação para um objeto Date
            const dataSolicitacao = new Date(solicitacao.dataSolicitacao);
        
            // Compara as datas
            return (
              dataSolicitacao >= filtroDataInicial &&
              dataSolicitacao <= dataFinal2
            );
          } else {
            return false; // Ignora as solicitações que não estão em andamento
          }
        });
        
        this.ordenarSolicitacoes();
      });
  }
  

  filtrarPorStatus() {    
    this.paginaAtual = 1;          
    if (this.filtroStatus === 'todas') {
      this.obterSolicitacoes();
    } else {
      this.service
        .listarSolicitacoesPorEmailServidor()
        .toPromise()
        .then((solicitacoes) => {
          this.listaSolicitacoes = solicitacoes.filter(
            (solicitacao: Solicitacoes) => {
              return solicitacao.status === this.filtroStatus;
            }
          );

          this.ordenarSolicitacoes();
        });
    }
  }

  ordenarSolicitacoes() {
    this.listaSolicitacoes.sort((a, b) => {
      const dataA = new Date(a.dataSolicitacao).getTime();
      const dataB = new Date(b.dataSolicitacao).getTime();
      return dataB - dataA;
    });
  }

  atualizarPagina() {
    // Recarrega a página para exibir os resultados filtrados
    location.reload();
  }

  get solicitacoesPagina(): Solicitacoes[] {
  const inicio = (this.paginaAtual - 1) * this.solicitacoesPorPagina;
  const fim = inicio + this.solicitacoesPorPagina;
  return this.listaSolicitacoes.slice(inicio, fim);
}

get totalPaginas(): number {
  return Math.ceil(this.listaSolicitacoes.length / this.solicitacoesPorPagina);
}

irParaPagina(pagina: number) {
  if (pagina >= 1 && pagina <= this.totalPaginas) {
    this.paginaAtual = pagina;
  }
}

paginaAnterior() {
  this.irParaPagina(this.paginaAtual - 1);
}

proximaPagina() {
  this.irParaPagina(this.paginaAtual + 1);
}

isPaginaAnteriorDisabled(): boolean {
  return this.paginaAtual === 1;
}

isProximaPaginaDisabled(): boolean {
  return this.paginaAtual === this.totalPaginas;
}




}
