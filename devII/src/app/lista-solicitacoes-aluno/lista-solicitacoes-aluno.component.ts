import { Component } from '@angular/core';
import { DadosBackendService } from './dados-backend.service';

@Component({
  selector: 'app-lista-solicitacoes-aluno',
  templateUrl: './lista-solicitacoes-aluno.component.html',
  styleUrls: ['./lista-solicitacoes-aluno.component.scss']
})
export class ListaSolicitacoesAlunoComponent {

  // constructor(private service: DadosBackendService){}

  // listaSolicitacoes = [
  //   {
  //     titulo: 'Solicitação xxxxx',
  //     conteudo:'teste conteudo 1 teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1teste conteudo 1',
  //     status:'em andamento',
  //     etapa:'4',
  //     observacao: 'aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao aqui esta uma observacao '
  //   },
  // ]

  listaSolicitacoes: any[] = [];

  constructor(private service: DadosBackendService) {}

  ngOnInit() {
    this.service.obterSolicitacoes().subscribe(
      solicitacoes => {
        console.log("Está chegando");
        console.log(solicitacoes);
        console.log(this.listaSolicitacoes);
        this.listaSolicitacoes = solicitacoes;
        console.log(this.listaSolicitacoes);
      },
      error => {
        console.error('Erro ao obter as solicitações:', error);
      }
    );
  }


}
