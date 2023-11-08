import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalhes-solicitacao',
  templateUrl: './detalhes-solicitacao.component.html',
  styleUrls: ['./detalhes-solicitacao.component.scss'],
})
export class DetalhesSolicitacaoServidorComponent {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<DetalhesSolicitacaoServidorComponent>,
    @Inject(MAT_DIALOG_DATA) public solicitacao: any  ) {}

    statusSolicitacao(): string{
      if(this.solicitacao.status.toLowerCase() == 'deferido' || this.solicitacao.status === 'Deferido' || this.solicitacao.status === 'aprovado'){
        return 'statusColor1'
      }

      if(this.solicitacao.status.toLowerCase()  == 'em andamento' || this.solicitacao.status.toLowerCase() === 'em_andamento'){
        return 'statusColor2'
      }

      if(this.solicitacao.status.toLowerCase() == 'nova') {
        return 'statusColor4'
      }

      if(this.solicitacao.status.toLowerCase() == 'indeferido'){
        return 'statusColor3'
      }
      return 'statusColor1'
    }

  progressoFluxo(etapa: number): string {
    if (this.solicitacao.etapa >= etapa) {
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

  formatarData(data: string): string {
    // Verifica se a data existe
    if (!data) {
      return '';
    }

    // Converte a string da data para um objeto Date
    const dataObj = new Date(data);

    // Formata a data no formato desejado (exemplo: DD/MM/YYYY)
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é o mês 0
    const ano = dataObj.getFullYear().toString();

    return `${dia}/${mes}/${ano}`;
  }


}
