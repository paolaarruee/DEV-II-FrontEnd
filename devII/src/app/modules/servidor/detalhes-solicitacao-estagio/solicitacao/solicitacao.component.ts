import { DetalhesSolicitacaoServidorComponent } from '../detalhes-solicitacao/detalhes-solicitacao.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-solicitacao-servidor',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.scss']
})
export class SolicitacaoServidorComponent implements OnInit {

  dataFormatada!: string;

  constructor(private dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DetalhesSolicitacaoServidorComponent, {
      // width: '70%',
      // height: '80%',
      data: this.solicitacao // Passa os dados da solicitação para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica a ser executada após o fechamento do modal, se necessário
    });
  }

  dataSolicitacao: string | null = '2023-06-25 10:30:00'

  @Input() solicitacao = {
    titulo: '',
    conteudo: '',
    status: '',
    etapa: '',
    observacao: '',
    aluno: {
      id: null,
      nomeCompleto: '',
      usuarioSistema: {
        id: null,
        roles: {
          id: null,
          name: ''
        }
      },
      turno: '',
      matricula: '',
      ingresso: ''
    },
    servidor: {
      id: null,
      nome: '',
      usuarioSistema: {
        id: null,
        roles: {
          id: null,
          name: ''
        }
      },
      cargo: ''
    },
    tipo: '',
    dataSolicitacao:'' ,
    id: '',
    resposta: ''
  };

  ngOnInit() {
    this.solicitacao.dataSolicitacao = this.formatarDataSolicitacao(this.solicitacao.dataSolicitacao);
    console.log(this.solicitacao)
  }

  formatarDataSolicitacao(dataSolicitacao: string): string {
    const formattedDateFormat = 'HH:mm:ss dd-MM-yyyy'; // Formato desejado para exibição

    if (dataSolicitacao) {
      const parsedDate = parseISO(dataSolicitacao);
      return format(parsedDate, formattedDateFormat);
    } else {
      return 'Data inválida';
    }
  }


  statusSolicitacao(): string {
    if (this.solicitacao.status === 'aprovado') {
      return 'statusColor1';
    } else if (this.solicitacao.status === 'em andamento') {
      return 'statusColor2';
    } else if (this.solicitacao.status === 'negado') {
      return 'statusColor3';
    }
    return 'statusColor1';
  }

}
