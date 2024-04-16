import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ListaEstagiariosServiceService } from 'src/app/core/services/estagiarios/lista-estagiarios-service.service';
import { ServidorService } from 'src/app/core/services/servidor/servidor.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Role } from 'src/app/shared/interfaces/usuario';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { TelaVisualizacaoEstagiarioComponent } from '../tela-visualizacao-estagiario/tela-visualizacao-estagiario.component';

@Component({
  selector: 'app-lista-estagiarios',
  templateUrl: './lista-estagiarios.component.html',
  styleUrls: ['./lista-estagiarios.component.scss'],
  providers: [MatCheckboxModule, MatRadioModule],
})
export class ListaEstagiariosComponent {
  dataAtual: Date = new Date();
  estagiarios: any[] = [];
  estagiariosCopy: any[] = [];
  paginaAtual: number = 0;

  buscarNomeOn = false;
  buscaMatriculaOn = false;

  matriculaBusca: string = '';
  matriculaBuscaAux: string = '';

  nomeBusca: string = '';
  nomeBuscaAux: string = '';
  isProcurando = false;
  statusAtualFiltro = '';

  filtro = {
    curso: '',
    estagioObrigatorio: false,
    estagioNaoObrigatorio: false,
    estagioRenovacao: false,
    estagioCancelado: false,
    estagioTerminado: false,
    aproveitamento: false,
    status: '',
  };

  listaOrientadores: Servidor[] = [];

