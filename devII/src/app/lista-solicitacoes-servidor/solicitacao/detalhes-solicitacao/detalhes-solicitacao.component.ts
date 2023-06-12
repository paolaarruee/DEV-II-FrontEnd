import { Component,  Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalhes-solicitacao',
  templateUrl: './detalhes-solicitacao.component.html',
  styleUrls: ['./detalhes-solicitacao.component.scss']
})
export class DetalhesSolicitacaoServidorComponent {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<DetalhesSolicitacaoServidorComponent>,
    @Inject (MAT_DIALOG_DATA) public solicitacao: any
  ) {}

  statusSolicitacao(): string{
    if(this.solicitacao.status == 'aprovado'){
      return 'statusColor1'
    }

    if(this.solicitacao.status == 'em andamento'){
      return 'statusColor2'
    }

    if(this.solicitacao.status == 'negado'){
      return 'statusColor3'
    }
    return 'statusColor1'
  }

  progressoFluxo(etapa: number): string {
    if (this.solicitacao.etapa >= etapa) {
      return 'progressoEtapa';
    } else if (this.solicitacao.etapa >= etapa) {
      return 'progressoEtapa';
    } else if (this.solicitacao.etapa >= etapa) {
      return 'progressoEtapa';
    } else if (this.solicitacao.etapa >= etapa) {
      return 'progressoEtapa';
    } else if (this.solicitacao.etapa >= etapa) {
      return 'progressoEtapa';
    }
    return '';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  AnaliseDoc() {
    this.router.navigate(['./analise-docs/analise-docs.component'], { state: { solicitacao: this.solicitacao } });
    this.closeDialog();
  }

}
