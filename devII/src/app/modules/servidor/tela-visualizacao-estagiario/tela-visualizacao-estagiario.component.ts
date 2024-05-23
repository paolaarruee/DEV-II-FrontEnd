import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import { DocsService } from 'src/app/core/services/docs/docs.service';
import { saveAs } from 'file-saver';
import { ListaEstagiariosServiceService } from 'src/app/core/services/estagiarios/lista-estagiarios-service.service';
import { Solicitacao } from 'src/app/shared/interfaces/SolicitarEstagio';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { el } from 'date-fns/locale';
@Component({
  selector: 'app-tela-visualizacao-estagiario',
  templateUrl: './tela-visualizacao-estagiario.component.html',
  styleUrls: ['./tela-visualizacao-estagiario.component.scss'],
  providers: [MatTableModule]
})
export class TelaVisualizacaoEstagiarioComponent {
  constructor(
    private router: Router,
    private toastService: ToastService,
    private doc : DocsService,
    private estagiarioService : ListaEstagiariosServiceService,
    public dialogRef: MatDialogRef<TelaVisualizacaoEstagiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public estagiario: any  ) {}

    docs : any;
    mostrar = 1;
    edicao = false;
    confirm = false;


    cancelarEstagio(){
      this.confirm = false;
      this.estagiarioService.cancelarEstagio(this.estagiario.id).subscribe({
        next: (data) => {
          this.estagiario.ativo = false;
          this.toastService.showMessage('Estágio cancelado com sucesso!');
          this.dialogRef.close();
        },
        error: () => {
          this.toastService.showMessage('Erro ao cancelar estágio!', 'Tente novamente');
        }
      });
    }


    pegarListaDocumentos(id : number){
      this.edicao = false
      this.mostrar == 3 ? this.mostrar = 1 : this.mostrar = 3;
      if(this.docs != null){
        return;
      }
      this.doc.listarDocumentosPorSolicitarEstagioId(id).subscribe((data) => {
        this.docs = data;
      });
    }

    isDataPassou(estagiario: any): boolean {
      return this.compararDatas(
        estagiario.solicitacao.finalDataEstagio,
        new Date()
      );
    }

    compararDatas(data1: Date, data2: Date): boolean {
      return new Date(data1) < new Date(data2);
    }
  

    downloadDocumento(id : number, nome : string){
      this.doc.downloadDoc(id).subscribe({
        next: (blob: Blob) => {
          saveAs(new Blob([blob]), nome);
          const url = URL.createObjectURL(blob);
          window.open(url);
        },
        error: () => {

        },
      });
    }

    teste : Solicitacao = this.estagiario.solicitacao;

    validarDadosEdicao(){
      
      if(this.teste.nomeEmpresa.length > 40){
        return true;
      }
      else if(this.teste.salario.length > 10){
        return true;
      }
      else if(this.teste.cargaHoraria.length > 4){
        return true;
      }
      else if(this.teste.contatoEmpresa.length > 12){
        return true;
      }	
      return false;
    }


    atualizarEstagio(){
      if(this.validarDadosEdicao()){
        this.toastService.showMessage('Dados inválidos!', 'Verifique os campos');
        return;
      }
      console.log(this.teste);
      this.estagiarioService.atualizarEstagio(this.teste).subscribe({
        next: (data) => {
          this.toastService.showMessage('Estágio atualizado com sucesso!');
          this.edicao = false;
        },
        error: () => {
          this.toastService.showMessage('Erro ao atualizar estágio!', 'Tente novamente');
        }
      });

    }

    validarSalario(event: any) {
      let inputValue = event.target.value;
      inputValue = inputValue.replace(/[^\d.-]/g, "");
      inputValue = inputValue.replace(/(\d{1})(\d{2})$/, "$1,$2");
      inputValue =  inputValue.replace('.', ',');
      if (inputValue.length > 7) {
        inputValue = inputValue.slice(0, 7);
        this.toastService.showMessage("Salário inválido!" );
      }
      this.estagiario.solicitacao.salario = inputValue;
      event.target.value = inputValue;
    }

   pegarEstapaAtual(etapa : number)
   {
     if(etapa == 1)
     {
       return "Aluno";
     }
     else if(etapa == 2)
     {
       return "Estágios";
     }
     else if(etapa == 3)
     {
       return "Coordenador";
     }
     else if(etapa == 4)
     {
       return "Diretor";
     }
     else if(etapa == 5)
     {
       return "Concluído";
     }
     else{
        return "Sistema";
     }
   }
}
