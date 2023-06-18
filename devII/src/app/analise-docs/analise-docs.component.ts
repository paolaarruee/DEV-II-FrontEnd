import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { saveAs } from 'file-saver';

import { DocsService } from '../core/services/docs/docs.service';
import { DocFile } from '../shared/interfaces/doc';
import { ToastService } from '../core/services/toast/toast.service';
import { Observable } from 'rxjs';
import { DadosBackendService } from '../lista-solicitacoes-aluno/dados-backend.service';
import { SolicitacaoService } from '../lista-solicitacoes-servidor/solicitacao/detalhes-solicitacao/solicitacao.service';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public documentList$!: Observable<DocFile[]>;
  public solicitacao: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private docsService: DocsService,
    private toastService: ToastService,
    private dadosSolicitacao: SolicitacaoService
  ) {}

  ngOnInit(): void {
    this.solicitacao = this.dadosSolicitacao.getSolicitacao(); // Recupera os dados da solicitação do serviço

    // Defina a lista de documentos
    this.setDocumentList();
  }

  download({ id, nome }: DocFile): void {
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

  upload(): void {
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
      error: () => {
        this.toastService.showMessage('Erro ao efetuar o upload.');
      },
    });
  }

  private setDocumentList(): void {
    this.documentList$ = this.docsService.getDocList();
  }
}
