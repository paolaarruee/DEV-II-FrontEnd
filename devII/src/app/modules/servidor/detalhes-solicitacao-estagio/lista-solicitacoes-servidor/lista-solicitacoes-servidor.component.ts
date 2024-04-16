import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SolicitacoesService } from 'src/app/core/services/solicitacoesEstagio/solicitacoes.service';
import { Solicitacoes } from 'src/app/shared/interfaces/solicitacoes';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Authorization, Role } from 'src/app/shared/interfaces/usuario';

@Component({
  selector: 'app-lista-solicitacoes-servidor',
  templateUrl: './lista-solicitacoes-servidor.component.html',
  styleUrls: ['./lista-solicitacoes-servidor.component.scss'],
})
export class ListaSolicitacoesServidorComponent implements OnInit {
  listaSolicitacoes: Solicitacoes[] = [];
  todasSolicitacoes: Solicitacoes[] = [];
  filtroNome: string = '';
  filtroStatus: string = '';
  dataSolicitacao: Date = new Date();
  solicitacao: Solicitacoes | undefined;
  paginaAtual: number = 1;
  solicitacoesPorPagina: number = 10;
  public readonly Roles: typeof Role = Role;

  tiposStatus = {
    Cancelamento: false,
    Aproveitamento: false,
    estagio: false,
    renovacao: false,
  };

  constructor(
    private service: SolicitacoesService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.filtroStatus = 'todas';
    this.obterTodasSolicitacoes();
  }

  limparFiltro() {
    this.tiposStatus.Cancelamento = false;
    this.tiposStatus.Aproveitamento = false;
    this.tiposStatus.estagio = false;
    this.tiposStatus.renovacao = false;
    this.filtroNome = '';
    this.filtrarPorStatus();
  }

  filtrarPorTipo() {
    if (
      this.tiposStatus.Cancelamento ||
      this.tiposStatus.Aproveitamento ||
      this.tiposStatus.estagio ||
      this.tiposStatus.renovacao
    ) {
      this.filtroStatus = 'todas';
      this.filtroNome = '';
    }
    this.listaSolicitacoes = this.todasSolicitacoes.filter(
      (solicitacao: Solicitacoes) => {
        if (
          this.tiposStatus.Cancelamento &&
          this.tiposStatus.Aproveitamento &&
          this.tiposStatus.estagio &&
          this.tiposStatus.renovacao
        ) {
          return true;
        }
        if (
          this.tiposStatus.estagio &&
          this.tiposStatus.Aproveitamento &&
          this.tiposStatus.renovacao
        ) {
          return (
            solicitacao.tipo.toLowerCase() === 'obrigatório' ||
            solicitacao.tipo.toLowerCase() === 'não obrigatório' ||
            solicitacao.tipo === 'Aproveitamento' ||
            solicitacao.tipo === 'Renovação'
          );
        }
        if (
          this.tiposStatus.estagio &&
          this.tiposStatus.Aproveitamento &&
          this.tiposStatus.Cancelamento
        ) {
          return (
            solicitacao.tipo.toLowerCase() === 'obrigatório' ||
            solicitacao.tipo.toLowerCase() === 'não obrigatório' ||
            solicitacao.tipo === 'Aproveitamento' ||
            solicitacao.tipo === 'Cancelamento'
          );
        }
        if (
          this.tiposStatus.estagio &&
          this.tiposStatus.renovacao &&
          this.tiposStatus.Cancelamento
        ) {
          return (
            solicitacao.tipo.toLowerCase() === 'obrigatório' ||
            solicitacao.tipo.toLowerCase() === 'não obrigatório' ||
            solicitacao.tipo === 'Renovação' ||
            solicitacao.tipo === 'Cancelamento'
          );
        }
        if (
          this.tiposStatus.Aproveitamento &&
          this.tiposStatus.renovacao &&
          this.tiposStatus.Cancelamento
        ) {
          return (
            solicitacao.tipo === 'Aproveitamento' ||
            solicitacao.tipo === 'Renovação' ||
            solicitacao.tipo === 'Cancelamento'
          );
        }
        if (this.tiposStatus.Aproveitamento && this.tiposStatus.renovacao) {
          return (
            solicitacao.tipo === 'Aproveitamento' ||
            solicitacao.tipo === 'Renovação'
          );
        }
        if (this.tiposStatus.Aproveitamento && this.tiposStatus.Cancelamento) {
          return (
            solicitacao.tipo === 'Aproveitamento' ||
            solicitacao.tipo === 'Cancelamento'
          );
        }
        if (this.tiposStatus.Aproveitamento && this.tiposStatus.estagio) {
          return (
            solicitacao.tipo === 'Aproveitamento' ||
            solicitacao.tipo.toLowerCase() === 'obrigatório' ||
            solicitacao.tipo.toLowerCase() === 'não obrigatório'
          );
        }
        if (this.tiposStatus.renovacao && this.tiposStatus.Cancelamento) {
          return (
            solicitacao.tipo === 'Renovação' ||
            solicitacao.tipo === 'Cancelamento'
          );
        }
        if (this.tiposStatus.renovacao && this.tiposStatus.estagio) {
          return (
            solicitacao.tipo === 'Renovação' ||
            solicitacao.tipo.toLowerCase() === 'obrigatório' ||
            solicitacao.tipo.toLowerCase() === 'não obrigatório'
          );
        }
        if (this.tiposStatus.Cancelamento && this.tiposStatus.estagio) {
          return (
            solicitacao.tipo === 'Cancelamento' ||
            solicitacao.tipo.toLowerCase() === 'obrigatório' ||
            solicitacao.tipo.toLowerCase() === 'não obrigatório'
          );
        }
        if (this.tiposStatus.Aproveitamento) {
          return solicitacao.tipo === 'Aproveitamento';
        }
        if (this.tiposStatus.renovacao) {
          return solicitacao.tipo === 'Renovação';
        }
        if (this.tiposStatus.Cancelamento) {
          return solicitacao.tipo === 'Cancelamento';
        }
        if (this.tiposStatus.estagio) {
          return (
            solicitacao.tipo.toLowerCase() === 'obrigatório' ||
            solicitacao.tipo.toLowerCase() === 'não obrigatório'
          );
        } else {
          this.filtrarPorStatus();
          return true;
        }
      }
    );
  }

