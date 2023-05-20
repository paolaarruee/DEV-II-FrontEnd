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

}
