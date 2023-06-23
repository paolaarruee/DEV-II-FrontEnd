import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetalhesVagaComponent } from '../detalhes-vaga/detalhes-vaga.component';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.component.html',
  styleUrls: ['./vagas.component.scss']
})
export class VagasComponent {

  constructor(private dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DetalhesVagaComponent, {
      // width: '70%',
      // height: '80%',
      data: this.cardVagas // Passa os dados da solicitação para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica a ser executada após o fechamento do modal, se necessário
    });
  }

  @Input() cardVagas = {
    titulo: '',
    empresa:'',
    agencia: '',
    descricao: '',
    local: '',
    valor: '',
    turno: ''
  };
}
