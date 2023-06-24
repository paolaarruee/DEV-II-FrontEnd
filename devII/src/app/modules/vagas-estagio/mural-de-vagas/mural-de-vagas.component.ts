import { Component } from '@angular/core';
import { VagasService } from 'src/app/core/services/vagas-estagio/vagas.service';

@Component({
  selector: 'app-mural-de-vagas',
  templateUrl: './mural-de-vagas.component.html',
  styleUrls: ['./mural-de-vagas.component.scss'],
})
export class MuralDeVagasComponent {
  listaVagas: any[] = [];

  constructor(private service: VagasService) {}

  ngOnInit() {
    this.service.obterSolicitacoes().subscribe(
      (solicitacoes) => {
        this.listaVagas = solicitacoes;
        this.listaVagas.sort((a, b) => {
          const dataA = new Date(a.dataSolicitacao).getTime();
          const dataB = new Date(b.dataSolicitacao).getTime();
          return dataB - dataA;
        });
      },
      (error) => {
        console.error('Erro ao obter as solicitações:', error);
      }
    );
  }
}
