
import { DetalhesSolicitacaoComponent } from '../detalhes-solicitacao/detalhes-solicitacao.component';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.scss']
})
export class SolicitacaoComponent {

  constructor(private dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DetalhesSolicitacaoComponent, {
      // width: '70%',
      // height: '80%',
      data: this.solicitacao // Passa os dados da solicitação para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica a ser executada após o fechamento do modal, se necessário
    });
  }

  @Input() solicitacao = {
    id:'',
    titulo: '',
    conteudo: '',
    status: '',
    tipo: '',
    etapa: '',
    observacao: '',
    dataSolicitacao: '',
    aluno: {
        id: '',
        nomeCompleto: '',
        usuarioSistema: {
            id: '',
            email: '',
            senha: '',
            roles: {
                id: '',
                name: ''
            }
        },
        turno: '',
        matricula: '',
        ingresso: '',
        role: {
            id: '',
            name: ''
        },
        curso: {
            id: '',
            nomeCurso: ''
        },
        ativo: ''
    }
};

  ngOnInit() {
    this.solicitacao.dataSolicitacao = this.formatarDataSolicitacao(this.solicitacao.dataSolicitacao);
    console.log(this.solicitacao)
  }

  formatarDataSolicitacao(dataSolicitacao: string): string {
    const formattedDateFormat = 'dd/MM/yyyy'; // Formato desejado para exibição

    if (dataSolicitacao) {
      const parsedDate = parseISO(dataSolicitacao);
      return format(parsedDate, formattedDateFormat);
    } else {
      return 'Data inválida';
    }
  }

  statusSolicitacao(): string{
    if(this.solicitacao.status.toLowerCase() == 'deferido' || this.solicitacao.status === 'Deferido' || this.solicitacao.status === 'aprovado'){
      return 'statusColor1'
    }

    if(this.solicitacao.status.toLowerCase() == 'em andamento' || this.solicitacao.status === 'Em Andamento'){
      return 'statusColor2'
    }

    if(this.solicitacao.status.toLowerCase() == 'indeferido' || this.solicitacao.status === 'Indeferido' || this.solicitacao.status === 'negado'){
      return 'statusColor3'
    }
    return 'statusColor1'
  }

}
