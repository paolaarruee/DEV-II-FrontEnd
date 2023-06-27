import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalAnaliseComponent } from '../modal-analise/modal-analise.component';
import { FormControl } from '@angular/forms';
import { DocsService } from 'src/app/core/services/docs/docs.service';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { DocFile } from 'src/app/shared/interfaces/doc';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { Status } from 'src/app/shared/interfaces/solicitacoes';
import { Role } from 'src/app/shared/interfaces/usuario';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public documentList$!: Observable<DocFile[]>;
  public studentData$!: Observable<any>;
  public readonly Roles: typeof Role = Role;

  public servidore!: Servidor;
  motivoIndeferimento = new FormControl('');
  public solicitacao: any;
  public constructor(
    private activatedRoute: ActivatedRoute,
    private docsService: DocsService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private solicitacoes: SolicitacoesService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.setStudentData();
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

  private setDocumentListId(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.documentList$ = this.solicitacoes.getlistDocsPorEstagioId(id);
  }

  private setStudentData() {
    const { id } = this.activatedRoute.snapshot.params;
    this.studentData$ = this.solicitacoes.getStudentData(id);
  }

  public abrirDialogDeferir() {
    const servidor = this.authenticationService.role === Role.ROLE_SERVIDOR;
    if (!this.fileInputRef.nativeElement.files?.length && servidor) {
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
          this.authenticationService.role === Role.ROLE_SESTAGIO
            ? this.enviarDeferimento()
            : this.enviarDeferimentoSetorEstagio();
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
    const data = { status: Status.DEFERIDO };
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

  public enviarDeferimentoSetorEstagio(): void {
    const { id } = this.activatedRoute.snapshot.params;
    const data = { status: Status.DEFERIDO };
    const formData: FormData = new FormData();

    formData.append(
      'dados',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    this.solicitacoes.deferirSolicitacaoSetorEstagio(id, formData).subscribe({
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
    const data = { status: Status.INDEFERIDO, observacao: motivo };
    const formData: FormData = new FormData();
    console.log(data);
    formData.append(
      'dados',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    this.solicitacoes.indeferirSolicitacao(id, formData).subscribe({
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
