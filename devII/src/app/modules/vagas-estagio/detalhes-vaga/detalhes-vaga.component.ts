import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-vaga',
  templateUrl: './detalhes-vaga.component.html',
  styleUrls: ['./detalhes-vaga.component.scss']
})
export class DetalhesVagaComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalhesVagaComponent>,
    @Inject (MAT_DIALOG_DATA) public vaga: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

}
