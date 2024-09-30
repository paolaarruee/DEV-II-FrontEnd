import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaixaConfimacaoComponent } from 'src/app/caixa-confimacao/caixa-confimacao.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Role } from 'src/app/shared/interfaces/usuario';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { CursosServiceService } from 'src/app/core/services/cursoService/cursos-service.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { Aluno } from 'src/app/shared/interfaces/aluno';
@Component({
  selector: 'app-lista-servidor',
  templateUrl: './lista-alunos.component.html',
  styleUrls: ['./lista-alunos.component.scss'],
  providers: [MatTableModule,MatSelectModule,MatFormFieldModule,FormsModule,MatInputModule]
})
export class ListaAlunosComponent {
  constructor(
    private userService: UserService,
    public authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private cursosService: CursosServiceService,
  ) {}
 
  aluno: Aluno[] = [];
  alunoFiltro: Aluno[] = [];
  filtro = '';
  colunas = ['nome', 'email', 'cargo', 'curso','matricula', 'acoes'];
  cursos: any = [];
  matricula = '';
  nomeDoAlunoFiltro = '';
  msgSemMovimentacao = false;
  

  ngOnInit() {


    if (this.authenticationService.role === Role.ROLE_ALUNO) {
      alert("Authenticação inválida!");
      window.location.href = '/muralVagas';
      }
      this.userService.getTodosAlunos().subscribe(
      (response) => {
        this.aluno = response;
        
        console.log(this.aluno)
      },
      (error: HttpErrorResponse) => {
      }
    );
    this.pegarCursos();
  }

  testeDev(){
    this.userService.testeUsuario().subscribe(
      (response) => {
        this.toastService.showMessage('Alunos cadastrados com sucesso');
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        this.toastService.showMessage('Erro ao cadastrar alunos');
      }
    );
  } 

  limpar(){
    this.nomeDoAlunoFiltro = '';
    this.matricula = '';
  }

  filtrosPorNome(){
    this.alunoFiltro = this.aluno.filter((aluno) => {
      return aluno.nomeCompleto.toLowerCase().includes(this.nomeDoAlunoFiltro.toLowerCase());
    });
    this.matricula = '';
  }

  filtros(){
    this.alunoFiltro = this.aluno.filter((aluno) => {
      return aluno.matricula.includes(this.matricula);
    });
    this.nomeDoAlunoFiltro = '';
  }

  excluirAluno(email: string){
    var dialog = this.dialog.open(CaixaConfimacaoComponent, {
      data: {
        aviso: 'aluno',
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.excluirAluno(email).subscribe(
          (response) => {
            this.toastService.showMessage('Aluno excluído com sucesso');
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            this.toastService.showMessage('Erro ao excluir aluno');
          }
        );
      }
    });

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

}
