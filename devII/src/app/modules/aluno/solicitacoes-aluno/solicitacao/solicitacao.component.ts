
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

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.scss']
})
export class SolicitacaoComponent {
  
  statusEditavel: string = ""
  observacaoOn = false;

  constructor(private dialog: MatDialog,
              private toastService: ToastService,
              private docslist: DocsService) { }

  openDialog() {
    const dialogRef = this.dialog.open(DetalhesSolicitacaoComponent, {
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
    editavel: '',
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

  abrirEdicao(){
    if(this.solicitacao.editavel){
    const docs: Observable<DocFile[]> = this.docslist.listarDocumentosPorSolicitarEstagioId(parseInt(this.solicitacao.id));
    docs.subscribe((docs) => {
      //OK
      const dialogRef = this.dialog.open(AtualizarDocsComponent, {data: { docs: docs, solicitacaoId: this.solicitacao.id }
      });
      docs.forEach((doc) => {
        console.log(doc);
      });
    }, (error) => {
      //EERO
      this.toastService.showMessage('Essa solicitação não tem documentos...')
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

    if(this.solicitacao.status.toLowerCase() == 'em andamento' || this.solicitacao.status === 'Em Andamento'){
      return 'statusColor2'
    }

    if(this.solicitacao.status.toLowerCase() == 'indeferido' || this.solicitacao.status === 'Indeferido' || this.solicitacao.status === 'negado'){
      return 'statusColor3'
    }
    return 'statusColor1'
  }

}
