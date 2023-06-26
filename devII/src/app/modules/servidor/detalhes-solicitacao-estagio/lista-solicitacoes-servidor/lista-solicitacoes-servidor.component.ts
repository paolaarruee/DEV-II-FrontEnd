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
  filtroStatus: string = 'todas';
  data_solicitacao: Date = new Date();

  constructor(private service: SolicitacoesService) {}

  ngOnInit() {
    this.obterSolicitacoes();
  }

  async obterSolicitacoes() {
    try {
      this.listaSolicitacoes = await this.service.listarSolicitacoesPorEmailServidor().toPromise();
      this.ordenarSolicitacoes();
    } catch (error) {
      console.error('Erro ao obter as solicitações:', error);
    }
  }

  filtrarPorNome() {
    if (this.filtroNome.trim() === '') {
      this.obterSolicitacoes();
    } else {
      this.service.listarSolicitacoesPorEmailServidor().toPromise().then((solicitacoes) => {
        this.listaSolicitacoes = solicitacoes.filter((solicitacao: Solicitacoes) =>
          solicitacao.aluno.nomeCompleto.toLowerCase().includes(this.filtroNome.toLowerCase())
        );
        this.ordenarSolicitacoes();
      });
    }
  }

  filtrarPorData() {
    this.service.listarSolicitacoesPorEmailServidor().toPromise().then((solicitacoes) => {
      this.listaSolicitacoes = solicitacoes.filter((solicitacao: Solicitacoes) => {
        const dataSolicitacao = new Date(solicitacao.data_solicitacao);
        return (
          dataSolicitacao >= this.filtroDataInicial && dataSolicitacao <= this.filtroDataFinal
        );
      });
      this.ordenarSolicitacoes();
    });
  }

  

  filtrarPorStatus() {
    if (this.filtroStatus === 'todas') {
      this.obterSolicitacoes();
    } else {
      this.service.listarSolicitacoesPorEmailServidor().toPromise().then((solicitacoes) => {
        const listaOriginal = [...solicitacoes];
        
        this.listaSolicitacoes = listaOriginal.filter((solicitacao: Solicitacoes) => {
          if (this.filtroStatus === 'setor_estagios') {
            return solicitacao.servidor.cargo === 'setor';
          } else if (this.filtroStatus === 'coordenador') {
            return solicitacao.servidor.cargo === 'coordenador';
          } else if (this.filtroStatus === 'diretoria') {
            return solicitacao.servidor.cargo === 'diretoria';
          } else {
            return solicitacao.status === this.filtroStatus;
          }
        });
  
        this.ordenarSolicitacoes();
      });
    }
  }
  
  ordenarSolicitacoes() {
    this.listaSolicitacoes.sort((a, b) => {
      const dataA = new Date(a.data_solicitacao).getTime();
      const dataB = new Date(b.data_solicitacao).getTime();
      return dataB - dataA;
    });
  }

  atualizarPagina() {
    // Recarrega a página para exibir os resultados filtrados
    location.reload();
  }

  
  



}
