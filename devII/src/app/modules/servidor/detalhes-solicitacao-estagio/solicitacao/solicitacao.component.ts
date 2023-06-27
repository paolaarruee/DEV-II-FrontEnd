import { DetalhesSolicitacaoServidorComponent } from '../detalhes-solicitacao/detalhes-solicitacao.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format } from 'date-fns';

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

  data_solicitacao: string | null = '2023-06-25 10:30:00'

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
    data_solicitacao:'' , 
    id: '',
    resposta: ''
  };

  ngOnInit() {
    this.formatarDataSolicitacao();
  }

formatarDataSolicitacao() {
  if (this.solicitacao.data_solicitacao) {
    this.dataFormatada = format(new Date(this.solicitacao.data_solicitacao), 'dd-MM-yyyy HH:mm:ss');
  } else {
    this.dataFormatada = 'Data inválida';
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
