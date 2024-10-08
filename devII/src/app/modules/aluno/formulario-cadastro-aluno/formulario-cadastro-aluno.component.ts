import { Aluno } from 'src/app/shared/interfaces/aluno';
import { FormularioCadastroAlunoService } from '../../../core/services/formulario-aluno/formulario-cadastro-aluno.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { CursosServiceService } from 'src/app/core/services/cursoService/cursos-service.service';

@Component({
  selector: 'app-formulario-cadastro-aluno',
  templateUrl: './formulario-cadastro-aluno.component.html',
  styleUrls: ['./formulario-cadastro-aluno.component.scss'],
})
export class FormularioCadastroAlunoComponent {
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

  confirmarSenha: string = '';
  emailPattern: RegExp = /^[\w-]+(\.[\w-]+)*@restinga\.ifrs\.edu\.br$/;
  event: any;

  constructor(
    private service: FormularioCadastroAlunoService,
    private toastService: ToastService,
    private router: Router,
    private cursosService: CursosServiceService
  ) {}

  cursos: any;
  

  ngOnInit(): void {
    this.cursosService.getTodosCursos().subscribe({
      next: (data) => {
        this.cursos = this.cursos = data.filter((curso: any) => curso.ativo == true);
      },
      error: () => {
        console.log('Erro ao listar cursos');
      },
    });
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    event.target.value = numericValue;
  }

  enviarFormulario() {
    console.log(this.aluno.nomeCompleto);
    console.log(this.aluno.usuarioSistema.email);
    console.log(this.aluno.usuarioSistema.senha);
    console.log(this.aluno.turno);
    console.log(this.aluno.matricula);
    console.log(this.aluno.curso);
    console.log(this.confirmarSenha);
    let camposObrigatorios = [
      { nome: 'Nome Completo', valor: this.aluno.nomeCompleto },
      { nome: 'Email institucional', valor: this.aluno.usuarioSistema.email },
      { nome: 'Turno', valor: this.aluno.turno },
      { nome: 'Matrícula', valor: this.aluno.matricula },
      { nome: 'Curso', valor: this.aluno.curso },
      { nome: 'Senha', valor: this.aluno.usuarioSistema.senha },
    ];

    let camposVazios = camposObrigatorios.filter((campo) => !campo.valor);

    if (camposVazios.length > 0) {
      let mensagem = `Preencha o(s) campo(s) obrigatório(s): ${camposVazios
        .map((campo) => campo.nome)
        .join(', ')}`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if (this.aluno.usuarioSistema.senha != this.confirmarSenha) {
      let mensagem = `As senhas não são iguais. Tente novamente.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if (this.aluno.usuarioSistema.senha.length < 8) {
      let mensagem = `A senha deve ter no mínimo 8 caracteres.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if(this.aluno.matricula.length < 10 || this.aluno.matricula.length > 10){
      let mensagem = `A matrícula deve ter 10 caracteres.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }
    
    if (this.aluno.usuarioSistema.senha.includes(' ')) {
      let mensagem = `A senha não pode conter espaços em branco.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if(this.aluno.nomeCompleto.length > 45){
      let mensagem = `O nome deve ter no máximo 45 caracteres.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if (
      !/^[\w-]+(\.[\w-]+)*@(restinga\.ifrs\.edu\.br|aluno\.restinga\.ifrs\.edu\.br)$/.test(
        this.aluno.usuarioSistema.email
      )
    ) {
      let mensagem = `O email deve ter o final @restinga.ifrs.edu.br ou @aluno.restinga.ifrs.edu.br`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    this.service.enviarDados(this.aluno).subscribe(
      (response) => {
        console.log('Aluno cadastrado com sucesso!');
        console.log('Resposta da API:', response);
        this.toastService.showMessage('Aluno Cadastrado.');
        this.router.navigate(['/login']);
        // Lógica adicional após o envio bem-sucedido do formulário
      },
      (error) => {
        if (error.status === 409) {
          this.toastService.showMessage(
            'ERRO:',
            error.error,
          );
        } else {
          console.error('Erro ao enviar o formulário:', error);
          this.toastService.showMessage(
            'Não foi possível cadastrar. Verifique os campos!',
            'error'
          );
        }
        // Lógica adicional em caso de erro ao enviar o formulário
      }
    );
  }
}
