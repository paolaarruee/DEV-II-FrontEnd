import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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

@Component({
  selector: 'app-atualizar-docs',
  templateUrl: './atualizar-docs.component.html',
  styleUrls: ['./atualizar-docs.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
    public data: { docs: DocFile[]; solicitacaoId: number; isAssinado: boolean }
  ) {}

  ngAfterViewInit() {

    this.dialogRef.afterClosed().subscribe((result) => {
      window.location.reload();
    });
    
    this.data.docs.forEach((doc) => {
      const meuElemento = document.getElementById('caixa');
      const span = document.createElement('span');
      span.textContent = doc.nome;
      span.className = 'documento';

      const img = document.createElement('img');
      if (!this.data.isAssinado) {
        img.src = '/assets/img/apagarBotao.png';
      } else {
        img.src = '/assets/img/downloadBotao.png';
      }
      img.className = 'botaoApagar';
      img.onclick = () => {
        if (this.data.isAssinado) {
          this.docslist.downloadDoc(doc.id).subscribe(
            (response) => {
              console.log('Resposta bem-sucedida:', response);
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            },
            (err) => {
              // Manipule erros aqui
              console.error('Erro:', err);
            }
          );
        } else {
          if (this.data.docs.length == 1) {
            alert('Você não pode apagar o último documento');
          } else {
            const dialogRef = this.dialog.open(CaixaConfimacaoComponent, {
              data: { data: null, aviso: 'documento' },
            });
            
          }
        }
      };
      meuElemento?.appendChild(span);
      span.appendChild(img);
    });
    
  }
  apagarDoc(doc: number) {
    this.docslist.deleteDoc(doc).subscribe(
      (response) => {
        console.log('Resposta bem-sucedida:', response);
        window.location.reload();
      },
      (err) => {
        // Manipule erros aqui
        console.error('Erro:', err);
      }
    );
    window.location.reload();
  }

  arquivosSelecionados: File[] = [];
  onFileSelected($event: any) {
    const file = ($event.target as HTMLInputElement).files![0];

    const listaUI = document.getElementById('listaDocAnexo');
    const docItem = document.createElement('li');
    docItem.textContent = file.name;
    listaUI?.appendChild(docItem);

    if (file.size > 1048576) {
      this.toastService.showMessage('arquivo muito grande!');
      return;
    } else if (this.arquivosSelecionados.length > 8) {
      this.toastService.showMessage('Limite de arquivos anexados atingido!!');
    } else {
      this.arquivosSelecionados.push(file);
    }
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
