import { Component } from '@angular/core';
import { Aluno } from '../aluno';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent {
  public estudanteMock: Aluno = {
    nome: 'João Silva',
    matricula: '20210001',
    ano: 2021,
    turno: 'Noturno',
    tipoCurso: 'Superior',
    curso: 'Engenharia de Software',
    semestre: 2,
  };
}
