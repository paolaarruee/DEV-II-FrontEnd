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
    public data: { docs: DocFile[]; solicitacaoId: number; isAssinado: boolean }
  ) {}

  ngAfterViewInit() {

    this.dialogRef.afterClosed().subscribe((result) => {
      
    });
    
    this.data.docs.forEach((doc) => {
      const meuElemento = document.getElementById('caixa');
      const span = document.createElement('span');
      span.textContent = "▸" + doc.nome;
      span.id = doc.id.toString();
      span.className = 'documento';
      span.style.margin = '0.7em';
      span.style.fontSize= 'large';
      span.style.cursor = 'pointer';

      const img = document.createElement('img');
      if (!this.data.isAssinado) {
        img.src = '/assets/img/apagarBotao.png';
      } else {
        img.src = '/assets/img/downloadBotao.png';
      }
      img.height = 24;
      img.width = 24;
      img.style.cursor = 'pointer';
      //hover
      img.onmouseover = () => {
        img.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        img.style.borderRadius = '5px';
      };
      img.onmouseleave = () => {
        img.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        img.style.borderRadius = '0px';
      }
      

      span.onclick = () => {
        if (this.data.isAssinado) {
          this.docslist.downloadDoc(doc.id).subscribe(
            (response) => {
              console.log('Resposta bem-sucedida:', response);
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              saveAs(new Blob([blob]), doc.nome);
              window.open(url);
            },
            (err) => {
              // Manipule erros aqui
              console.error('Erro:', err);
            }
          );
        } else {
          if (this.data.docs.length == 1) {
            this.toastService.showMessage('Não é possível excluir o ultimo documento');
          }
           else {
            const dialogRef = this.dialog.open(CaixaConfimacaoComponent, {
              data: { data: null, aviso: 'documento' },
            });
            dialogRef.afterClosed().subscribe((resultado) => {
              if (resultado === true) {
                this.data.docs = this.data.docs.filter((item) => item.id !== doc.id);
                this.apagarDoc(doc.id, img, img.parentElement);

              } else {
                console.log('Cancelado');
              }
            });
            
          }
        }
      };
      meuElemento?.appendChild(span);
      span.appendChild(img);
    });
    
  }
  apagarDoc(doc: number, element1: HTMLElement, element2?: any) {
    this.docslist.deleteDoc(doc).subscribe(
      (response) => {
        console.log('Resposta bem-sucedida:', response);
        element1.remove();
        element2?.remove();
        // Perform any additional logic with the elements here
      },
      (err) => {
        // Handle errors here
        console.error('Erro:', err);
      }
    );

  }

  arquivosSelecionados: File[] = [];
  onFileSelected($event: any) {
    const file = ($event.target as HTMLInputElement).files![0];

    const listaUI = document.getElementById('listaDocAnexo');
    const docItem = document.createElement('li');
    docItem.textContent = file.name;
    

    if (file.size > 1048576) {
      this.toastService.showMessage('arquivo muito grande!');
      return;
    } else if (this.arquivosSelecionados.length > 8) {
      this.toastService.showMessage('Limite de arquivos anexados atingido!!');
    } else {
      listaUI?.appendChild(docItem);
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
