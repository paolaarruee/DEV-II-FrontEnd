import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { Observable, map, take, tap } from 'rxjs';
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
import { SolicitacaoIndeferir } from 'src/app/shared/interfaces/solicitacao-indeferir';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public documentList$!: Observable<DocFile[]>;
  public studentData$!: Observable<any>;
  public solicitacaoData$!: Observable<any>;
  public readonly Roles: typeof Role = Role;

  public dialogAberto: boolean = false;
  public servidore!: Servidor;
  public disableButton?: boolean;
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
    this.setSolicitacaoData();
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

  private setSolicitacaoData() {
    const { id } = this.activatedRoute.snapshot.params;
    this.solicitacaoData$ = this.solicitacoes.getSolicitacoesData(id).pipe(
      tap((solicitacoes: any) => {
        this.disableButton =
          (this.authenticationService.role === Role.ROLE_SESTAGIO &&
            solicitacoes.statusEtapaSetorEstagio === Status.DEFERIDO) ||

          (this.authenticationService.role === Role.ROLE_SERVIDOR &&
            solicitacoes.statusEtapaCoordenador === Status.DEFERIDO ||
            solicitacoes.statusEtapaSetorEstagio === Status.EM_ANDAMENTO) ||

          (this.authenticationService.role === Role.ROLE_DIRETOR &&
            solicitacoes.statusEtapaDiretor === Status.DEFERIDO ||
            solicitacoes.statusEtapaCoordenador === Status.EM_ANDAMENTO) ||

          solicitacoes.status === Status.INDEFERIDO;
          solicitacoes.status === Status.DEFERIDO;
      })
    );
    console.log(this.disableButton);
  }

  public abrirDialogDeferir(): void {
    if (this.dialogAberto) {
      return;
    }

    this.dialogAberto = true;
    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo: 'Você tem certeza que deseja deferir o estágio do aluno',
        enviarCallback: () => {
          if (this.authenticationService.role === Role.ROLE_SESTAGIO) {
            return this.enviarDeferimentoSetorEstagio();
          }
          if (this.authenticationService.role === Role.ROLE_DIRETOR) {
            return this.enviarDeferimentoDiretor();
          }
          if (this.authenticationService.role === Role.ROLE_SERVIDOR) {
            return this.enviarDeferimento();
          }
        },
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dialogAberto = false;
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

  public enviarDeferimentoDiretor(): void {
    const { id } = this.activatedRoute.snapshot.params;
    const data = {
      status: Status.DEFERIDO,
      statusEtapaDiretor: Status.DEFERIDO,
    };
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
    const data = { statusEtapaSetorEstagio: Status.DEFERIDO };
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

  public enviarDeferimento(): void {
    const { id } = this.activatedRoute.snapshot.params;
    const data = { statusEtapaCoordenador: Status.DEFERIDO };
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

  dados: SolicitacaoIndeferir = {
    observacao: '',
  };
  public enviarIndeferimento(motivo: string): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.dados.observacao = motivo;

    this.solicitacoes.indeferirSolicitacao(id, this.dados).subscribe(
      (response) => {
        this.toastService.showMessage('Solicitação Indeferida!');
      },
      (error) => {
        this.toastService.showMessage(
          'Erro ao enviar o indeferimento!',
          'ERRO'
        );
      }
    );
  }
}
