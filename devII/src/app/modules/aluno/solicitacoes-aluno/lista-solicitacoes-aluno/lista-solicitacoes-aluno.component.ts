import { Component } from '@angular/core';
import { DadosBackendService } from '../../../../core/services/solicitacoes-aluno/dados-backend.service';

@Component({
  selector: 'app-lista-solicitacoes-aluno',
  templateUrl: './lista-solicitacoes-aluno.component.html',
  styleUrls: ['./lista-solicitacoes-aluno.component.scss'],
})
export class ListaSolicitacoesAlunoComponent {
  listaSolicitacoes: any[] = [];

  constructor(private service: DadosBackendService) {}

  ngOnInit() {
    this.service.obterSolicitacoes().subscribe(
      (solicitacoes) => {
        this.listaSolicitacoes = solicitacoes;

        this.listaSolicitacoes.sort((a, b) => {
          const dataA = new Date(a.dataSolicitacao).getTime();
          const dataB = new Date(b.dataSolicitacao).getTime();
          return dataB - dataA;
        });
      },
      (error) => {
        console.error('Erro ao obter as solicitações:', error);
      }
    );
  }
}
