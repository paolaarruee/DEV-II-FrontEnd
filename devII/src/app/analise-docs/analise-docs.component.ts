import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { saveAs } from 'file-saver';

import { DocsService } from '../core/services/docs/docs.service';
import { DocFile } from '../shared/interfaces/doc';
import { ToastService } from '../core/services/toast/toast.service';
import { Observable } from 'rxjs';
import { ServidorService } from '../core/services/servidor/servidor.service';
import { Servidor } from '../shared/interfaces/servidor';
import { MatDialog } from '@angular/material/dialog';
import { ModalAnaliseComponent } from '../modal-analise/modal-analise.component';
import { FormControl } from '@angular/forms';
import { AnaliseDocumentosService } from '../core/analiseDocs/analise-documentos.service';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public documentList$!: Observable<DocFile[]>;
  public servidore!: Servidor;
  motivoIndeferimento = new FormControl('');

  public constructor(
    private docsService: DocsService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private analiseDocsService: AnaliseDocumentosService
  ) {}

  public ngOnInit(): void {
    this.setDocumentList();
  }

  public download({ id, nome }: DocFile): void {
    this.docsService.downloadDoc(id).subscribe({
      next: (blob: Blob) => {
        saveAs(new Blob([blob]), nome);
        this.toastService.showMessage('Arquivo salvo com sucesso!');
      },
      error: () => {
        this.toastService.showMessage('Erro ao salvar o arquivo.');
      },
    });
  }
  public abrirDialogDeferir() {
    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo: 'Você tem certeza que deseja deferir o estágio do aluno',
        enviarCallback: () => {
          this.enviarDeferimento();
        },
      },
    });
  }

  abrirDialogIndeferir() {
    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo: 'Você tem certeza que deseja indeferir o estágio do aluno',
        mostrarCampoMotivo: true,
        enviarCallback: () => {
          const motivoIndeferimento = this.motivoIndeferimento.value ?? '';
          this.enviarIndeferimento(motivoIndeferimento);
          console.log(motivoIndeferimento);
        },
      },
    });
  }

  public upload(): void {
    const fileList: FileList | null = this.fileInputRef.nativeElement?.files;

    if (!(fileList && fileList.length)) {
      return;
    }

    const formData: FormData = new FormData();

    for (let i = 0; i < fileList.length; i++) {
      formData.append('documentos', fileList[i]);
    }

    this.docsService.uploadDocs(formData).subscribe({
      next: () => {
        this.toastService.showMessage('Upload efetuado com sucesso!');
        this.setDocumentList();
      },
      error: () => this.toastService.showMessage('Erro ao efetuar o upload.'),
    });
  }

  private setDocumentList(): void {
    this.documentList$ = this.docsService.getDocList();
  }

  public enviarDeferimento(): void {
    const flagDeferida: FormData = new FormData();
    flagDeferida.append('flag', 'deferida');

    this.analiseDocsService.enviarDeferimento(flagDeferida).subscribe({
      next: () => {
        this.toastService.showMessage('Deferimento enviado com sucesso!');
        // Realize qualquer outra ação necessária após o deferimento
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar o deferimento.');
      },
    });
  }

  public enviarIndeferimento(motivo: string): void {
    const flagIndeferida: FormData = new FormData();
    flagIndeferida.append('flag', 'indeferida');
    flagIndeferida.append('texto', motivo);

    this.analiseDocsService.enviarIndeferimento(flagIndeferida).subscribe({
      next: () => {
        this.toastService.showMessage('Indeferimento enviado com sucesso!');
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar o indeferimento.');
      },
    });
  }
}
