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
import { MatTableModule } from '@angular/material/table';
import { MatStepper, MatStepperPrevious } from '@angular/material/stepper';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
  providers: [MatTableModule],
})
export class AnaliseDocsComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  public readonly Roles: typeof Role = Role;
  public documentList$!: Observable<DocFile[]>;
  public studentData$!: Observable<any>;
  public solicitacaoData$!: Observable<any>;
  item = ['Aprovado', 'Indeferido', 'Em análise'];
  status = '';
  etapa: String = '';
  statusAtual = '';
  tipo = '';
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

  cancelamento = false;
  relatorioEntregue = false;

  btDeferir = true;
  btEdicao: boolean = false;
  btCoordenador: boolean = false;
  btDiretor: boolean = false;
  btIndeferir: boolean = true;

  empresa = {
    nomeEmpresa: '',
    contatoEmpresa: '',
    agente: '',
    eprivada: false,
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
  public disableButton = false;
  motivoIndeferimento = new FormControl('');
  public isRequestSent: boolean = false;
  public observacaoAtual: String = '';
  public fileLista: File[] = [];
  documentList: any;

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

  responsavelAtual() {
    if (this.etapaAtual.toString() === '2') {
      return 'Setor de Estágio';
    }
    if (this.etapaAtual.toString() === '3') {
      return 'Coordenador de Curso';
    }
    if (this.etapaAtual.toString() === '4') {
      return 'Diretor de Curso';
    }
    if (this.etapaAtual.toString() === '5') {
      return 'Concluído';
    }
    return 'Nova solicitação';
  }

  atualizarEtapa(etapa: string) {
    if (etapa != this.etapaAtual) {
      var msg = '';
      if (
        this.status.toLowerCase() == 'Aprovado' ||
        this.status.toLowerCase() == 'indeferido' ||
        this.status.toLowerCase() == 'finalizado'
      ) {
        msg =
          'Mudar a etapa de uma solicitação encerrada fara com que ela volte para o processo de análise! <br>Deseja realmente continuar?';
      } else {
        msg =
          'Confirmar modificação da etapa?<br> O novo responsável pela etapa será notificado.';
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
                  this.status = 'Aprovado';
                } else {
                  this.status = 'Em análise';
                }
                this.etapaAtual = etapa;
                this.gerenciamentoDeBotoes();
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

  //O método de atualização foi agrupado para atender todas mudanças em uma solicitação, a validação desse método atualmente ocorre no back-end.
  async atualizarSolicitacao(){
    const { id } = this.activatedRoute.snapshot.params;
    this.editarEstagio = false;
    this.editarEmpresa = false;
    this.solicitacoes.editarSolicitacao(id, this.empresa).subscribe({
      next: () => {
        this.toastService.showMessage('Solicitação editada com sucesso!');
      },
      error: () => {
        this.toastService.showMessageTimer('Erro ao editar solicitação, verifique os campos.', 5000);
      },
    });
  }

  trocarValidadeContrato() {
    const { id } = this.activatedRoute.snapshot.params;
    this.editarDatas = false;
    if(this.dataFinalEstagio < this.dataInicioEstagio){
      this.toastService.showMessage('Data final não pode ser menor que a data de início.', 'ERRO');
      this.dataFinalEstagio = this.dataSistema;
      this.dataInicioEstagio = this.dataInicioSistema;
      return;
    }
    if (
      this.dataFinalEstagio != this.dataSistema ||
      this.dataInicioEstagio != this.dataInicioSistema
    ) {
      if (this.dataFinalEstagio == '') {
        this.dataFinalEstagio = this.dataSistema;
        this.toastService.showMessage(
          'Data de fim do contrato é obrigatória.',
          'Preencha o campo!'
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
              this.dataFinalEstagio = this.dataSistema;
              this.dataInicioEstagio = this.dataInicioSistema;
              this.toastService.showMessage(
                'Erro ao mudar validade do contrato.',
                'verifique os campos!'
              );
            },
          });
      }
    }
  }

  validarSalario(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^\d.-]/g, '');
    inputValue = inputValue.replace(/(\d{1})(\d{2})$/, '$1,$2');
    inputValue = inputValue.replace('.', ',');

    this.empresa.salario = inputValue;
    event.target.value = inputValue;
  }

  direcionarDiretor(documentoId: number): void {
    this.docsService.direcionarDiretor(documentoId).subscribe({
      next: () => {},
      error: (error) => {
        this.toastService.showMessage(
          'Algum erro ocorreu ao marcar para diretor!',
          'ERRO'
        );
      },
    });
  }

  private gerenciamentoDeBotoes() {
    if (
      this.status.toLowerCase() == 'aprovado' ||
      this.status.toLowerCase() == 'finalizado' ||
      this.status.toLowerCase() == 'aprovado' ||
      this.status.toLowerCase() == 'cancelado' ||
      this.status.toLowerCase() == 'indeferido'
    ) {
      this.disableButton = true;
    }

    if (this.authenticationService.role == 3) {
      if (this.cancelamento != true) {
        this.btDeferir = false;
      }
      this.btCoordenador = true;
      this.btDiretor = true;
      if (this.relatorioEntregue) {
        this.btDiretor = false;
      }
      this.btEdicao = true;
    }

    if (this.authenticationService.role == 2) {
      this.btEdicao = true;
      if (this.relatorioEntregue) {
        this.btDiretor = false;
      } else {
        this.btDiretor = true;
      }

      if (this.etapaAtual != '3') {
        this.disableButton = true;
      }
    }

    if (this.authenticationService.role == 4) {
      this.btEdicao = false;
      this.btIndeferir = false;
      this.btCoordenador = false;
      this.btDiretor = false;
      if (this.etapa != '4') {
        this.disableButton = true;
      }
    }
    if (this.etapaAtual == '3') {
      this.btCoordenador = false;
    }
    if (this.etapaAtual == '4') {
      this.btDiretor = false;
    }
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
        this.dataFinalEstagio = data.finalDataEstagio;
        this.dataInicioEstagio = data.inicioDataEstagio;
        this.dataSistema = this.dataFinalEstagio;
        this.dataInicioSistema = this.dataInicioEstagio;
        this.empresa.agente = data.agente;
        this.empresa.nomeEmpresa = data.nomeEmpresa;
        this.empresa.contatoEmpresa = data.contatoEmpresa;
        this.empresa.eprivada = data.ePrivada;
        this.empresa.salario = data.salario;
        this.empresa.cargaHoraria = data.cargaHoraria;
        this.empresa.turnoEstagio = data.turnoEstagio;
        this.cancelamento = data.cancelamento;
        this.relatorioEntregue = data.relatorioEntregue;
        this.tipo = data.tipo;
        this.gerenciamentoDeBotoes();
      },
      (error) => {
        if (error.status === 401) {
          window.location.href = '/muralVagas';
        }
      }
    );
  }

  onInput(event: any, nova: string): void {
    
  }

  noLetter(event: any) {
    let inputValue = event.target.value.replace(/\D/g, '');
    event.target.value = inputValue;
  }

  colunas: string[] = ['icone', 'nome', 'estado', 'diretor', 'download'];
  solicicitacaoTeste: any;
  public setSolicitacaoData() {
    const { id } = this.activatedRoute.snapshot.params;
    this.solicitacoes.getSolicitacoesData(id).subscribe({
      next: (data) => {
        this.solicicitacaoTeste = data;
        console.log(this.solicicitacaoTeste);
      },
      error: () => {
        this.toastService.showMessage('Erro ao carregar dados da solicitação.');
      },
    });
  }

  private setDocumentListId(): void {
    const { id } = this.activatedRoute.snapshot.params;
    if (this.authenticationService.role != Role.ROLE_SESTAGIO) {
      this.colunas.splice(3, 1);
    }
    this.solicitacoes.getlistDocsPorEstagioId(id).subscribe({
      next: (data) => {
        this.documentList = data;
      },
      error: () => {
        this.toastService.showMessage('Erro ao carregar documentos.');
      },
    });
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

  atualizarObservacao(obs: string) {
    if (obs != this.observacaoAtual) {
      this.observacaoAtual = obs;
      const { id } = this.activatedRoute.snapshot.params;
      this.solicitacoes.setObservacaoDaSolicitacao(id, obs).subscribe({
        next: () => {
          this.trocarEditar();
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
      'Você tem certeza que deseja deferir a solicitação do aluno? <br> O deferimento encerra o processo de análise e o aluno será notificado.';
    if (this.authenticationService.role === Role.ROLE_DIRETOR) {
      msg =
        'Deferir o estágio do aluno? <br><br><strong>Lembre-se de anexar o Termo de Compromisso assinado.</strong>';
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
        conteudo:
          'Você tem certeza que deseja indeferir essa solicitação? <br> Para indeferir insira o motivo no campo abaixo.',
        retroceder: true,
        mostrarCampoMotivo: true,
        enviarCallback: (motivoIndeferimento: string) =>
          this.enviarIndeferimento(motivoIndeferimento),
      },
    });
  }

  abrirDialogParaEdicao() {
    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo:
          'Digite o motivo do retorno para edição. <br> O aluno será notificado.',
        mostrarCampoMotivo: true,
        retroceder: false,
        edicaoAluno: true,
        enviarCallback: (motivoIndeferimento: string) => {
          this.atualizarObservacao(motivoIndeferimento);
        },
      },
    });
  }

  public enviarDeferimentoDiretor(): void {
    const { id } = this.activatedRoute.snapshot.params;
    const data = {
      status: Status.Aprovado,
      statusEtapaDiretor: Status.Aprovado,
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
    const data = { statusEtapaSetorEstagio: Status.Aprovado };

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

  public salvarDocumentos(stepper? : MatStepper): void {
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
        this.documentList = this.solicitacoes.getlistDocsPorEstagioId(id);
        this.toastService.showMessage('Documentos enviados com sucesso!');
        stepper?.previous();
      },
      error: () => {
        this.toastService.showMessage('Erro ao enviar os documentos.');
      },
    });
  }

  public enviarDeferimento(): void {
    const { id } = this.activatedRoute.snapshot.params;

    const data = { statusEtapaCoordenador: Status.Aprovado };

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

  public getTipoAproveitamento(tipo: string) {
    if (tipo.includes('APRO1')) {
      return 'Aproveitamento de Est. não obrigatório como estágio obrigatório.';
    }
    if (tipo.includes('APRO2')) {
      return 'Aproveitamento de trabalho vigente como estágio obrigatório.';
    }
    if (tipo.includes('APRO3')) {
      return 'Aproveitamento de atividades de extensão/bolsa/monitoria ...';
    }
    if (tipo.includes('APRO4')) {
      return 'Aproveitamento de experiência profissional comprovada.';
    } else {
      return tipo;
    }
  }

  getResponsavelAtual() {
    if (this.etapaAtual === '1') {
      return 'Aluno';
    }
    if (this.etapaAtual === '2') {
      return 'Setor de estágio';
    }
    if (this.etapaAtual === '3') {
      return 'Coordenador';
    }
    if (this.etapaAtual === '4') {
      return 'Diretor';
    }
    if (this.etapaAtual === '5') {
      return 'Concluído';
    }
    return 'Sistema';
  }

  getResponsavelAtualByEtapa(etapa: any) {
    if (etapa === '1') {
      return 'Aluno';
    }
    if (etapa === '2') {
      return 'Setor de estágio';
    }
    if (etapa === '3') {
      return 'Coordenador';
    }
    if (etapa === '4') {
      return 'Diretor';
    }
    if (etapa === '5') {
      return 'Sistema';
    }
    return 'Sistema';
  }
}
