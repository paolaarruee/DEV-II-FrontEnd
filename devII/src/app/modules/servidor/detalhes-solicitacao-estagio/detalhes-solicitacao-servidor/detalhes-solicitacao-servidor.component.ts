import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalhes-solicitacao-servidor',
  templateUrl: './detalhes-solicitacao-servidor.component.html',
  styleUrls: ['./detalhes-solicitacao-servidor.component.scss'],
})
export class DetalhesSolicitacaoServidorComponent {

  teste: string = "teste" + this.solicitacao.observacao;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<DetalhesSolicitacaoServidorComponent>,
    @Inject(MAT_DIALOG_DATA) public solicitacao: any  ) {}

  statusSolicitacao(): string{
    if(this.solicitacao.status == 'deferido' || this.solicitacao.status === 'Deferido'){
      return 'statusColor1'
    }

    if(this.solicitacao.status == 'em andamento' || this.solicitacao.status === 'Em Andamento'){
      return 'statusColor2'
    }

    if(this.solicitacao.status.toLowerCase === 'indeferido' || this.solicitacao.status === 'Indeferido'){
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
    this.router.navigate(['/analise-docs'], {
      state: { solicitacao: this.solicitacao },
    });
    this.closeDialog();
  }


}
