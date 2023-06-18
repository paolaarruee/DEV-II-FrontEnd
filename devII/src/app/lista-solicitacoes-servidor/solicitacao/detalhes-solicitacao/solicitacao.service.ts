import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private solicitacao: any;

  constructor() { }

  getSolicitacao(): any {
    return this.solicitacao;
  }

  setSolicitacao(solicitacao: any): void {
    this.solicitacao = solicitacao;
  }
}
