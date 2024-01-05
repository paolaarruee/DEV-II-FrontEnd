import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ListaEstagiariosServiceService } from 'src/app/core/services/estagiarios/lista-estagiarios-service.service';
import {ServidorService} from 'src/app/core/services/servidor/servidor.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-lista-estagiarios',
  templateUrl: './lista-estagiarios.component.html',
  styleUrls: ['./lista-estagiarios.component.scss']
})
export class ListaEstagiariosComponent {
  dataAtual: Date = new Date();
  estagiarios: any[] = [];

  constructor(
    private estagiariosService: ListaEstagiariosServiceService,
    private servidorService: ServidorService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.listaDeEstagiarios();
  }

  listaDeEstagiarios() {
    this.estagiariosService.listaEstagiarios().subscribe((res: any) => {
      this.estagiarios = res;
      
      this.estagiarios.forEach(estagiario => {
        console.log(estagiario);
        estagiario.dataInicioEstagio = this.formatarData(estagiario.solicitacao.inicioDataEstagio);
        estagiario.dataFinalEstagio = this.formatarData(estagiario.solicitacao.finalDataEstagio);
        estagiario.orientador = this.servidorService.buscarServidor(estagiario.solicitacao.curso.id).subscribe((res: any) => {
        estagiario.orientador = res.nome;
        });
      });
    });
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

