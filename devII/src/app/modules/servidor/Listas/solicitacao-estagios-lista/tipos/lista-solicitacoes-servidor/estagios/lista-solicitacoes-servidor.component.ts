import { Component, Input, OnInit } from '@angular/core';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';
import { Solicitacoes } from 'src/app/shared/interfaces/solicitacoes';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Role } from 'src/app/shared/interfaces/usuario';
import { MatCardModule } from '@angular/material/card';
import { CursosServiceService } from 'src/app/core/services/cursoService/cursos-service.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss'],
  providers: [MatCardModule, MatSlideToggleModule],
})
export class ListaSolicitacoesServidorComponent implements OnInit {
  listaSolicitacoes: Solicitacoes[] = [];
  todasSolicitacoes: Solicitacoes[] = [];
  filtroNome: string = '';
  filtroStatus: string = '';
  filtroCurso: string = '';
  dataSolicitacao: Date = new Date();
  solicitacao: Solicitacoes | undefined;
  paginaAtual: number = 1;
  solicitacoesPorPagina: number = 10;
  public readonly Roles: typeof Role = Role;
  cursos: any[] = [];
  ordenacao = false;
  responsavelLogado = '';
  minhasSolicitacoes = false;
  constructor(
    private service: SolicitacoesService,
    private authenticationService: AuthenticationService,
    private cursosService: CursosServiceService
  ) {}

  @Input() listaTipo: string = '';

  ngOnInit() {
    this.filtroStatus = 'todas';
    this.pegarRole();
    this.obterTodasSolicitacoes();
    this.pegarCurso();
  }

  pegarRole(){
    if(this.authenticationService.role === Role.ROLE_SESTAGIO){
      this.responsavelLogado = '2';
    }
    if(this.authenticationService.role === Role.ROLE_SERVIDOR){
      this.responsavelLogado = '3';
    }
    if(this.authenticationService.role === Role.ROLE_DIRETOR){
      this.responsavelLogado = '4';
    }
  }

  limparFiltro() {
    this.filtroStatus = 'todas';
    this.filtroNome = '';
    this.filtroDataInicial = '';
    this.filtroDataFinal = '';
    this.filtroCurso = '';
    this.listaSolicitacoes = this.todasSolicitacoes;
  }
  

  pegarCurso() {
    this.cursosService.getTodosCursos().subscribe((cursos) => {
      this.cursos = cursos;
    });
  }
  

  obterTodasSolicitacoes() {
    console.log('Obtendo todas as solicitações...');
    this.service
      .listarSolicitacoesPorEmailServidor()
      .toPromise()
      .then((solicitacoes) => {
        this.todasSolicitacoes = solicitacoes;
        this.filtrarPorTipo();
        this.ordenarOrdemDecrecente();
        this.listaSolicitacoes = this.todasSolicitacoes;
        if(!this.minhasSolicitacoes){
          this.filtrarPorEtapa();
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          console.error(
            'Erro ao obter as solicitações: Status 401 Unauthorized'
          );
          this.authenticationService.logout();
          window.location.href = '/login';
        } else {
          console.error('Erro ao obter as solicitações:', error);
        }
      });
  }

