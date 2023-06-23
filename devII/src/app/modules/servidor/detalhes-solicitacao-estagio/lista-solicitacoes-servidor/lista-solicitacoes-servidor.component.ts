import { Component, OnInit } from '@angular/core';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';

@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss'],
})
export class ListaSolicitacoesServidorComponent implements OnInit {
  listaSolicitacoes: any[] = [];

  constructor(private service: SolicitacoesService) {}

  ngOnInit() {
    this.service.listarSolicitacoesPorEmailServidor().subscribe(
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
