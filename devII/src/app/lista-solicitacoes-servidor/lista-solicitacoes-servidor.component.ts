import { Component } from '@angular/core';
import { DadosBackendService } from './dados-backend.service';


@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss']
})
export class ListaSolicitacoesServidorComponent {

  /* //solicitações para receber do backend 
   
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
  
          // Ordena a lista de solicitações com base na data de criação em ordem decrescente
          this.listaSolicitacoes.sort((a, b) => {
            const dataA = new Date(a.dataSolicitacao).getTime();
            const dataB = new Date(b.dataSolicitacao).getTime();
            return dataB - dataA;
          });
  
        },
        error => {
          console.error('Erro ao obter as solicitações:', error);
        }
      );
    }
  */

    //lista de Solicitações para teste
    listaSolicitacoes: any[] = [];

    constructor() {}
  
    ngOnInit() {
      // Simulação de dados de solicitações
      const solicitacao1 = {
        alunoId: 1,
        servidorId: 1,
        tipo: 'estagio',
        status: 'aprovado',
        titulo: 'Solicitação 1',
        conteudo: 'Conteúdo da solicitação 1',
        observacao: 'Observação da solicitação 1',
        etapa: 1
      };
      const solicitacao2 = {
        alunoId: 2,
        servidorId: 1,
        tipo: 'estagio',
        status: 'em andamento',
        titulo: 'Solicitação 2',
        conteudo: 'Conteúdo da solicitação 2',
        observacao: 'Observação da solicitação 2',
        etapa: 2
      };
      const solicitacao3 = {
        alunoId: 3,
        servidorId: 2,
        tipo: 'estagio',
        status: 'negado',
        titulo: 'Solicitação 3',
        conteudo: 'Conteúdo da solicitação 3',
        observacao: 'Observação da solicitação 3',
        etapa: 3
      };
    
      // Adiciona as solicitações ao array
      this.listaSolicitacoes.push(solicitacao1);
      this.listaSolicitacoes.push(solicitacao2);
      this.listaSolicitacoes.push(solicitacao3);
    }

}