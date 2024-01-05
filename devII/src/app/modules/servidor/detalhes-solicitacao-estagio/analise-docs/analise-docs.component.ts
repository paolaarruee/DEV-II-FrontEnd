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
import { DatePipe } from '@angular/common';
import { PermissionDirective } from 'src/app/shared/directives/permission/permission.directive';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  public readonly Roles: typeof Role = Role;
  public documentList$!: Observable<DocFile[]>;
  public studentData$!: Observable<any>;
  public solicitacaoData$!: Observable<any>;
  item = ['Deferido', 'Indeferido', 'Em andamento'];
  status = '';
  statusAtual = '';
  etapaAtual: String = '';
  dataFinalEstagio = '';
  dataInicioEstagio = '';
  dataSolicitacao = '';
  dataSistema = '';

  listaEtapas = {
    'Setor estágio': 2,
    Coordenador: 3,
    Diretor: 4,
    Deferido: 5,
  };

  public dialogAberto: boolean = false;
  public servidore!: Servidor;
  public disableButton?: boolean;
  motivoIndeferimento = new FormControl('');
  public isRequestSent: boolean = false;
  public solicitacao: any;
  public observacao: String = '';
  public observacaoAtual: String = '';

  public constructor(
    private activatedRoute: ActivatedRoute,
    private docsService: DocsService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private solicitacoes: SolicitacoesService,
    public authenticationService: AuthenticationService,
    public datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.setStudentData();
    this.setSolicitacaoData();
    this.setDocumentListId();
    alert(this.authenticationService.role);
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

  atualizarEtapa() {
    const { id } = this.activatedRoute.snapshot.params;
    this.solicitacoes
      .setEtapaSolicitacao(id, this.etapaAtual.toString())
      .subscribe({
        next: () => {
          this.toastService.showMessage(
            'Etapa da solicitação foi alterada com sucesso.'
          );
        },
        error: () => {
          this.toastService.showMessage('Erro ao mudar etapa.');
        },
      });
  }

  direcionarDiretor(documentoId: number): void { 
    this.docsService.direcionarDiretor(documentoId).subscribe({
      next: () => {
        this.toastService.showMessage('Documento direcionado ao diretor com sucesso!', "SUCESSO");
      },
      error: (error) => {
        this.toastService.showMessage(
          'Erro ao direcionar o documento.',
          'ERRO'
        );
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
    this.studentData$.subscribe((data) => {
      console.log(data);
      this.observacao = data.observacao;
      this.observacaoAtual = data.observacao;
      this.status = data.status;
      this.statusAtual = data.status;
      this.etapaAtual = data.etapa;
      this.dataFinalEstagio =
      this.datePipe.transform(data.finalDataEstagio, 'dd-MM-yyyy') || '';
      this.dataInicioEstagio = this.datePipe.transform(data.inicioDataEstagio, 'dd-MM-yyyy') || '';
      this.dataSistema = this.dataFinalEstagio;
    });
  }

  onInput(event: any): void {
    let inputValue = event.target.value.replace(/\D/g, '');
    if (inputValue.length > 8) {
      inputValue = inputValue.slice(0, 8);
    }
    if (inputValue.length > 2 && inputValue.indexOf('-') === -1) {
      inputValue = `${inputValue.slice(0, 2)}-${inputValue.slice(2)}`;
    }
    if (inputValue.length > 5 && inputValue.lastIndexOf('-') === 2) {
      inputValue = `${inputValue.slice(0, 5)}-${inputValue.slice(5)}`;
    }
    this.dataFinalEstagio = inputValue;
  }

  public setSolicitacaoData() {
    const { id } = this.activatedRoute.snapshot.params;
    this.solicitacaoData$ = this.solicitacoes.getSolicitacoesData(id).pipe(
      tap((solicitacoes: any) => {
        this.disableButton =
          (this.authenticationService.role === Role.ROLE_SESTAGIO &&
            solicitacoes.statusEtapaSetorEstagio === Status.DEFERIDO) ||
          solicitacoes.statusEtapaSetorEstagio === Status.INDEFERIDO ||
          (this.authenticationService.role === Role.ROLE_SERVIDOR &&
            solicitacoes.statusEtapaCoordenador === Status.DEFERIDO) ||
          solicitacoes.statusEtapaCoordenador === Status.INDEFERIDO ||
          solicitacoes.statusEtapaSetorEstagio === Status.INDEFERIDO ||
          //solicitacoes.statusEtapaSetorEstagio === Status.EM_ANDAMENTO) ||
          (this.authenticationService.role === Role.ROLE_DIRETOR &&
            solicitacoes.statusEtapaDiretor === Status.DEFERIDO) ||
          solicitacoes.statusEtapaCoordenador === Status.INDEFERIDO ||
          solicitacoes.statusEtapaSetorEstagio === Status.INDEFERIDO ||
          solicitacoes.statusEtapaDiretor === Status.INDEFERIDO;
        //   solicitacoes.statusEtapaCoordenador === Status.EM_ANDAMENTO ||
        //   solicitacoes.statusEtapaSetorEstagio === Status.EM_ANDAMENTO) ||
        solicitacoes.status === Status.INDEFERIDO;
        solicitacoes.status === Status.DEFERIDO;
      })
    );
    console.log(this.solicitacaoData$);
  }

  trocarEditar() {
    const { id } = this.activatedRoute.snapshot.params;
    this.solicitacoes.setEditarSolicitacao(id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {
        this.toastService.showMessage('Erro ao mudar edição de documentos.');
      },
    });
  }

  trocarValidadeContrato() {
    const { id } = this.activatedRoute.snapshot.params;
    if (this.dataFinalEstagio != this.dataSistema) {
      if (this.dataFinalEstagio == '') {
        this.toastService.showMessage('Data de validade do contrato é obrigatória.', 'ERRO');
      } else {
        this.solicitacoes.setValidadeContrato(id, this.dataFinalEstagio).subscribe({
          next: () => {
            this.toastService.showMessage(
              'Data de validade do contrato foi modificada com sucesso.'
            );
          },
          error: () => {
            this.toastService.showMessage(
              'Erro ao mudar validade do contrato.'
            );
          },
        });
      }
    }
  }

  atualizarStatus() {
    if (this.status != this.statusAtual) {
      this.statusAtual = this.status;
      const { id } = this.activatedRoute.snapshot.params;
      this.solicitacoes.setStatusSolicitacao(id, this.status).subscribe({
        next: () => {
          this.toastService.showMessage(
            'Status da solicitação foi alterada com sucesso.'
          );
        },
        error: () => {
          this.toastService.showMessage('Erro ao mudar status da solicitação.');
          console.log(console.error());
        },
      });
    }
  }

  atualizarObservacao() {
    if (this.observacao != this.observacaoAtual) {
      this.observacaoAtual = this.observacao;
      const { id } = this.activatedRoute.snapshot.params;
      this.solicitacoes
        .setObservacaoDaSolicitacao(id, this.observacao)
        .subscribe({
          next: () => {
            this.toastService.showMessage('Observação foi salva!');
          },
          error: () => {
            this.toastService.showMessage(
              'Erro ao mudar observação da solicitação.'
            );
          },
        });
    }
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

    if (this.isRequestSent) {
      return;
    }

    this.isRequestSent = true;

    this.solicitacoes.deferirSolicitacao(id, formData).subscribe({
      next: () => {
        this.toastService.showMessage('Deferimento enviado com sucesso!');
        this.isRequestSent = false;
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar o deferimento.');
        this.isRequestSent = false;
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

    if (this.isRequestSent) {
      return;
    }

    this.isRequestSent = true;

    this.solicitacoes.deferirSolicitacao(id, formData).subscribe({
      next: () => {
        this.toastService.showMessage('Deferimento enviado com sucesso!');
        this.isRequestSent = false;
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar o deferimento.');
        this.isRequestSent = false;
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

    if (this.isRequestSent) {
      return;
    }

    this.isRequestSent = true;

    this.solicitacoes.deferirSolicitacao(id, formData).subscribe({
      next: () => {
        this.toastService.showMessage('Deferimento enviado com sucesso!');
        this.isRequestSent = false;
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar o deferimento.');
        this.isRequestSent = false;
      },
    });
  }

  dados: SolicitacaoIndeferir = {
    observacao: '',
  };
  public enviarIndeferimento(motivo: string): void {
    const { id } = this.activatedRoute.snapshot.params;
    console.log(this.activatedRoute.snapshot.params);
    this.dados.observacao = motivo;

    if (!motivo) {
      this.toastService.showMessage(
        'O motivo do indeferimento é obrigatório!',
        'ERRO'
      );

      return;
    }
    if (this.isRequestSent) {
      return;
    }

    this.isRequestSent = true;

    this.solicitacoes.indeferirSolicitacao(id, this.dados).subscribe(
      (response) => {
        this.toastService.showMessage('Solicitação Indeferida!');
        this.isRequestSent = false;
      },
      (error) => {
        this.toastService.showMessage(
          'Erro ao enviar o indeferimento!',
          'ERRO'
        );
        this.isRequestSent = false;
      }
    );
  }
}
