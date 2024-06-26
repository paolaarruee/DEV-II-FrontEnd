import { DetalhesSolicitacaoServidorComponent } from '../detalhes-solicitacao/detalhes-solicitacao.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';




@Component({
  selector: 'app-solicitacao-servidor',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.scss'],
  providers: [MatCardModule]
})
export class SolicitacaoServidorComponent implements OnInit {

  responsavelAtual : string = 'Responsável atual '
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

  //dataSolicitacao: string | null = '2023-06-25 10:30:00'

  @Input() solicitacao = {
    id:'',
    titulo: '',
    conteudo: '',
    status: '',
    tipo: '',
    etapa: '',
    observacao: '',
    dataSolicitacao: '',
    editavel:'',
    relatorioEntregue: '',
    cancelamento: '',
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
    console.log(this.solicitacao)
    this.setResponsavelAtual();
  }


  public getTipoAproveitamento(tipo : string){
    if(tipo.includes('APRO1')){
      return "Aproveitamento de Est. não obrigatório como estágio obrigatório."
    }
    if(tipo.includes('APRO2')){
      return "Aproveitamento de trabalho vigente como estágio obrigatório."
    }
    if(tipo.includes('APRO3')){
      return "Aproveitamento de atividades de extensão/bolsa/monitoria ..."
    }
    if(tipo.includes('APRO4')){
      return "Aproveitamento de experiência profissional comprovada."
    }
    else{
      return tipo;
    }
  }


  setResponsavelAtual(){
 
    if(this.solicitacao.etapa === '3'){
      this.responsavelAtual = 'Responsável atual: Coordenador de curso'
    }
    if(this.solicitacao.etapa === '2'){
      this.responsavelAtual = 'Responsável atual: Setor estágio'
    }
    if(this.solicitacao.etapa === '4'){
      this.responsavelAtual = 'Responsável atual: Diretor'
    }
    if(this.solicitacao.etapa === '1'){
      this.responsavelAtual = 'Responsavel atual: Nova solicitação'
    }
    if(this.solicitacao.etapa === '5'){
      this.responsavelAtual = 'Concluído';
    }
  }
 
  solicitacaoStatus(){
      const dataAtual = new Date();
      const dataMaisCincoDias = new Date(this.solicitacao.dataSolicitacao);
      dataMaisCincoDias.setDate(dataMaisCincoDias.getDate() + 5);
      if(dataAtual > dataMaisCincoDias && (this.solicitacao.status.toLowerCase() === "nova" || this.solicitacao.status.toLowerCase() === "Em análise")){
        return "cardPendente"
      }
      if(this.solicitacao.status.toLowerCase() === "indeferido"){
        return "cardIndeferido"
      }
      if(this.solicitacao.status.toLowerCase() === "Aprovado"){
        return "cardDeferido"
      }
      if(this.solicitacao.status.toLowerCase() === "Em análise"){
        return "cardEmAndamento"
      }
      else{
        return ""
      }
    }

  statusSolicitacao(): string{
    if(this.solicitacao.status.toLowerCase() == 'Aprovado' || this.solicitacao.status === 'Aprovado' || this.solicitacao.status === 'aprovado'){
      return 'statusColor1'
    }
    if(this.solicitacao.status.toLowerCase() == 'pendente' || this.solicitacao.status.toLowerCase() == 'relatório'){
      return 'statusColor5';
    }

    if(this.solicitacao.status.toLowerCase() == 'Em análise' || this.solicitacao.status === 'Em análise'){
      return 'statusColor2'
    }

    if(this.solicitacao.status.toLowerCase() == 'nova') {
      return 'statusColor4'
    }
    

    if(this.solicitacao.status.toLowerCase() == 'indeferido' || this.solicitacao.status === 'Indeferido' || this.solicitacao.status === 'negado'){
      return 'statusColor3'
    }
    return 'statusColor1'
  }

}