  constructor(
    public location: Location,
    private router: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private estagiariosService: ListaEstagiariosServiceService,
    private servidorService: ServidorService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.authenticationService.role === Role.ROLE_ALUNO) {
      alert('Authenticação inválida!');
      window.location.href = '/muralVagas';
    }
    this.buscarListaOrientadores();
    this.listaDeEstagiarios();
  }

  limparFiltros() {
    this.filtro = {
      curso: '',
      estagioObrigatorio: false,
      estagioNaoObrigatorio: false,
      estagioRenovacao: false,
      estagioCancelado: false,
      estagioTerminado: false,
      aproveitamento: false,
      status: '',
    };
    this.estagiarios = this.estagiariosCopy;
  }

  filtros(checkStatus?: boolean) {
    this.estagiarios = this.estagiariosCopy;
    if (this.filtro.status == this.statusAtualFiltro && checkStatus) {
      this.filtro.status = '';
    }
    this.statusAtualFiltro = this.filtro.status;
    this.ajustarListaComFiltros();
  }

  ajustarListaComFiltros() {
    this.estagiarios = this.estagiarios.filter((estagiario) => {
      if (this.filtro.curso) {
        return (
          estagiario.solicitacao.curso.id == this.filtro.curso.toLowerCase()
        );
      } else {
        return true;
      }
    });

    this.estagiarios = this.estagiarios.filter((estagiario) => {
      if (
        this.filtro.estagioObrigatorio &&
        this.filtro.estagioNaoObrigatorio &&
        this.filtro.estagioRenovacao &&
        this.filtro.aproveitamento
      ) {
        return true;
      }
      if (this.filtro.estagioRenovacao && this.filtro.estagioObrigatorio) {
        return (
          estagiario.solicitacao.tipo.toLowerCase() === 'renovação' ||
          estagiario.solicitacao.tipo.toLowerCase() === 'obrigatório'
        );
      }
      if (this.filtro.estagioRenovacao && this.filtro.estagioNaoObrigatorio) {
        return (
          estagiario.solicitacao.tipo.toLowerCase() === 'renovação' ||
          estagiario.solicitacao.tipo.toLowerCase() === 'não obrigatório'
        );
      }
      if (this.filtro.estagioObrigatorio && this.filtro.estagioNaoObrigatorio) {
        return (
          estagiario.solicitacao.tipo.toLowerCase() === 'obrigatório' ||
          estagiario.solicitacao.tipo.toLowerCase() === 'não obrigatório'
        );
      }
      if (this.filtro.estagioObrigatorio && this.filtro.aproveitamento) {
        return (
          estagiario.solicitacao.tipo.toLowerCase() === 'obrigatório' ||
          estagiario.solicitacao.tipo.toLowerCase() === 'aproveitamento'
        );
      }
      if (this.filtro.estagioObrigatorio) {
        return estagiario.solicitacao.tipo.toLowerCase() === 'obrigatório';
      }
      if (this.filtro.estagioNaoObrigatorio) {
        return estagiario.solicitacao.tipo.toLowerCase() === 'não obrigatório';
      }
      if (this.filtro.estagioRenovacao) {
        return estagiario.solicitacao.tipo.toLowerCase() === 'renovação';
      }
      if (this.filtro.aproveitamento) {
        return estagiario.solicitacao.tipo.toLowerCase() === 'aproveitamento';
      } else {
        return true;
      }
    });

    this.estagiarios = this.estagiarios.filter((estagiario) => {
      if (this.filtro.status === 'andamento') {
        return !this.isDataPassou(estagiario) && estagiario.ativo === true;
      }
      if (this.filtro.status === 'cancelado') {
        return estagiario.ativo === false;
      }
      if (this.filtro.status === 'terminado') {
        return this.isDataPassou(estagiario);
      } else {
        return true;
      }
    });
  }

  buscarListaOrientadores() {
    this.servidorService.listaOrientadores().subscribe(
      (res: any) => {
        this.listaOrientadores = res;
        console.log(this.listaOrientadores);
      },
      (error: any) => {
        alert('Erro ao buscar orientadores: ' + error.message);
      }
    );
  }

  qualCurso(cursoId: number): String {
    switch (cursoId) {
      case 10:
        return 'ADS';
      case 11:
        return 'Letras';
      case 12:
        return 'EI';
      case 13:
        return 'GDL';
      case 14:
        return 'PG';
      case 17:
        return 'Lazer';
      case 18:
        return 'Informática';
      case 19:
        return 'Eletrônica';
      case 20:
        return 'Turismo';
      default:
        return 'Curso não encontrado';
    }
  }

  proximaPagina() {
    if (this.listaDeEstagiarios.length > 0) {
      return;
    }
    this.paginaAtual += 1;
    this.listaDeEstagiarios();
  }

  paginaAnterior() {
    if (this.listaDeEstagiarios.length >= 1 || this.paginaAtual <= 0) {
      return;
    } else {
      this.paginaAtual -= 1;
      this.listaDeEstagiarios();
    }
  }

  ativarBuscaNome() {
    this.buscarNomeOn = this.buscarNomeOn ? false : true;
    if (!this.buscarNomeOn) {
      this.nomeBusca = '';
      if (this.nomeBuscaAux != '') {
        this.nomeBuscaAux = '';
        this.listaDeEstagiarios();
      }
    }
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if(this.matriculaBusca != ''){
        this.buscaEstagiarioPorMatricual();
        this.nomeBusca = '';
        this.nomeBuscaAux = '';
      }
      else{
        this.listaDeEstagiariosNome();
      }
    }
  }

  listaDeEstagiariosNome() {
    if (
      this.nomeBusca != '' &&
      this.nomeBusca != null &&
      this.nomeBuscaAux.toLowerCase() != this.nomeBusca.toLowerCase()
    ) {
      this.nomeBuscaAux = this.nomeBusca;
      this.isProcurando = true;
      this.estagiariosService.listaEstagiarios().subscribe(
        (res: any) => {
          this.estagiarios = res;
          this.estagiarios.forEach((estagiario) => {
            console.log(estagiario);
            estagiario.dataInicioEstagio = this.formatarData(
              estagiario.solicitacao.inicioDataEstagio
            );
            estagiario.dataFinalEstagio = this.formatarData(
              estagiario.solicitacao.finalDataEstagio
            );
            estagiario.orientador = this.formatarData(
              estagiario.solicitacao.finalDataEstagio
            );
            estagiario.orientador = this.listaOrientadores.find(
              (orientador) =>
                orientador.curso.id === estagiario.solicitacao.curso.id
            )?.nome;
          });

          const filteredEstagiarios = this.estagiarios.filter((estagiario) =>
            estagiario.solicitacao.aluno.nomeCompleto
              .toLowerCase()
              .includes(this.nomeBusca.toLowerCase())
          );
          console.log(this.estagiarios);
          this.isProcurando = false;
          this.estagiarios = filteredEstagiarios;
          this.estagiariosCopy = this.estagiarios;
        },
        (error: any) => {
          if (error.status === 401) {
            alert('Authenticação inválida!' + error.error);
            this.authenticationService.logout();
            window.location.href = '/login';
          }
        }
      );
    }
  }

  pegarListaNormal(){
    this.listaDeEstagiarios();
  }

  abrirTelaEstagiario(estagiario: any) {
    const dialogRef = this.dialog.open(TelaVisualizacaoEstagiarioComponent,{
      width: '60%',
      maxHeight: '100%',
      data: estagiario // Passa os dados da solicitação para o modal
    });
  }

  buscaEstagiarioPorMatricual() {
    if (this.buscaMatriculaOn) {
      this.nomeBusca = '';
      this.nomeBuscaAux = '';

      this.estagiariosService
        .retornarEstagiarioMatricula(this.matriculaBusca)
        .subscribe((res: any) => {
          this.estagiarios = res;
          this.estagiarios.forEach((estagiario) => {
            console.log(estagiario);
            estagiario.dataInicioEstagio = this.formatarData(
              estagiario.solicitacao.inicioDataEstagio
            );
            estagiario.dataFinalEstagio = this.formatarData(
              estagiario.solicitacao.finalDataEstagio
            );
            estagiario.orientador = this.listaOrientadores.find(
              (orientador) =>
                orientador.curso.id === estagiario.solicitacao.curso.id
            )?.nome;
          });
          this.estagiariosCopy = this.estagiarios;
        });
    }
  }

  listaDeEstagiarios() {
    this.estagiariosService.listaEstagiariosPagina(this.paginaAtual).subscribe(
      (res: any) => {
        this.estagiarios = res;
        this.isProcurando = true;
        this.estagiarios.forEach((estagiario) => {
          this.isProcurando = false;
          console.log(estagiario);
          estagiario.dataInicioEstagio = this.formatarData(
            estagiario.solicitacao.inicioDataEstagio
          );
          estagiario.dataFinalEstagio = this.formatarData(
            estagiario.solicitacao.finalDataEstagio
          );
          estagiario.orientador = this.listaOrientadores.find(
            (orientador) =>
              orientador.curso.id === estagiario.solicitacao.curso.id
          )?.nome;
        });
        this.estagiariosCopy = this.estagiarios;
        this.ajustarListaComFiltros();
      },
      (error: any) => {
        this.isProcurando = false;
        if (error.status === 401) {
          alert('Authenticação inválida!' + error.error);
          this.authenticationService.logout();
          window.location.href = '/login';
        }
      }
    );
  }

  formatarNumero(input: string): string {
    // Remove all non-digit characters from the input
    const digitsOnly = input.replace(/\D/g, '');

    // Extract the country code, area code, first part, and second part
    const countryCode = digitsOnly.substring(0, 2);
    const areaCode = digitsOnly.substring(2, 4);
    const firstPart = digitsOnly.substring(4, 9);
    const secondPart = digitsOnly.substring(9);

    // Format the phone number
    return `(${countryCode}) ${areaCode} ${firstPart}-${secondPart}`;
  }

  isDataPassou(estagiario: any): boolean {
    return this.compararDatas(
      estagiario.solicitacao.finalDataEstagio,
      new Date()
    );
  }

  private formatarData(data: string): string {
    // Formata a data para o formato 'dd/MM/yyyy'
    return this.datePipe.transform(data, 'dd/MM/yyyy') || '';
  }

  compararDatas(data1: Date, data2: Date): boolean {
    return new Date(data1) < new Date(data2);
  }
}
