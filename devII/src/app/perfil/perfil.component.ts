import { Component } from '@angular/core';
import { Aluno } from '../shared/interfaces/aluno';
import { UserService } from '../core/services/user/user.service';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast/toast.service';
import { FormularioCadastroAlunoService } from '../core/services/formulario-aluno/formulario-cadastro-aluno.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CursosServiceService } from '../core/services/cursoService/cursos-service.service';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {


  constructor(
    private userService: UserService,
    private alunoService: FormularioCadastroAlunoService,
    private toastService: ToastService,
    private router: Router,
    private cursosService: CursosServiceService
  ) {}

  ngOnInit() {
    this.userService.getUserData().subscribe((data: any) => {
      this.aluno.usuarioSistema.email = data.usuarioSistema.email
      this.aluno.nomeCompleto = data.nomeCompleto
      this.aluno.turno = data.turno
      this.aluno.curso = data.curso.id
      this.aluno.matricula = data.matricula
    });
    
    this.checarAlunoNovo();
    this.cursos = this.pegarCursos();
  }

  cursos: any;
  pegarCursos(){
    this.cursos = this.cursosService.getTodosCursos().subscribe((data: any) => {
      this.cursos = this.cursos = data.filter((curso: any) => curso.ativo == true);
    }
    );
  }

  checarAlunoNovo(){
    if(this.aluno.matricula == ""){
      this.checkNewAluno = true;
    }
    if(this.aluno.curso == ""){
      this.checkNewAluno = true;
    }
  }

  checkNewAluno = false;
  senha = "";
  senhaVerificar =  "";
  aluno: Aluno = {
    id: '',
    nomeCompleto: '',
    usuarioSistema: {
      email: '',
      senha: '',
      roles: '',
      },
    turno: '',
    matricula: '',
    curso: '',
  };


  enviarSolicitacao() {
    if (this.aluno.curso.length <= 0) {
      this.toastService.showMessage('Selecione o Curso!');
    } 
    else if (this.senha != '' && this.senhaVerificar != this.senha) 
    {
      this.toastService.showMessage('As senhas não coincidem!');
    }
    else if (this.senha != '' && this.senha.length < 8 || this.senha != '' && this.senhaVerificar.length < 8) {
      this.toastService.showMessage('A senha deve conter no mínimo 8 caracteres!');
    }
    else if (/\s/.test(this.senha)) {
      this.toastService.showMessage('A senha não pode conter espaços vazios!');
    }
    else if (this.aluno.nomeCompleto.length > 45) {
      this.toastService.showMessage('O nome deve conter no máximo 45 caracteres!');
    }
    else if (this.aluno.matricula == null) {
      this.toastService.showMessage('Preencha a matrícula!');
    }
    else if (this.aluno.turno == null) {
      this.toastService.showMessage('Selecione o turno!');
    }
    else{
      this.aluno.usuarioSistema.senha = this.senha;
      this.alunoService
        .enviarDadosPerfil(this.aluno)
        .subscribe(
          (response) => {
            console.log('Solicitação cadastrada com sucesso!');
            console.log('Resposta da API:', response);
            this.toastService.showMessageTimer('Solicitação efetuada com sucesso.', 3000);
            this.router.navigateByUrl('/solicitacaoEstagio');
          },
          (error: HttpErrorResponse) => {
            if (error.status === 409) {
            }
            if (error.status === 400) {
              // Exibir mensagens de erro de validação
              if (error.error && Array.isArray(error.error)) {
                error.error.forEach((validationError: { campo: string, mensagem: string }) => {
                  this.toastService.showMessage(validationError.campo + ": " + validationError.mensagem);
                });
              }
              else{
                this.toastService.showMessage('Erro ao enviar solicitação! ' + error.error);
              }
            }
          }
        );
    }
  }
}
