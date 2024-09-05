import { Component } from '@angular/core';

import { FormularioServidorService } from '../../../core/services/formulario-servidor/formulario-servidor.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Role } from 'src/app/shared/interfaces/usuario';
import { ServidorService } from 'src/app/core/services/servidor/servidor.service';
import { ModalAnaliseComponent } from '../detalhes-solicitacao-estagio/modal-analise/modal-analise.component';
import { MatDialog } from '@angular/material/dialog';
import { CursosServiceService } from 'src/app/core/services/cursoService/cursos-service.service';

@Component({
  selector: 'app-formulario-servidor',
  templateUrl: './formulario-servidor.component.html',
  styleUrls: ['./formulario-servidor.component.scss'],
})
export class FormularioServidorComponent {
  servidor: Servidor = {
    nome: '',
    cargo: '',
    curso: {
      id: '',
      nomeCurso: '',
    },
    usuarioSistema: {
      email: '',
      senha: '',
      roles: '',
    },
  };

  gerenciarServidores: boolean = true;
  desbloqueio = false;
  emailDesbloqueio: string = '';
  confirmarSenha: string = '';
  emailPattern: RegExp = /^[\w-]+(\.[\w-]+)*@restinga\.ifrs\.edu\.br$/;
  exibirCurso: boolean = true;
  habilitarCurso: boolean = true;

  constructor(
    private service: FormularioServidorService,
    private toastService: ToastService,
    public authenticationService: AuthenticationService,
    private servidorService: ServidorService,
    private dialog: MatDialog,
    private cursosService: CursosServiceService
  ) {}

  cursos: any;
  ngOnInit(): void {
    if (this.authenticationService.role === Role.ROLE_ALUNO) {
      alert('Authenticação inválida!');
      window.location.href = '/muralVagas';
    }

    this.cursos = this.cursosService.getTodosCursos().subscribe((data: any) => {
      this.cursos = data.filter((curso: any) => curso.ativo == true);
    });
  }

  exibirCursos(event: any) {
    const valorSelecionado = event.target.value;
    if (valorSelecionado != 'Coordenador') {
      this.exibirCurso = false;
      if (valorSelecionado === 'Setor de Estágio') {
        this.servidor.curso.id = '15';
      } else {
        this.servidor.curso.id = '16';
      }
    } else {
      this.exibirCurso = true;
      this.habilitarCurso = false;
    }
  }

  servidorClick() {
    this.gerenciarServidores = false;
  }

  alunoClick() {
    window.location.href = '/listaAlunos';
  }

  excluirServidor() {
    if (this.emailDesbloqueio == '') {
      this.toastService.showMessage(
        'Informe o email do servidor para desbloqueio'
      );
      return;
    }
    

    const dialog = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo:
          'Deseja desbloquear o email: ' +
          this.emailDesbloqueio +
          '?<br> <strong>Todos os dados serão excluídos!</strong>',
        email: this.emailDesbloqueio,
        enviarCallback: () => {
          this.servidorService
            .excluirServidorEmail(this.emailDesbloqueio)
            .subscribe(
              (response) => {
                this.toastService.showMessage(
                  'Email desbloqueado com sucesso.'
                );
              },
              (error: HttpErrorResponse) => {
                if (error.status === 404) {
                  this.toastService.showMessage(
                    'Nenhum cadastro encontrado com o email informado.',
                    'error'
                  );
                } else {
                  this.toastService.showMessage(
                    'ERRO: Verifique o email! ',
                    error.error
                  );
                }
              }
            );
        },
      },
    });
  }

  enviarFormulario() {
    console.log(this.servidor.nome);
    console.log(this.servidor.cargo);
    console.log(this.servidor.curso);
    console.log(this.servidor.usuarioSistema.email);
    console.log(this.servidor.usuarioSistema.senha);
    console.log(this.confirmarSenha);

    let camposObrigatorios = [
      { nome: 'Nome Completo', valor: this.servidor.nome },
      { nome: 'Cargo', valor: this.servidor.cargo },
      { nome: 'Curso', valor: this.servidor.curso.id },
      {
        nome: 'Email institucional',
        valor: this.servidor.usuarioSistema.email,
      },
      { nome: 'Senha', valor: this.servidor.usuarioSistema.senha },
    ];

    let camposVazios = camposObrigatorios.filter((campo) => !campo.valor);

    if (camposVazios.length > 1) {
      let mensagem = `Preencha o(s) campo(s) obrigatório(s): ${camposVazios
        .map((campo) => campo.nome)
        .join(', ')}`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if (this.servidor.usuarioSistema.senha != this.confirmarSenha) {
      let mensagem = `As senhas não são iguais. Tente novamente.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }
    if (this.servidor.usuarioSistema.senha.length < 8) {
      let mensagem = `A senha deve ter no mínimo 8 caracteres.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if (this.servidor.usuarioSistema.senha.includes(' ')) {
      let mensagem = `A senha não pode conter espaços em branco.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    this.service.enviarDados(this.servidor).subscribe(
      (response) => {
        console.log('Servidor cadastrado com sucesso!');
        console.log('Resposta da API:', response);
        this.limparDadosCadastro();
        this.toastService.showMessage('Servidor Cadastrado.');
        // Lógica adicional após o envio bem-sucedido do formulário
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.toastService.showMessage('erro: ', error.error);
          if (error.error.includes('email')) {
            this.toastService.showMessageTimer(
              'Email já cadastrado.',
              4000,
              'Desbloqueie o email para cadastrar novamente!'
            );
          }
        } else {
          console.error('Erro ao enviar o formulário:', error);
          this.toastService.showMessage(
            'Não foi possivel cadastrar. Verifique os campos!'
          );
        }
        // Lógica adicional em caso de erro ao enviar o formulário
      }
    );
  }

  limparDadosCadastro() {
    this.servidor = {
      nome: '',
      cargo: '',
      curso: {
        id: '',
        nomeCurso: '',
      },
      usuarioSistema: {
        email: '',
        senha: '',
        roles: '',
      },
    };
    this.confirmarSenha = '';
  }
}
