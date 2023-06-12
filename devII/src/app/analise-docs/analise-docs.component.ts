
import { Aluno } from './aluno.model';
import { AlunoService } from './aluno.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { saveAs } from 'file-saver';

import { DocsService } from '../core/services/docs/docs.service';
import { DocFile } from '../shared/interfaces/doc';
import { ToastService } from '../core/services/toast/toast.service';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';


@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public documentList$!: Observable<DocFile[]>;
  public constructor(private router: Router, private alunoService: AlunoService, private docsService: DocsService, private toastService: ToastService) { }

  public solicitacao: any;
  public aluno: Aluno | undefined;

  

  public ngOnInit(): void {
    this.alunoService.getAlunoById(this.solicitacao.alunoId).subscribe((aluno: Aluno) => {
      this.aluno = aluno;

      this.solicitacao = {
        tipo: 'estagio',
        alunoId: aluno.id,
        servidorId: '1',
      };

      this.setDocumentList();
    });
  }

  public download({ id, nome }: DocFile): void {
    this.docsService.downloadDoc(id).subscribe({
      next: (blob: Blob) => {
        saveAs(new Blob([blob]), nome);
        this.toastService.showMessage('Arquivo salvo com sucesso!');
        this.AnaliseDoc(); // Redirecionamento para a página de solicitação
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
      formData.append("documentos", fileList[i]);
    }
  
    this.docsService.uploadDocs(formData).subscribe({
      next: () => {
        this.toastService.showMessage('Upload efetuado com sucesso!');
        this.setDocumentList();
        this.AnaliseDoc(); // Redirecionamento para a página de solicitação
      },
      error: () => this.toastService.showMessage('Erro ao efetuar o upload.'),
    });
  }
  
  AnaliseDoc() {
    this.router.navigate(['/lista-solicitacoes-servidor/solicitacao/detalhes-solicitacao/detalhes-solicitacao.component'], { queryParams: { solicitacao: JSON.stringify(this.solicitacao) } });
  }

  private setDocumentList(): void {
    this.documentList$ = this.docsService.getDocList();
  }
}
