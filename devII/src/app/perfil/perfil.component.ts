import { Component } from '@angular/core';
import { Aluno } from '../shared/interfaces/aluno';
import { UserService } from '../core/services/user/user.service';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast/toast.service';
import { FormularioCadastroAlunoService } from '../core/services/formulario-aluno/formulario-cadastro-aluno.service';

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
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserData().subscribe((data: any) => {
      this.aluno.usuarioSistema.email = data.usuarioSistema.email
      this.aluno.nomeCompleto = data.nomeCompleto
 
    });
  }

  aluno: Aluno = {
    nomeCompleto: '',
    usuarioSistema: {
      email: '',
      roles: '',
      },
    turno: '',
    matricula: '',
    ingresso: '',
    curso: ''
  };

  enviarSolicitacao() {
    if (this.aluno.curso.length <= 0) {
      this.toastService.showMessage('Selecione o tipo!');
    } else{
      this.alunoService
        .enviarDadosPerfil(this.aluno)
        .subscribe(
          (response) => {
            console.log('Solicitação cadastrada com sucesso!');
            console.log('Resposta da API:', response);
            this.toastService.showMessage('Sucesso!!');
            this.router.navigateByUrl('/solicitacaoEstagio');
          },
          (error) => {
            if (error.status === 409) {
            }
            // Lógica adicional em caso de erro ao enviar o formulário
          }
        );
    }
  }





}
