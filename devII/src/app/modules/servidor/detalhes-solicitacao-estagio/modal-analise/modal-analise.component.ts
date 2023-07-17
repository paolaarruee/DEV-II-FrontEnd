import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnaliseDocsComponent } from '../analise-docs/analise-docs.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-analise',
  templateUrl: './modal-analise.component.html',
  styleUrls: ['./modal-analise.component.scss'],
})
export class ModalAnaliseComponent {
  motivoIndeferimento = new FormControl('');
  @ViewChild('motivoInput') motivoInput!: ElementRef;
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ModalAnaliseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  public enviar(): void {
    this.data.enviarCallback(this.motivoIndeferimento.value);
    console.log(this.data.enviarCallback(this.motivoIndeferimento.value));
    this.dialogRef.close();
    this.router.navigateByUrl('/listaSolicitacoesServidor').then(() => {
      window.location.reload();
    });
  }
}
