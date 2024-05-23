import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CaixaConfimacaoComponent } from 'src/app/caixa-confimacao/caixa-confimacao.component';
import { DocsService } from 'src/app/core/services/docs/docs.service';
import { DocFile } from 'src/app/shared/interfaces/doc';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-atualizar-docs',
  templateUrl: './atualizar-docs.component.html',
  styleUrls: ['./atualizar-docs.component.scss'],
})
export class AtualizarDocsComponent {
  delete: boolean = false;
  confimardoDelete: boolean = false;
  constructor(
    private docslist: DocsService,
    private dialog: MatDialog,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<AtualizarDocsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { docs: DocFile[]; solicitacaoId: number; isAssinado: boolean; urlDrive: any}
  ) {}

  ngOnInit(){
    
  }

  apagarDocumento(doc: number){
    if(this.data.docs.length == 1){
      this.toastService.showMessage('Não é possível excluir o único documento da solicitação!');
      return;
    }
    const dialogRef = this.dialog.open(CaixaConfimacaoComponent, {
      data: {
        aviso: 'documento selecionado',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDoc(doc);
      }
    }
    );
  }

  deleteDoc(doc: number) {
    this.docslist.deleteDoc(doc).subscribe(
      (response) => {
        this.toastService.showMessage('Documento excluído com sucesso!');
        location.reload();
      },
      (err) => {
        console.error('Erro:', err);
      }
    );
  }

  abrirDocumento(doc: number, nome: string) {
    this.docslist.downloadDoc(doc).subscribe(
      (response) => {
        console.log('Resposta bem-sucedida:', response);
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        saveAs(new Blob([blob]), nome);
        window.open(url);
      },
      (err) => {
        console.error('Erro:', err);
      }
    );
  }

  arquivosSelecionados: File[] = [];
  onFileSelected($event: any) {
    const file = ($event.target as HTMLInputElement).files![0];

    if (file.size > 1048576) {
      this.toastService.showMessage('arquivo muito grande!');
      return;
    } else if (this.arquivosSelecionados.length > 8) {
      this.toastService.showMessage('Limite de arquivos anexados atingido!!');
    } else {
      this.arquivosSelecionados.push(file);
    }
  }

  fechar(){
    this.dialogRef.close();
  }

  onUpload() {
    const arquivosEnvio: FormData = new FormData();
    this.arquivosSelecionados.forEach((file) => {
      arquivosEnvio.append('file', file);
    });
    arquivosEnvio.append(
      'solicitacaoId',
      new Blob([JSON.stringify(this.data.solicitacaoId)], {
        type: 'application/json',
      })
    );

    if (this.arquivosSelecionados.length == 0) {
      this.toastService.showMessage('Sem arquivos anexados para enviar...');
    } else {
      this.docslist.uploadDocs(arquivosEnvio).subscribe(
        (response) => {
          this.arquivosSelecionados = [];
          console.log('Resposta bem-sucedida:', response);
          this.toastService.showMessage('Arquivos enviados!!!');
          location.reload();
        },
        (err) => {
          console.error('Erro:', err);
          if (err.status == '509') {
            this.toastService.showMessage(
              'Limite de arquivos enviados atingido, antes de enviar exclua um arquivo!'
            );
          } else {
            this.toastService.showMessage(
              'Ocorreu algum erro. Tente novamente'
            );
          }
        }
      );
    }
  }
}
