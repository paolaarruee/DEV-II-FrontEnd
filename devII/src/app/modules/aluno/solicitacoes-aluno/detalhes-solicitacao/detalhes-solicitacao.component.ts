import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-solicitacao',
  templateUrl: './detalhes-solicitacao.component.html',
  styleUrls: ['./detalhes-solicitacao.component.scss'],
})
export class DetalhesSolicitacaoComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalhesSolicitacaoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { solicitacao: any; observacaoOn: boolean }
  ) {}
  observacao: string = this.data.solicitacao.observacao;

  statusSolicitacao(): string {
    if (
      this.data.solicitacao.status.toLowerCase() == 'deferido' ||
      this.data.solicitacao.status === 'Deferido'
    ) {
      return 'statusColor1';
    }

    if (
      this.data.solicitacao.status.toLowerCase() == 'em andamento' ||
      this.data.solicitacao.status === 'Em Andamento'
    ) {
      return 'statusColor2';
    }
    if (
      this.data.solicitacao.status.toLowerCase() == 'indeferido' ||
      this.data.solicitacao.status === 'Indeferido'
    ) {
      return 'statusColor3';
    }
    return 'statusColor1';
  }

  progressoFluxo(etapa: number): string {
    if (this.data.solicitacao.etapa >= etapa) {
      if (this.data.solicitacao.status.toLowerCase() == 'indeferido') {
        return 'progressoEtapa';
      } else {
        return 'progressoEtapa';
      }
    }
    return '';
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
