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
  solicitacao: Solicitacoes | undefined; // Adicione a propriedade solicitacao

  constructor(private service: SolicitacoesService) {}

  ngOnInit() {
    this.filtroStatus = 'Em Andamento' ;
    this.obterSolicitacoes();
  }

  async obterSolicitacoes() {
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
    if (this.filtroNome.trim() === '') {
      this.obterSolicitacoes();
    } else {
      this.service
        .listarSolicitacoesPorEmailServidor()
        .toPromise()
        .then((solicitacoes) => {
          this.listaSolicitacoes = solicitacoes.filter(
            (solicitacao: Solicitacoes) =>
              solicitacao.aluno.nomeCompleto
                .toLowerCase()
                .includes(this.filtroNome.toLowerCase())
          );
          this.ordenarSolicitacoes();
        });
    }
  }

  filtrarPorData() {
    // Convertemos as datas de string para objetos Date
    const filtroDataInicial = new Date(this.filtroDataInicial);
    const filtroDataFinal = new Date(this.filtroDataFinal);

    this.service
      .listarSolicitacoesPorEmailServidor()
      .toPromise()
      .then((solicitacoes) => {
        this.listaSolicitacoes = solicitacoes.filter(
          (solicitacao: Solicitacoes) => {
            // Convertemos a data da solicitação para um objeto Date
            const dataSolicitacao = new Date(solicitacao.dataSolicitacao);

            // Comparamos as datas
            return (
              dataSolicitacao >= filtroDataInicial &&
              dataSolicitacao <= filtroDataFinal
            );
          }
        );
        this.ordenarSolicitacoes();
      });
  }

  filtrarPorStatus() {
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
}
