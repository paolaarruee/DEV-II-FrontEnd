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
  todasSolicitacoes: Solicitacoes[] = [];
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
    this.filtroStatus = 'EM ANDAMENTO';
    this.obterTodasSolicitacoes();
    this.filtrarPorStatus();
  }

  obterTodasSolicitacoes() {
    this.service.listarSolicitacoesPorEmailServidor().toPromise().then((solicitacoes) => {
      this.todasSolicitacoes = solicitacoes;
      this.filtrarPorStatus();
      this.ordenarSolicitacoes();
    }).catch((error) => {
      console.error('Erro ao obter as solicitações:', error);
    });
  }

  filtrarPorNome(): void {
    this.paginaAtual = 1;
    if (this.filtroNome.trim() === '') {
      this.listaSolicitacoes = [...this.todasSolicitacoes];
    } else {
      this.listaSolicitacoes = this.todasSolicitacoes.filter((solicitacao: Solicitacoes) =>
        solicitacao.status.toLowerCase() === 'em andamento' &&
        solicitacao.aluno.nomeCompleto
        .toLowerCase()
        .includes(this.filtroNome.toLowerCase())
      );

      this.ordenarSolicitacoes();
    }
  }

  filtrarPorData() {
    this.paginaAtual = 1;
    const filtroDataInicial = new Date(this.filtroDataInicial);
    const filtroDataFinal = new Date(this.filtroDataFinal);
    
    // Define a data final para o próximo dia
    const dataFinal2 = new Date(filtroDataFinal.getTime() + 86400000); // Adiciona 24 horas em milissegundos
    
    this.listaSolicitacoes = this.todasSolicitacoes.filter((solicitacao: Solicitacoes) => {
      // Verifica se a solicitação está Em Andamento
      if (solicitacao.status.toLowerCase() === 'em andamento') {
        // Converte a data da solicitação para um objeto Date
        const dataSolicitacao = new Date(solicitacao.dataSolicitacao);

        // Remove as informações de hora, minuto, segundo e milissegundo
        dataSolicitacao.setHours(0, 0, 0, 0);

        // Compara as datas
        return (
          dataSolicitacao >= filtroDataInicial &&
          dataSolicitacao <= dataFinal2
        );
      } else {
        return false; // Ignora as solicitações que não estão Em Andamento
      }
    });

    this.ordenarSolicitacoes();
  }
  
  filtrarPorStatus() {
    this.paginaAtual = 1;
  
    if (this.filtroStatus === 'todas') {
      this.listaSolicitacoes = [...this.todasSolicitacoes];
    } else {
      const filtroStatusLowerCase = this.filtroStatus.toLowerCase();
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          const statusLowerCase = solicitacao.status.toLowerCase();
          return statusLowerCase.includes(filtroStatusLowerCase);
        }
      );
    }
  
    this.ordenarSolicitacoes();
  }  

  

  ordenarSolicitacoes() {
    this.listaSolicitacoes.sort((a, b) => {
      const dataA = new Date(a.dataSolicitacao).getTime();
      const dataB = new Date(b.dataSolicitacao).getTime();
      return dataB - dataA;
    });
  }

  atualizarPagina(): void {
    setTimeout(() => {
      // Recarrega a página para exibir os resultados filtrados
      location.reload();
    }, 100); // Aguarda 100ms antes de recarregar a página
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
