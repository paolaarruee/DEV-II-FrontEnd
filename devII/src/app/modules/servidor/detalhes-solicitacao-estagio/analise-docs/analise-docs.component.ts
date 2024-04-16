import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';

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
  item = ['Deferido', 'Indeferido', 'Em análise'];
  status = '';
  etapa: String = '';
  statusAtual = '';
  etapaAtual: String = '';
  dataFinalEstagio = '';
  dataInicioEstagio = '';
  dataSolicitacao = '';
  dataSistema = '';
  dataInicioSistema = '';
  eSetorEstagio: boolean = false;
  editarEmpresa = false;
  editarEstagio = false;
  editarDatas = false;

  empresa = {
    nomeEmpresa: '',
    contatoEmpresa: '',
    agente: '',
    ePrivada: false,
    salario: '',
    cargaHoraria: '',
    turnoEstagio: '',
  };

  listaEtapas = {
    'Setor estágio': 2,
    Coordenador: 3,
    Diretor: 4,
    Concluido: 5,
  };

  public dialogAberto: boolean = false;
  public servidore!: Servidor;
  public disableButton?: boolean;
  motivoIndeferimento = new FormControl('');
  public isRequestSent: boolean = false;
  public solicitacao: any;
  public observacaoAtual: String = '';
  public fileLista: File[] = [];

  public constructor(
    private activatedRoute: ActivatedRoute,
    private docsService: DocsService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private solicitacoes: SolicitacoesService,
    public authenticationService: AuthenticationService,
    public datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.role === Role.ROLE_ALUNO) {
      this.router.navigate(['/muralVagas']);
    }
    if (this.authenticationService.role === Role.ROLE_SESTAGIO) {
      this.eSetorEstagio = true;
      this.toastService.showMessage(
        'Você está logado como Setor de Estágio',
        'SUCESSO'
      );
    }

    this.setStudentData();
    this.setSolicitacaoData();
    this.setDocumentListId();
  }

  download({ id, nome }: DocFile): void {
    this.docsService.downloadDoc(id).subscribe({
      next: (blob: Blob) => {
        saveAs(new Blob([blob]), nome);
        const url = URL.createObjectURL(blob);
        window.open(url);
        this.toastService.showMessage('Arquivo baixado com sucesso!');
      },
      error: () => {
        this.toastService.showMessage('Erro ao baixar o arquivo.');
      },
    });
  }

  addFileLista(): void {
    const file = this.fileInputRef.nativeElement?.files?.[0];
    if (file) {
      this.fileLista.push(file);
      this.toastService.showMessage(
        'Arquivo adicionado a lista para upload: ' + file?.name
      );
    }
  }

  removeFile(file: File) {
    this.fileLista = this.fileLista.filter((item) => item !== file);
    this.toastService.showMessage(
      'Arquivo removido da lista para upload: ' + file?.name
    );
  }

  responsavelAtual(){
    if(this.etapaAtual.toString() === '2'){
      return 'Setor de Estágio';
    }
    if(this.etapaAtual.toString() === '3'){
      return 'Coordenador de Curso';
    }
    if(this.etapaAtual.toString() === '4'){
      return 'Diretor de Curso';
    }
    if(this.etapaAtual.toString() === '5'){
      return 'Concluído';
    }
      return 'Nova solicitação';
  }

  atualizarEtapa(etapa: string) {
    if (etapa != this.etapaAtual) {
      var msg = '';
      if(this.status.toLowerCase() == 'deferido' || this.status.toLowerCase() == 'indeferido' || this.status.toLowerCase() == 'finalizado'){
        msg = 'Mudar a etapa de uma solicitação encerrada fara com que ela volte para o processo de análise! <br>Deseja realmente continuar?';
      }
      else{
        msg = 'Confirmar modificação da etapa?<br> O novo responsável pela etapa será notificado.';
      }
      const { id } = this.activatedRoute.snapshot.params;
      const dialogRef = this.dialog.open(ModalAnaliseComponent, {
        width: '600px',
        data: {
          conteudo: msg,
          retroceder: false,
          enviarCallback: () =>
            this.solicitacoes.setEtapaSolicitacao(id, etapa).subscribe({
              next: () => {
                this.salvarDocumentos(),
                  this.toastService.showMessage(
                    'Etapa da solicitação foi alterada com sucesso.'
                  );
                if (this.etapaAtual.toString() === '5') {
                  this.status = 'Deferido';
                } else {
                  this.status = 'Em análise';
                }
                this.etapaAtual = etapa;
              },
              error: (error) => {
                if (error.status === 404) {
                  this.toastService.showMessage(
                    'ERRO!',
                    'Não há servidor cadastrado para essa etapa! (Coordenador ou Diretor)'
                  );
                } else {
                  this.toastService.showMessage('Erro ao mudar etapa.');
                }
              },
            }),
        },
      });
    } else {
      this.toastService.showMessage('Já se encontra nessa etapa.');
    }
  }

  async atualizarEstagio() {
    const { id } = this.activatedRoute.snapshot.params;
    this.editarEstagio = false;
    const studentData = await this.studentData$.toPromise();
    if (
      this.empresa.cargaHoraria === studentData.cargaHoraria &&
      this.empresa.turnoEstagio === studentData.turno &&
      this.empresa.salario === studentData.salario
    ) {
      this.toastService.showMessage(
        'Nenhuma alteração foi feita nos dados do estágio.'
      );
      return;
    }
    if (
      this.empresa.cargaHoraria.length > 4 ||
      this.empresa.turnoEstagio.length > 10 ||
      this.empresa.salario.length > 16
    ) {
      this.toastService.showMessage(
        'Dados do estágio inválidos',
        'MAX CARACTERES!'
      );
      return;
    }
    this.solicitacoes.editarEmpresa(id, this.empresa).subscribe({
      next: () => {
        this.toastService.showMessage('Empresa editada com sucesso!');
      },
      error: () => {
        this.toastService.showMessage('Erro ao editar empresa.');
      },
    });
  }

  validarSalario(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^\d.-]/g, '');
    inputValue = inputValue.replace(/(\d{1})(\d{2})$/, '$1,$2');
    inputValue = inputValue.replace('.', ',');

    this.empresa.salario = inputValue;
    event.target.value = inputValue;
  }

  async atualizarEmpresa() {
    const { id } = this.activatedRoute.snapshot.params;
    this.editarEmpresa = false;
    const studentData = await this.studentData$.toPromise(); // Await the subscription and extract the value from the observable
    if (
      this.empresa.agente === studentData.agente &&
      this.empresa.nomeEmpresa === studentData.nomeEmpresa &&
      this.empresa.contatoEmpresa === studentData.contatoEmpresa &&
      this.empresa.ePrivada === studentData.ePrivada
    ) {
      this.toastService.showMessage(
        'Nenhuma alteração foi feita nos dados da empresa.'
      );
      return;
    }
    if (
      this.empresa.agente.length > 16 ||
      this.empresa.nomeEmpresa.length > 48 ||
      this.empresa.contatoEmpresa.length > 11
    ) {
      this.toastService.showMessage(
        'Dados da empresa inválidos',
        'MAX CARACTERES!'
      );
      return;
    }
    this.solicitacoes.editarEmpresa(id, this.empresa).subscribe({
      next: () => {
        this.toastService.showMessage('Empresa editada com sucesso!');
      },
      error: () => {
        this.toastService.showMessage('Erro ao editar empresa.');
      },
    });
  }

  direcionarDiretor(documentoId: number): void {
    this.docsService.direcionarDiretor(documentoId).subscribe({
      next: () => {
        this.toastService.showMessage(
          'Documento direcionado ao diretor com sucesso!',
          'SUCESSO'
        );
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
    this.studentData$.subscribe(
      (data) => {
        console.log(data);
        this.observacaoAtual = data.observacao;
        this.status = data.status;
        this.etapa = data.etapa;
        this.statusAtual = data.status;
        this.etapaAtual = data.etapa;
        this.dataFinalEstagio =
          this.datePipe.transform(data.finalDataEstagio, 'dd-MM-yyyy') || '';
        this.dataInicioEstagio =
          this.datePipe.transform(data.inicioDataEstagio, 'dd-MM-yyyy') || '';
        this.dataSistema = this.dataFinalEstagio;
        this.dataInicioSistema = this.dataInicioEstagio;
        //Dados Empresa
        this.empresa.agente = data.agente;
        this.empresa.nomeEmpresa = data.nomeEmpresa;
        this.empresa.contatoEmpresa = data.contatoEmpresa;
        this.empresa.ePrivada = data.ePrivada;
        this.empresa.salario = data.salario;
        this.empresa.cargaHoraria = data.cargaHoraria;
        this.empresa.turnoEstagio = data.turnoEstagio;
      },
      (error) => {
        if (error.status === 401) {
          window.location.href = '/muralVagas';
        }
      }
    );
  }

  onInput(event: any, nova: string): void {
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

    // Validar a data do contrato
    const [dia, mes, ano] = inputValue.split('-');
    const data = new Date(`${dia}-${mes}-${ano}`);

    if (
      parseInt(dia) > 31 ||
      parseInt(mes) > 12 ||
      mes === '00' ||
      parseInt(ano) > 3000
    ) {
      if (parseInt(dia) > 31) {
        inputValue = inputValue.replace(dia, '31');
      }
      if (parseInt(mes) > 12 || mes === '00') {
        inputValue = inputValue.replace(mes, '12');
      }
      this.toastService.showMessage('Insira uma data válida!', 'ERRO');
    }
    if (nova === 'nova') {
      this.dataInicioEstagio = inputValue;
      return;
    }
    this.dataFinalEstagio = inputValue;
  }

  noLetter(event: any) {
    let inputValue = event.target.value.replace(/\D/g, '');
    event.target.value = inputValue;
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
    this.editarDatas = false;
    if (
      this.dataFinalEstagio != this.dataSistema ||
      this.dataInicioEstagio != this.dataInicioSistema
    ) {
      if (this.dataFinalEstagio == '') {
        this.toastService.showMessage(
          'Data de validade do contrato é obrigatória.',
          'ERRO'
        );
      } else {
        this.solicitacoes
          .setValidadeContrato(
            id,
            this.dataFinalEstagio,
            this.dataInicioEstagio
          )
          .subscribe({
            next: () => {
              this.dataInicioSistema = this.dataInicioEstagio;
              this.dataSistema = this.dataFinalEstagio;
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

  atualizarObservacao(obs: string) {
    if (obs != this.observacaoAtual) {
      this.observacaoAtual = obs;
      const { id } = this.activatedRoute.snapshot.params;
      this.solicitacoes.setObservacaoDaSolicitacao(id, obs).subscribe({
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
    var msg =
      'Você tem certeza que deseja deferir o estágio do aluno? <br> O deferimento encerra o processo de análise e o aluno será notificado.';
    if (this.authenticationService.role === Role.ROLE_DIRETOR) {
      msg =
        'Deferir o estágio do aluno? Lembre-se de anexar o Termo de Compromisso assinado.';
    }
    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo: msg,
        retroceder: true,
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
        conteudo: 'Você tem certeza que deseja indeferir essa solicitação? <br> Para indeferir insira o motivo no campo abaixo.',
        retroceder: true,
        mostrarCampoMotivo: true,
        enviarCallback: (motivoIndeferimento: string) =>
          this.enviarIndeferimento(motivoIndeferimento),
      },
    });
  }

  abrirDialogEdicao() {
    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo: 'Digite o motivo do retorno para edição. <br> O aluno será notificado.',
        mostrarCampoMotivo: true,
        retroceder: true,
        edicaoAluno: true,
        enviarCallback: (motivoIndeferimento: string) => {
          this.trocarEditar();
          this.atualizarObservacao(motivoIndeferimento);
        },
      },
    });
  }

  public enviarDeferimentoDiretor(): void {
    const { id } = this.activatedRoute.snapshot.params;
    const data = {
      status: Status.DEFERIDO,
      statusEtapaDiretor: Status.DEFERIDO,
    };
    const formData: FormData = new FormData();

    formData.append(
      'dados',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    for (let i = 0; i < this.fileLista.length; i++) {
      formData.append('file', this.fileLista[i]);
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

    const formData: FormData = new FormData();

    formData.append(
      'dados',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    for (let i = 0; i < this.fileLista.length; i++) {
      formData.append('file', this.fileLista[i]);
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

  public salvarDocumentos(): void {
    if (this.fileLista.length === 0) {
      this.toastService.showMessage(
        'Nenhum documento foi adicionado para upload!',
        'Não há documentos anexados!'
      );
      return;
    }
    const { id } = this.activatedRoute.snapshot.params;
    const fileInput = this.fileInputRef.nativeElement;
    fileInput.value = '';

    const formData: FormData = new FormData();
    for (let i = 0; i < this.fileLista.length; i++) {
      formData.append('file', this.fileLista[i]);
    }
    formData.append(
      'solicitacaoId',
      new Blob([JSON.stringify(id)], {
        type: 'application/json',
      })
    );

    this.docsService.uploadDocs(formData).subscribe({
      next: () => {
        this.fileLista = [];
        this.documentList$ = this.solicitacoes.getlistDocsPorEstagioId(id);
        this.toastService.showMessage('Documentos enviados com sucesso!');
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar os documentos.');
      },
    });
  }

  public enviarDeferimento(): void {
    const { id } = this.activatedRoute.snapshot.params;

    const data = { statusEtapaCoordenador: Status.DEFERIDO };

    const formData: FormData = new FormData();

    formData.append(
      'dados',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    for (let i = 0; i < this.fileLista.length; i++) {
      formData.append('file', this.fileLista[i]);
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
