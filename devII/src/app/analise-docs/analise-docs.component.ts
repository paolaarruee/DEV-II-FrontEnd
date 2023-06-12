import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { saveAs } from 'file-saver';

import { DocsService } from '../core/services/docs/docs.service';
import { DocFile } from '../shared/interfaces/doc';
import { ToastService } from '../core/services/toast/toast.service';
import { Observable } from 'rxjs';
import { ServidorService } from '../core/services/servidor/servidor.service';
import { Servidor } from '../shared/interfaces/servidor';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public documentList$!: Observable<DocFile[]>;
  public servidore!: Servidor;

  public constructor(
    private docsService: DocsService,
    private toastService: ToastService,
    private servidorService: ServidorService
  ) {}

  public ngOnInit(): void {
    this.setDocumentList();
    this.setRecuperarServidor(1);
    console.log(this.setRecuperarServidor(1));
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

  private setRecuperarServidor(id: number): void {}
}
