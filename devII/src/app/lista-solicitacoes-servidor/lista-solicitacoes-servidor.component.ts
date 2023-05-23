import { Component } from '@angular/core';

@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss']
})
export class ListaSolicitacoesServidorComponent {

  listaSolicitacoes = [
    {
      titulo: 'Solicitação xxxxx',
      conteudo:'teste conteudo 1',
      status:'em andamento'
    },

    {
      titulo: 'teste2',
      conteudo:'teste conteudo 2',
      status:'aprovado'
    },
    {
      titulo: 'teste 3',
      conteudo:'testando conteudo',
      status:'negado'
    },

  ]

}
