import { Component } from '@angular/core';

@Component({
  selector: 'app-lista-solicitacoes-aluno',
  templateUrl: './lista-solicitacoes-aluno.component.html',
  styleUrls: ['./lista-solicitacoes-aluno.component.scss']
})
export class ListaSolicitacoesAlunoComponent {

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
