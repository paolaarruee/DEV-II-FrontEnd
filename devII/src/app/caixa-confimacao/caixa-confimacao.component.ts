import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-caixa-confimacao',
  templateUrl: './caixa-confimacao.component.html',
  styleUrls: ['./caixa-confimacao.component.scss']
})
export class CaixaConfimacaoComponent {
  constructor(
  public dialogRef: MatDialogRef<CaixaConfimacaoComponent>,
    @Inject (MAT_DIALOG_DATA) public  data: { data: any, aviso: string }
    ) {}

    aviso: string = this.data.aviso;

    onNoClick(): void {
      this.dialogRef.close();
    }

    onYesClick(): void {
      this.dialogRef.close(true);
    }

}