  filtrarPorTipo() {
    if(this.listaTipo == 'estagios') {
      this.todasSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (solicitacao.tipo.toLowerCase().includes('aproveitamento') 
          || solicitacao.tipo.toLowerCase().includes('obrigatório')) && !solicitacao.cancelamento && !solicitacao.relatorioEntregue;
   

        }
      );
    }
    if(this.listaTipo == 'cancelamento') {
      this.todasSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
         return solicitacao.cancelamento;
        }
      );
    }
    if(this.listaTipo == 'relatorio') {
      this.todasSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.relatorioEntregue;
        }
      );
    }
    if(this.listaTipo == 'renovacao') {
      this.todasSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.tipo.toLowerCase() == ('renovação');
        }
      );
    }
  }

  filtrarPorNome(): void {
    this.paginaAtual = 1;
    if (this.filtroNome.trim() === '') {
      this.listaSolicitacoes = [...this.todasSolicitacoes];
    } else {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) =>
          solicitacao.aluno.nomeCompleto
            .toLowerCase()
            .includes(this.filtroNome.toLowerCase())
      );
      this.ordenarOrdemDecrecente();
    }
  }

  filtroDataInicial: string = '';
  filtroDataFinal: string = '';
  dataInvalida: boolean = false;

  filtrarPorData() {
    this.paginaAtual = 1;
    const filtroDataInicial = new Date(this.filtroDataInicial);
    const filtroDataFinal = new Date(this.filtroDataFinal);
    const dataFinal = new Date(
      filtroDataFinal.getUTCFullYear(),
      filtroDataFinal.getUTCMonth()
    );
    let listaData = this.todasSolicitacoes.filter(
      (solicitacao: Solicitacoes) => {
        const teste = new Date(solicitacao.dataSolicitacao);
        const dataSolicitacao = new Date(teste.getUTCFullYear(), teste.getUTCMonth());
        return dataSolicitacao >= filtroDataInicial && dataSolicitacao <= dataFinal;
      }
    );
    this.listaSolicitacoes = listaData;
  }


  validarDatas(): boolean {
    const filtroDataInicial = new Date(this.filtroDataInicial);
    const filtroDataFinal = new Date(this.filtroDataFinal);
    const dataAtual = new Date();
    if (
      !this.filtroDataInicial ||
      !this.filtroDataFinal ||
      isNaN(filtroDataInicial.getTime()) ||
      isNaN(filtroDataFinal.getTime())
    ) {
      return false;
    }
    if (filtroDataInicial > dataAtual || filtroDataFinal > dataAtual) {
      return false;
    }
    if (
      filtroDataInicial.getFullYear() > filtroDataFinal.getFullYear() ||
      (filtroDataInicial.getFullYear() === filtroDataFinal.getFullYear() &&
        filtroDataInicial.getMonth() > filtroDataFinal.getMonth())
    ) {
      return false;
    }
    return true;
  }

  passaramCincoDias(data: Date) {
    const dataAtual = new Date();
    const dataMaisCincoDias = new Date(data);
    dataMaisCincoDias.setDate(dataMaisCincoDias.getDate() + 5);
    return dataAtual > dataMaisCincoDias;
  }

  filtrar(){
    this.listaSolicitacoes = this.todasSolicitacoes;
    console.log("Filtrando..." + this.listaSolicitacoes.length );
    this.paginaAtual = 1;
    this.filtrarPorNome();
    this.filtrarPorCurso();
    this.filtrarPorEtapa();
    this.filtrarPorStatus();
  }

  filtrarPorCurso() {
    this.paginaAtual = 1;
    if (this.filtroCurso === '') {
    
    } 
    else {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.curso.id == this.filtroCurso;
        }
      );
    }  
  }

  filtrarPorStatus() {
    if (this.filtroStatus === 'edicao') {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.editavel && solicitacao.status != 'Nova';
        }
      );
      return;
    }

    if (this.filtroStatus === 'atrasadas') {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            this.passaramCincoDias(new Date(solicitacao.dataSolicitacao)) &&
            solicitacao.status !== 'Aprovado' &&
            solicitacao.status !== 'Indeferido'
          );
        }
      );
      return;
    }
    if (this.filtroStatus === 'novas') {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status === 'Nova';
        }
      );
      return;
    }

    if (this.filtroStatus === 'analise') {

      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            solicitacao.status.toLowerCase() === 'Em análise'.toLowerCase()
          );
        }
      );
      return;
    }

    if (this.filtroStatus === 'respondidas') {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            solicitacao.status.toLowerCase() === 'Respondido'.toLowerCase()
          );
        }
      );
      return;
    }

    if (this.filtroStatus === 'deferidas') {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status.toLowerCase() === 'aprovado' || solicitacao.status.toLowerCase() === 'finalizado';
        }
      );
      return;
    }

    if (this.filtroStatus === 'indeferidas') {
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status.toLowerCase() == 'indeferido';
        }
      );
      return;
    }


  }

  filtrarPorEtapa() {
    if(this.responsavelLogado == '2'){
      return;
    }
    if(this.responsavelLogado == '3' && !this.minhasSolicitacoes){
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.etapa == '3';
        }
      );
    }
    if(this.responsavelLogado == '4' && !this.minhasSolicitacoes){
      this.listaSolicitacoes = this.listaSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.etapa == '4';
        }
      );
    }
  }

 

  ordenarOrdemDecrecente() {
    this.todasSolicitacoes.sort((a, b) => {
      const dataA = new Date(a.dataSolicitacao).getTime();
      const dataB = new Date(b.dataSolicitacao).getTime();
      return dataA - dataB;
    });
    this.todasSolicitacoes.reverse();
  }

  inverterOrdem() {
    this.todasSolicitacoes.reverse();
    this.filtrar();
  }

  atualizarPagina(): void {
    setTimeout(() => {
      // Recarrega a página para exibir os resultados filtrados
      location.reload();
    }, 100); // Aguarda 100ms antes de recarregar a página
  }

  get solicitacoesPagina(): Solicitacoes[] {
    const inicio = (this.paginaAtual - 1) * this.solicitacoesPorPagina;
    const fim = inicio + this.solicitacoesPorPagina;
    return this.listaSolicitacoes.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(
      this.listaSolicitacoes.length / this.solicitacoesPorPagina
    );
  }

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  paginaAnterior() {
    this.irParaPagina(this.paginaAtual - 1);
  }

  proximaPagina() {
    this.irParaPagina(this.paginaAtual + 1);
  }

  isPaginaAnteriorDisabled(): boolean {
    return this.paginaAtual === 1;
  }

  isProximaPaginaDisabled(): boolean {
    return this.paginaAtual === this.totalPaginas;
  }
}
