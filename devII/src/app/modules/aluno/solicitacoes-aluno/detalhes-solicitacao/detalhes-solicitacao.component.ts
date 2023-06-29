import { Component,  Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-solicitacao',
  templateUrl: './detalhes-solicitacao.component.html',
  styleUrls: ['./detalhes-solicitacao.component.scss']
})
export class DetalhesSolicitacaoComponent {

  constructor(
    public dialogRef: MatDialogRef<DetalhesSolicitacaoComponent>,
    @Inject (MAT_DIALOG_DATA) public solicitacao: any
  ) {}

  statusSolicitacao(): string{
    if(this.solicitacao.status == 'deferido' || this.solicitacao.status === 'Deferido'){
      return 'statusColor1'
    }

    if(this.solicitacao.status == 'em andamento' || this.solicitacao.status === 'Em Andamento'){
      return 'statusColor2'
    }

    if(this.solicitacao.status == 'indeferido' || this.solicitacao.status === 'Indeferido'){
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

}
