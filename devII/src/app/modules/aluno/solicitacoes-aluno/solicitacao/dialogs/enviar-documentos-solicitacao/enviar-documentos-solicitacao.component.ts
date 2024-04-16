import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';

@Component({
  selector: 'app-enviar-documentos-solicitacao',
  templateUrl: './enviar-documentos-solicitacao.component.html',
  styleUrls: ['./enviar-documentos-solicitacao.component.scss'],
  providers: [MatButtonModule, MatInputModule, MatFormFieldModule],
})
export class EnviarDocumentosSolicitacaoComponent {
  constructor(
    private solicitacoesService: SolicitacoesService,
    public dialogRef: MatDialogRef<EnviarDocumentosSolicitacaoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { solicitacao: any; tipo: string }
  ) {}

  file: File[] | any[] = [];
  msgErro = '';

  onFileChange(event: any) {
    this.file.pop();
    this.file.push(event.target.files[0]);
  }

  fecharDialog() {
    this.dialogRef.close();
  }

  enviarRelatorioFinal() {
    if (this.file) {
      if (this.data.tipo == 'cancelar') {
        alert('cancelar');
        this.solicitacoesService
          .enviarCancelamento(this.data.solicitacao.id, this.file)
          .subscribe(
            (res) => {
              this.msgErro = '';
              this.dialogRef.close();
            },
            (err) => {
              if (err.status === 400) {
                this.msgErro =
                  'Você já enviou um cancelamento para essa solicitação';
              }
            }
          );
      } else {
        this.solicitacoesService
          .enviarRelatorioFinal(this.data.solicitacao.id, this.file)
          .subscribe(
            (res) => {
              this.msgErro = '';
              this.dialogRef.close();
            },
            (err) => {
              if (err.status === 400) {
                this.msgErro =
                  'Você já enviou um relatório final para essa solicitação';
              }
            }
          );
      }
    }else{
      console.log('Nenhum arquivo selecionado');
    }
  }
}
