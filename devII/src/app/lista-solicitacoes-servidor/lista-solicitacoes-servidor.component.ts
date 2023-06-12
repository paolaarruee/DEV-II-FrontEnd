import { Component } from '@angular/core';
import { DadosBackendService } from './dados-backend.service';


@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss']
})
export class ListaSolicitacoesServidorComponent {

   
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
  
  

}
