import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaixaConfimacaoComponent } from 'src/app/caixa-confimacao/caixa-confimacao.component';
import { ServidorService } from 'src/app/core/services/servidor/servidor.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Role } from 'src/app/shared/interfaces/usuario';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { CursosServiceService } from 'src/app/core/services/cursoService/cursos-service.service';
@Component({
  selector: 'app-lista-servidor',
  templateUrl: './lista-servidor.component.html',
  styleUrls: ['./lista-servidor.component.scss'],
  providers: [MatTableModule,MatSelectModule,MatFormFieldModule,FormsModule,MatInputModule]
})
export class ListaServidorComponent {

  constructor(
    private servidorService: ServidorService,
    public authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private cursosService: CursosServiceService,
  ) {}
 
  servidores: Servidor[] = [];
  historicoServidores: any = [];
  copyHistorico: any = [];
  mostrarHistorico = false;
  filtro = '';
  colunas = ['nome', 'email', 'cargo', 'curso', 'acoes'];
  colunasHistorico = ['id', 'nome', 'curso','acao','data'];
  cursos: any = [];
  msgSemMovimentacao = false;
  

  ngOnInit() {


    if (this.authenticationService.role === Role.ROLE_ALUNO) {
      alert("Authenticação inválida!");
      window.location.href = '/muralVagas';
      }

    this.servidorService.listarTodosServidores().subscribe(
      (response) => {
        this.servidores = response;
        
        console.log(this.servidores)
      },
      (error: HttpErrorResponse) => {
        // Lógica adicional em caso de erro ao enviar o formulário
      }
    );
    this.pegarCursos();
    this.pegarHistorico();
  }

  filtros(){
    this.historicoServidores = this.copyHistorico;
    if(this.filtro == 'todos'){
      return;
    }	
    this.historicoServidores = this.historicoServidores.filter((item: any) => {
      if (item.curso.id == parseInt(this.filtro)) {
        return item;
      }
    }
    );
    if(this.historicoServidores.length == 0){
      this.msgSemMovimentacao = true;
    }
    else{
      this.msgSemMovimentacao = false;
    }
  }

  pegarCursos() {
    this.cursosService.getTodosCursos().subscribe(
      (response) => {
        this.cursos = response;
        console.log(this.cursos)
      },
      (error: HttpErrorResponse) => {
        this.toastService.showMessage('Erro ao buscar cursos');
      }
    );
  }

  pegarHistorico() {
    this.servidorService.listarHistoricoServidores().subscribe(
      (response) => {
        this.historicoServidores = response;
        this.copyHistorico = response;
      },
      (error: HttpErrorResponse) => {
        this.toastService.showMessage('Erro ao buscar histórico de servidores');
      }
    );
  }


  excluirServidor(servidor: Servidor) {
    const dialogRef = this.dialog.open(CaixaConfimacaoComponent,{
      data: {data : null , aviso : "servidor"} // Passa os dados da solicitação para o modal
    });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.servidorService.excluirServidor(servidor.usuarioSistema.id).subscribe(
                (response) => {
                  window.location.reload();
                },
                (error: HttpErrorResponse) => {
                  this.toastService.showMessage('Erro ' + error.error);
                }
              );
            }
            else{
              this.toastService.showMessage('Operação cancelada!!');
            }
          });
  }

  editarServidor(servidor: Servidor) {
    // ...
  }


}
