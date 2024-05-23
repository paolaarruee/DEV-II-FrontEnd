import { Component, Input, OnInit } from '@angular/core';
import { Solicitacoes } from 'src/app/shared/interfaces/solicitacoes';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';
@Component({
  selector: 'app-solicitacao-estagios-lista',
  templateUrl: './solicitacao-estagios-lista.component.html',
  styleUrls: ['./solicitacao-estagios-lista.component.scss']
})
export class SolicitacaoEstagiosListaComponent {

  constructor(
    private solicitacoesService: SolicitacoesService    
  ) { }

  @Input() listaAtual = '';

  solicitacoes: Solicitacoes[] = [];

  ngOnInit(): void {
    this.solicitacoesService.listarSolicitacoes().subscribe(solicitacoes => {
      this.solicitacoes = solicitacoes;
    });
  }

  setTemplate(event: string) {
    this.listaAtual = event;
    }

  
    cliqueCards(card: number) {
      switch (card) {
        case 1:
          this.listaAtual = '1';
          break;
        case 2:
          this.listaAtual = '2';
          break;
        case 3:
          this.listaAtual = '3';
          break;
        case 4:
          this.listaAtual = '4';
          break;
        default:
          this.listaAtual = '1';
          break;
      }
    }
  
}
