
import { DetalhesSolicitacaoComponent } from '../detalhes-solicitacao/detalhes-solicitacao.component';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, parseISO } from 'date-fns';
import { Observable } from 'rxjs/internal/Observable';
import { DocsService } from 'src/app/core/services/docs/docs.service';
import { DocFile } from 'src/app/shared/interfaces/doc';
import { AtualizarDocsComponent } from '../../atualizar-docs/atualizar-docs.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { EnviarDocumentosSolicitacaoComponent } from './dialogs/enviar-documentos-solicitacao/enviar-documentos-solicitacao.component';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.scss'],
  providers: [MatTooltipModule, MatButtonModule]
})


export class SolicitacaoComponent {
  
  statusEditavel: string = ""
  observacaoOn = false;
  titulo = 'Detalhes da solicitação';

  constructor(private dialog: MatDialog,
              private toastService: ToastService,
              private docslist: DocsService,
              ) { }



  @Input() solicitacao = {
    id:'',
    titulo: '',
    conteudo: '',
    status: '',
    tipo: '',
    etapa: '',
    editavel: '',
    observacao: '',
    dataSolicitacao: '',
    relatorioEntregue: '',
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

  abrirEdicao(){
    if(this.solicitacao.editavel){
    const docs: Observable<DocFile[]> = this.docslist.listarDocumentosPorSolicitarEstagioId(parseInt(this.solicitacao.id));
    docs.subscribe((docs) => {
      const dialogRef = this.dialog.open(AtualizarDocsComponent, {data: { docs: docs, solicitacaoId: this.solicitacao.id }
      });
      docs.forEach((doc) => {
        console.log(doc);
      });
    }, (error) => {
      const dialogRef = this.dialog.open(AtualizarDocsComponent, {data: { docs: docs, solicitacaoId: this.solicitacao.id }
      });
      this.toastService.showMessage('Essa solicitação não tem documentos...')
    }, () => {
      //
    });
    }else{
      this.toastService.showMessage('Essa solicitação não está aberta para edição..')
  }
  }

  dataPassou(solicitacao: any){
    const data = new Date();
    const dataSolicitacao = new Date(solicitacao.finalDataEstagio);
    if(dataSolicitacao.getTime() < data.getTime()){
      return true;
    }
    return false;
  }

  abrirEnvioDocumentos(tipo : string){
    const dialogRef = this.dialog.open(EnviarDocumentosSolicitacaoComponent, {
      width: '50%',
      height: '500px',
      data: { solicitacao: this.solicitacao, tipo : tipo}
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }


  openDialog(msg? : boolean) {
    const dialogRef = this.dialog.open(DetalhesSolicitacaoComponent, {

      data: { solicitacao: this.solicitacao, observacaoOn: this.observacaoOn , msgOnly : msg}
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica a ser executada após o fechamento do modal, se necessário
    });
  }


  abrirDownload(){
    if(this.solicitacao.status.toLowerCase() == "deferido" || this.solicitacao.status.toLowerCase() == "finalizado"){
    const docs: Observable<DocFile[]> = this.docslist.listarDocumentosPorSolicitarEstagioIdAssinados(parseInt(this.solicitacao.id));
    docs.subscribe((docs) => {
      //OK
      const dialogRef = this.dialog.open(AtualizarDocsComponent, {data: { docs: docs, solicitacaoId: this.solicitacao.id, isAssinado: true}
      });
      docs.forEach((doc) => {
        console.log(doc);
      });
    }, (error) => {
      //EERO
      this.toastService.showMessage('Essa solicitação não tem documentos assinados...')
    }, () => {
      //
    });
    }else{
      this.toastService.showMessage('Essa solicitação não está aberta para edição..')
  }
  }




  ngOnInit() {
    this.solicitacao.dataSolicitacao = this.formatarDataSolicitacao(this.solicitacao.dataSolicitacao);
    console.log(this.solicitacao)
    this.isEditavel();
    this.definirTitulo();
  }

  definirTitulo(){
    const tipo = this.solicitacao.tipo.toLowerCase();
    if(this.solicitacao.tipo.toLowerCase()  == "cancelamento"){
      this.titulo = "Solicitação de cancelamento";
    }
    else if(this.solicitacao.tipo.toLowerCase() == "relatório"){
      this.titulo = "Solicitação de relatório final";
    }
    else if(tipo.includes("aproveitamento")){
      this.titulo = "Solicitação de aproveitamento de estágio ";
    }
    else{
      this.titulo = "Solicitação de estágio " + this.solicitacao.tipo;
    }
    
  }
  
  isEditavel(){
    if(!this.solicitacao.editavel){
      this.statusEditavel = "buttonOff"
    }
    if(this.solicitacao.observacao != null){
      if(this.solicitacao.observacao.length > 0){
      this.observacaoOn = true;
      }
    }
  }



  statusInfo(st : number): string{
          if(st == 1 && this.solicitacao.etapa >= "1"){
            if(this.solicitacao.status.toLocaleLowerCase() == "indeferido" && this.solicitacao.etapa == "1"){
              return "infoStatusNocheck";
            }else{
            return "infoStatusCheck"
            }
          }
          else if(st == 2 && this.solicitacao.etapa >= "2"){
            if(this.solicitacao.status.toLocaleLowerCase() == "indeferido" && this.solicitacao.etapa == "2"){
              return "infoStatusNocheck";
            }else{
            return "infoStatusCheck"
            }
          }
          else if(st == 3 && this.solicitacao.etapa >= "3"){
            if(this.solicitacao.status.toLocaleLowerCase() == "indeferido" && this.solicitacao.etapa == "3"){
              return "infoStatusNocheck";
            }else{
            return "infoStatusCheck"
            }
          }
          else if(st == 4 && this.solicitacao.etapa >= "4"){
            if(this.solicitacao.status.toLocaleLowerCase() == "indeferido" && this.solicitacao.etapa == "4"){
              return "infoStatusNocheck";
            }else{
            return "infoStatusCheck"
            }
          }
          else if(st == 5 && this.solicitacao.etapa >= "5"){
            if(this.solicitacao.status.toLocaleLowerCase() == "indeferido" && this.solicitacao.etapa == "5"){
              return "infoStatusNocheck";
            }else{
            return "infoStatusCheck"
            }
          }
          else{
          return "";
          }
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
    if(this.solicitacao.status.toLowerCase() == 'nova') {
      return 'statusColor4'
    }
    if(this.solicitacao.status.toLowerCase() == 'pendente' || this.solicitacao.status.toLowerCase() == 'respondido'){
      return 'statusColor5';
    }
    if(this.solicitacao.status.toLowerCase() == 'Em análise' || this.solicitacao.status === 'Em Andamento'){
      return 'statusColor2'
    }

    if(this.solicitacao.status.toLowerCase() == 'indeferido' || this.solicitacao.status === 'Indeferido' || this.solicitacao.status === 'negado'){
      return 'statusColor3'
    }
    return 'statusColor1'
  }

  getDescricaoStatus(){
    if(this.solicitacao.status.toLowerCase() == 'deferido' || this.solicitacao.status === 'Deferido' || this.solicitacao.status === 'aprovado'){
      return 'Solicitação deferida'
    }
    if(this.solicitacao.status.toLowerCase() == 'nova') {
      return 'Solicitação nova, ainda não foi visualizada pela unidade de estágio.'
    }
    if(this.solicitacao.status.toLowerCase() == 'respondido'){
      return 'Aluno resolveu a pendência da solicitação, aguardando resposta da unidade de estágio.';
    }
    if(this.solicitacao.status.toLowerCase() == 'pendente'){
      return 'Solicitação com alguma pendência, verificar observação para mais detalhes.'
    }
    if(this.solicitacao.status.toLowerCase() == 'indeferido'){
      return 'Solicitação foi indeferida, verifique os detalhes para ver o motivo é a etapa.';
    }
    if(this.solicitacao.status.toLowerCase() == 'em análise' || this.solicitacao.status === 'Em Andamento'){
      return 'Solicitação em análise pela unidade de estágio.'
    }
    if(this.solicitacao.status.toLowerCase() == 'finalizado'){
      return 'O estágio desta solicitação agora é considerado como finalizado devido ao aluno ter entregue o relatório final de atividades.'
    }
    if(this.solicitacao.status.toLowerCase() == 'relatório'){
      return 'Solicitação com relatório final entregue, aguardando análise da unidade de estágio.'
    }
    if(this.solicitacao.status.toLowerCase() == 'cancelado'){
      return 'O estágio desta solicitação foi cancelado pelo aluno.'
    }
    if(this.solicitacao.status.toLowerCase() == 'cancelamento'){
      return 'Solicitação de cancelamento de estágio, aguardando análise da unidade de estágio.'
    }
    return "Descrição não encontrada"
  }

}
