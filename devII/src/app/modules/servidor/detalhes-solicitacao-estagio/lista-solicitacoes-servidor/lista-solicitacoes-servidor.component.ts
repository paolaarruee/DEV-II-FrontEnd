import { Component, OnInit } from '@angular/core';
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
  solicitacoesPorPagina: number = 5;
  public readonly Roles: typeof Role = Role;

  constructor(private service: SolicitacoesService, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.filtroStatus = 'EM ANDAMENTO';
    this.obterTodasSolicitacoes();
    this.filtrarPorStatus();
  }

  obterTodasSolicitacoes() {
    this.service.listarSolicitacoesPorEmailServidor().toPromise().then((solicitacoes) => {
      this.todasSolicitacoes = solicitacoes;
      this.filtrarPorStatus();
      this.filtrarPorEtapa();
      this.ordenarSolicitacoes();
    }).catch((error) => {
      console.error('Erro ao obter as solicitações:', error);
    });
  }

  filtrarPorNome(): void {
    this.paginaAtual = 1;
    if (this.filtroNome.trim() === '') {
      this.listaSolicitacoes = [...this.todasSolicitacoes];
    } else {
      this.listaSolicitacoes = this.todasSolicitacoes.filter((solicitacao: Solicitacoes) =>
       // solicitacao.status.toLowerCase() === 'em andamento' &&
        solicitacao.aluno.nomeCompleto
        .toLowerCase()
        .includes(this.filtroNome.toLowerCase())
      );

      this.ordenarSolicitacoes();
    }
  }

  //------------------------------------------------------------------------------
  filtroDataInicial : string = '';
  filtroDataFinal : string = '';
  dataInvalida: boolean = false;

  filtrarPorData() {
    console.log(this.filtroDataInicial)
    console.log(this.filtroDataFinal)

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
    const dataFinal2 = new Date(filtroDataFinal.getFullYear(), filtroDataFinal.getMonth(), filtroDataFinal.getDate() + 1);

    this.listaSolicitacoes = this.todasSolicitacoes.filter((solicitacao: Solicitacoes) => {

        // Converte a data da solicitação para um objeto Date
        const dataSolicitacao = new Date(solicitacao.dataSolicitacao);

        // Remove as informações de hora, minuto, segundo e milissegundo
        dataSolicitacao.setHours(0, 0, 0, 0);

        // Compara as datas
        return (
          dataSolicitacao >= filtroDataInicial &&
          dataSolicitacao <= dataFinal2
        );
    });

    this.ordenarSolicitacoes();
  }

  validarDatas(): boolean {
    const filtroDataInicial = new Date(this.filtroDataInicial);
    const filtroDataFinal = new Date(this.filtroDataFinal);
    const dataAtual = new Date(); // Obtém a data atual

    // Verifica se as datas são inválidas, vazias ou não são um número
    if (
      !this.filtroDataInicial ||
      !this.filtroDataFinal ||
      isNaN(filtroDataInicial.getTime()) ||
      isNaN(filtroDataFinal.getTime())
    ) {
      return false;
    }

    // Verifica se a data inicial é maior que a data atual
    if (filtroDataInicial > dataAtual) {
      return false;
    }

    // Verifica se a data final é maior que a data atual
    if (filtroDataFinal > dataAtual) {
      return false;
    }

    return true;
  }

  //------------------------------------------------------------------------------

  filtrarPorStatus() {
    this.paginaAtual = 1;

    if (this.filtroStatus === 'todas') {
      this.listaSolicitacoes = [...this.todasSolicitacoes];
    } else {
      const filtroStatusUpperCase = this.filtroStatus.toUpperCase();
      this.listaSolicitacoes = this.todasSolicitacoes.filter(
        (solicitacao: Solicitacoes) => {
          const statusUpperCase = solicitacao.status.toUpperCase();
          return statusUpperCase === filtroStatusUpperCase;
        }
      );
    }

    this.ordenarSolicitacoes();
  }

  filtrarPorEtapa() {
    if (this.authenticationService.role === Role.ROLE_SESTAGIO) {
      this.listaSolicitacoes = this.listaSolicitacoes.filter((solicitacao) => {
        return solicitacao.etapa === '2';
      });
    }

    if (this.authenticationService.role === Role.ROLE_SERVIDOR) {
      this.listaSolicitacoes = this.listaSolicitacoes.filter((solicitacao) => {
        return solicitacao.etapa === '3';
      });
    }

    if (this.authenticationService.role === Role.ROLE_DIRETOR) {
      this.listaSolicitacoes = this.listaSolicitacoes.filter((solicitacao) => {
        return solicitacao.etapa === '4';
      });
    }
  }

  ordenarSolicitacoes() {
    this.listaSolicitacoes.sort((a, b) => {
      const dataA = new Date(a.dataSolicitacao).getTime();
      const dataB = new Date(b.dataSolicitacao).getTime();
      return dataB - dataA;
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
    return Math.ceil(this.listaSolicitacoes.length / this.solicitacoesPorPagina);
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
