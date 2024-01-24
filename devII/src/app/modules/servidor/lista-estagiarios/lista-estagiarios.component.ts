import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ListaEstagiariosServiceService } from 'src/app/core/services/estagiarios/lista-estagiarios-service.service';
import {ServidorService} from 'src/app/core/services/servidor/servidor.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { Role } from 'src/app/shared/interfaces/usuario';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-lista-estagiarios',
  templateUrl: './lista-estagiarios.component.html',
  styleUrls: ['./lista-estagiarios.component.scss']
})
export class ListaEstagiariosComponent {
  dataAtual: Date = new Date();
  estagiarios: any[] = [];
  paginaAtual: number = 0;
  buscarNomeOn = false;
  nomeBusca : string = "";
  nomeBuscaAux : string = "";
  isProcurando = false;

  constructor(
    private authenticationService: AuthenticationService,
    private estagiariosService: ListaEstagiariosServiceService,
    private servidorService: ServidorService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    if (this.authenticationService.role === Role.ROLE_ALUNO) {
      alert("Authenticação inválida!");
      window.location.href = '/muralVagas';
      
      }

    this.listaDeEstagiarios();
  }


  buscarNomeAtivar(){

  }

  qualCurso(cursoId : number): String{
    switch (cursoId) {
      case 10:
          return "ADS";
      case 11:
          return "Letras";
      case 12:
          return "EI";
      case 13:
          return "GDL";
      case 14:
          return "PG";
      case 17:
          return "Lazer";
      case 18:
          return "Informática";
      case 19:
          return "Eletrônica";
      case 20:
          return "Turismo";
      default:
          return "Curso não encontrado";
  }
  }

 
  proximaPagina(){
    if(this.listaDeEstagiarios.length > 0) { 
      return;
    }
      this.paginaAtual += 1;
      this.listaDeEstagiarios();
  }

  paginaAnterior(){
    if(this.listaDeEstagiarios.length >= 1  || this.paginaAtual <= 0) { 
      return;
    }else{
      this.paginaAtual -= 1;
      this.listaDeEstagiarios();
    }
  }

  ativarBuscaNome(){
    this.buscarNomeOn = this.buscarNomeOn ? false : true;
    if(!this.buscarNomeOn){
      this.nomeBusca = "";
      if(this.nomeBuscaAux != ""){
        this.nomeBuscaAux = "";
        this.listaDeEstagiarios();
      }
    }
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.listaDeEstagiariosNome();
    }
  }

  listaDeEstagiariosNome() {
    if(this.nomeBusca != "" && this.nomeBusca != null && this.nomeBuscaAux.toLowerCase() != this.nomeBusca.toLowerCase() ){
      this.nomeBuscaAux = this.nomeBusca;
      this.isProcurando = true;
    this.estagiariosService.listaEstagiarios().subscribe((res: any) => {
      this.estagiarios = res;

      this.estagiarios.forEach(estagiario => {
        console.log(estagiario);
        estagiario.dataInicioEstagio = this.formatarData(estagiario.solicitacao.inicioDataEstagio);
        estagiario.dataFinalEstagio = this.formatarData(estagiario.solicitacao.finalDataEstagio);
        estagiario.orientador = this.servidorService.buscarServidor(estagiario.solicitacao.curso.id).subscribe((res: any) => {
          estagiario.orientador = res.nome;
          this.isProcurando = false;
        }, (error: any) => {
          alert("Erro ao buscar orientador: " + error.message);
          false;
        });
      });

      // Filter the estagiarios based on the orientador's name
      const filteredEstagiarios = this.estagiarios.filter(estagiario => 
        estagiario.solicitacao.aluno.nomeCompleto.toLowerCase().includes(this.nomeBusca.toLowerCase()));
        console.log(this.estagiarios);

      this.estagiarios = filteredEstagiarios;
    }, (error: any) => {
      if (error.status === 401) {
        alert("Authenticação inválida!" + error.error);
        this.authenticationService.logout();
        window.location.href = '/login';
      }
    });
  }
  }

  listaDeEstagiarios() {
    this.estagiariosService.listaEstagiariosPagina(this.paginaAtual).subscribe((res: any) => {
      this.estagiarios = res;
      this.isProcurando = true;
      this.estagiarios.forEach(estagiario => {
        this.isProcurando = false;
        console.log(estagiario);
        estagiario.dataInicioEstagio = this.formatarData(estagiario.solicitacao.inicioDataEstagio);
        estagiario.dataFinalEstagio = this.formatarData(estagiario.solicitacao.finalDataEstagio);
        estagiario.orientador = this.servidorService.buscarServidor(estagiario.solicitacao.curso.id).subscribe((res: any) => {
          estagiario.orientador = res.nome;
        }, (error: any) => {
          alert("Erro ao buscar orientador: " + error.message);
        });
      });
    }, (error: any) => {
        if(error.status === 401) {
        alert("Authenticação inválida!" + error.error);
        this.authenticationService.logout();
        window.location.href = '/login';
        }
      
    });
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
    return this.compararDatas(estagiario.solicitacao.finalDataEstagio, new Date());
  }

  private formatarData(data: string): string {
    // Formata a data para o formato 'dd/MM/yyyy'
    return this.datePipe.transform(data, 'dd/MM/yyyy') || '';
  }



  compararDatas(data1: Date, data2: Date): boolean {
    return new Date(data1) < new Date(data2);
  }

}

