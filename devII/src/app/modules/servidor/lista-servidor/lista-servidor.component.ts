import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaixaConfimacaoComponent } from 'src/app/caixa-confimacao/caixa-confimacao.component';
import { ServidorService } from 'src/app/core/services/servidor/servidor.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Role } from 'src/app/shared/interfaces/usuario';

@Component({
  selector: 'app-lista-servidor',
  templateUrl: './lista-servidor.component.html',
  styleUrls: ['./lista-servidor.component.scss']
})
export class ListaServidorComponent {

  constructor(
    private servidorService: ServidorService,
    public authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private toastService: ToastService,
  ) {}
 
  servidores: Servidor[] = [];
  

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
                  // Lógica adicional em caso de erro ao enviar o formulário
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