  obterTodasSolicitacoes() {
    this.service
      .listarSolicitacoesPorEmailServidor()
      .toPromise()
      .then((solicitacoes) => {
        this.todasSolicitacoes = solicitacoes;
        this.filtrarPorStatus();
        this.ordenarSolicitacoes();
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

  filtrarPorNome(): void {
    this.paginaAtual = 1;
    this.filtroDataInicial = '';
    this.filtroDataFinal = '';
    this.tiposStatus.Cancelamento = false;
    this.tiposStatus.Aproveitamento = false;
    this.tiposStatus.estagio = false;
    this.tiposStatus.renovacao = false;
    
    if (this.filtroNome.trim() === '') {
      this.listaSolicitacoes = [...this.todasSolicitacoes];
    } else {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) =>
          // solicitacao.status.toLowerCase() === 'Em análise' &&
          solicitacao.aluno.nomeCompleto
            .toLowerCase()
            .includes(this.filtroNome.toLowerCase())
      );

      this.ordenarSolicitacoes();
    }
  }

  //------------------------------------------------------------------------------
  filtroDataInicial: string = '';
  filtroDataFinal: string = '';
  dataInvalida: boolean = false;

  filtrarPorData() {
    console.log(this.filtroDataInicial);
    console.log(this.filtroDataFinal);

    // Verifica se as datas são válidas
    if (!this.validarDatas()) {
      this.dataInvalida = true;
      return;
    }

    this.dataInvalida = false;

    this.paginaAtual = 1;
    const filtroDataInicial = new Date(this.filtroDataInicial);
    const filtroDataFinal = new Date(this.filtroDataFinal);

    // Define a data final para o próximo dia
    const dataFinal2 = new Date(
      filtroDataFinal.getFullYear(),
      filtroDataFinal.getMonth(),
      filtroDataFinal.getDate() + 1
    );

    this.listaSolicitacoes = this.todasSolicitacoes.filter(
      (solicitacao: Solicitacoes) => {
        // Converte a data da solicitação para um objeto Date
        const dataSolicitacao = new Date(solicitacao.dataSolicitacao);

        // Remove as informações de hora, minuto, segundo e milissegundo
        dataSolicitacao.setHours(0, 0, 0, 0);

        // Compara as datas
        return (
          dataSolicitacao >= filtroDataInicial && dataSolicitacao <= dataFinal2
        );
      }
    );

    this.ordenarSolicitacoes();
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
    if (filtroDataInicial > dataAtual) {
      return false;
    }
    if (filtroDataFinal > dataAtual) {
      return false;
    }
    return true;
  }

  //------------------------------------------------------------------------------

  passaramCincoDias(data: Date) {
    const dataAtual = new Date();
    const dataMaisCincoDias = new Date(data);
    dataMaisCincoDias.setDate(dataMaisCincoDias.getDate() + 5);

    return dataAtual > dataMaisCincoDias;
  }

  filtrarPorStatus() {
    this.paginaAtual = 1;
    if (this.filtroStatus.toLowerCase() === 'pendentes') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status.toLowerCase() === 'pendente';
        }
      );
      this.ordenarSolicitacoesCrescente();
      return;
    }

    if (this.filtroStatus === 'Atrasadas') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            this.passaramCincoDias(new Date(solicitacao.dataSolicitacao)) &&
            solicitacao.status !== 'Deferido' &&
            solicitacao.status !== 'Indeferido'
          );
        }
      );
      this.ordenarSolicitacoesCrescente();

      return;
    }

    if (this.filtroStatus === 'Novas') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status === 'Nova';
        }
      );
      this.ordenarSolicitacoes();
      return;
    }

    if (this.filtroStatus === 'Em análise') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            solicitacao.status.toLowerCase() === 'Em análise'.toLowerCase()
          );
        }
      );
      this.ordenarSolicitacoesCrescente();
      return;
    }

    if (this.filtroStatus === 'Respondidas') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            solicitacao.status.toLowerCase() === 'Respondido'.toLowerCase()
          );
        }
      );
      this.ordenarSolicitacoesCrescente();
      return;
    }

    if (this.filtroStatus === 'Deferido') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status === 'Deferido';
        }
      );
      this.ordenarSolicitacoes();
      return;
    }

    if (this.filtroStatus === 'Indeferido') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status === 'Indeferido';
        }
      );
      this.ordenarSolicitacoes();
      return;
    }

    if (this.filtroStatus === 'Finalizadas') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return solicitacao.status.toLowerCase() === 'finalizado';
        }
      );
      this.ordenarSolicitacoes();
      return;
    }

    if (this.filtroStatus === 'Cancelamento') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            solicitacao.status.toLowerCase() === 'cancelado' ||
            solicitacao.status.toLowerCase() === 'cancelamento'
          );
        }
      );
      this.ordenarSolicitacoes();
      return;
    }

    if (this.filtroStatus === 'todas') {
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          return (
            solicitacao.status !== 'Deferido' &&
            solicitacao.status !== 'Indeferido' &&
            solicitacao.status !== 'Finalizado' &&
            solicitacao.status.toLowerCase() !== 'cancelado'
          );
        }
      );
    }
    this.filtrarPorTipo();
    this.ordenarSolicitacoes();
  }

  filtrarPorEtapa(solicitacao: Solicitacoes): boolean {
    if (
      (this.authenticationService.role === Role.ROLE_SESTAGIO &&
        solicitacao.etapa === '2') ||
      solicitacao.etapa === '1'
    ) {
      return true;
    }

    if (
      this.authenticationService.role === Role.ROLE_SERVIDOR &&
      solicitacao.etapa === '3'
    ) {
      return true;
    }

    if (
      this.authenticationService.role === Role.ROLE_DIRETOR &&
      solicitacao.etapa === '4'
    ) {
      return true;
    }

    return false;
  }

  ordenarSolicitacoes() {
    this.listaSolicitacoes.sort((a, b) => {
      const dataA = new Date(a.dataSolicitacao).getTime();
      const dataB = new Date(b.dataSolicitacao).getTime();
      return dataA - dataB;
    });
  }

  ordenarSolicitacoesCrescente() {
    this.listaSolicitacoes.sort((a, b) => {
      const dataA = new Date(a.dataSolicitacao).getTime();
      const dataB = new Date(b.dataSolicitacao).getTime();
      return dataA - dataB;
    });
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
