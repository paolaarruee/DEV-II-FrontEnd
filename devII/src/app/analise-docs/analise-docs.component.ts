import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

import { DadosBackendService } from '../lista-solicitacoes-aluno/dados-backend.service';
import { SolicitacaoService } from '../lista-solicitacoes-servidor/solicitacao/detalhes-solicitacao/solicitacao.service';
import { SolicitacoesService } from '../core/services/solicitacoesEstagio/solicitacoes.service';
import { Status } from '../shared/interfaces/solicitacoes';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public documentList$!: Observable<DocFile[]>;
  public alumniData$!: Observable<any>;

  public servidore!: Servidor;
  motivoIndeferimento = new FormControl('');
  public solicitacao: any;
  public constructor(
    private activatedRoute: ActivatedRoute,
    private docsService: DocsService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private analiseDocsService: AnaliseDocumentosService,
    private dadosSolicitacao: SolicitacaoService,
    private solicitacoes: SolicitacoesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.solicitacao = this.dadosSolicitacao.getSolicitacao(); // Recupera os dados da solicitação do serviço
    // this.setDocumentList();
    this.setAlumniData();
    this.setDocumentListId();
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

  // private setDocumentList(): void {
  //   this.documentList$ = this.docsService.getDocList();
  // }

  private setDocumentListId(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.documentList$ = this.solicitacoes.getlistDocsPorEstagioId(id);
  }

  private setAlumniData() {
    const { id } = this.activatedRoute.snapshot.params;
    this.alumniData$ = this.solicitacoes.getAlumniData(id);
  }

  public abrirDialogDeferir() {
    if (!this.fileInputRef.nativeElement.files?.length) {
      this.toastService.showMessage(
        'Você precisa anexar pelo menos um documento'
      );
      return;
    }
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
        enviarCallback: (motivoIndeferimento: string) =>
          this.enviarIndeferimento(motivoIndeferimento),
      },
    });
  }

  public enviarDeferimento(): void {
    const { id } = this.activatedRoute.snapshot.params;
    const data = { status: Status.DEFERIDO, etapa: 2 };
    const fileList: FileList = this.fileInputRef.nativeElement?.files!;
    const formData: FormData = new FormData();

    formData.append(
      'dados',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    for (let i = 0; i < fileList.length; i++) {
      formData.append('file', fileList[i]);
    }

    this.solicitacoes.deferirSolicitacao(id, formData).subscribe({
      next: () => {
        this.toastService.showMessage('Deferimento enviado com sucesso!');
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar o deferimento.');
      },
    });
  }

  public enviarIndeferimento(motivo: string): void {
    const { id } = this.activatedRoute.snapshot.params;
    const data = { status: Status.INDEFERIDO, etapa: 5, resposta: motivo };

    this.solicitacoes.indeferirSolicitacao(id, data).subscribe({
      next: () => {
        this.toastService.showMessage('Indeferimento enviado com sucesso!');
      },
      error: () => {
        console.log(this.solicitacoes);
        this.toastService.showMessage('Erro ao enviar o indeferimento.');
      },
    });
  }
}
