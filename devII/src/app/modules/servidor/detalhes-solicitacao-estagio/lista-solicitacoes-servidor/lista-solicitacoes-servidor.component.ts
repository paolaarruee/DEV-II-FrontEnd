import { Component, OnInit } from '@angular/core';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';
import { Solicitacoes } from 'src/app/shared/interfaces/solicitacoes';


@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss'],
})
export class ListaSolicitacoesServidorComponent implements OnInit {
  listaSolicitacoes: Solicitacoes[] = []; // Altere o tipo para Solicitacoes[]
  filtroNome: string = '';
  filtroDataInicial: Date = new Date(); 
  filtroDataFinal: Date = new Date();
  filtroStatus: string = 'todas';

  constructor(private service: SolicitacoesService) {}

  ngOnInit() {
    this.obterSolicitacoes();
  }

  obterSolicitacoes() {
    this.service.listarSolicitacoesPorEmailServidor().subscribe(
      (solicitacoes) => {
        this.listaSolicitacoes = solicitacoes;
        this.listaSolicitacoes.sort((a, b) => {
          const dataA = new Date(a.data).getTime(); // Altere para a propriedade correta no objeto Solicitacoes
          const dataB = new Date(b.data).getTime(); // Altere para a propriedade correta no objeto Solicitacoes
          return dataB - dataA;
        });
      },
      (error) => {
        console.error('Erro ao obter as solicitações:', error);
      }
    );
  }

  filtrarPorNome() {
    if (this.filtroNome.trim() === '') {
      // Se o filtro de nome estiver vazio, exibir todas as solicitações
      this.obterSolicitacoes();
    } else {
      // Filtrar as solicitações com base no nome
      this.listaSolicitacoes = this.listaSolicitacoes.filter((solicitacao) =>
        solicitacao.aluno.nomeCompleto.toLowerCase().includes(this.filtroNome.toLowerCase())
      );
    }
  }

  filtrarPorData() {
    // Filtrar as solicitações com base nas datas inicial e final
    this.listaSolicitacoes = this.listaSolicitacoes.filter((solicitacao) => {
      const dataSolicitacao = new Date(solicitacao.data);
      return (
        dataSolicitacao >= this.filtroDataInicial && dataSolicitacao <= this.filtroDataFinal
      );
    });
  }

  filtrarPorStatus() {
    if (this.filtroStatus === 'todas') {
      // Se o filtro de status for "todas", exibir todas as solicitações
      this.obterSolicitacoes();
    } else {
      // Filtrar as solicitações com base no status
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao) => solicitacao.status === this.filtroStatus
      );
    }
  }
}
