
import { Component } from '@angular/core';

import { FormularioServidorService } from '../../../core/services/formulario-servidor/formulario-servidor.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-formulario-servidor',
  templateUrl: './formulario-servidor.component.html',
  styleUrls: ['./formulario-servidor.component.scss'],
})
export class FormularioServidorComponent {
  servidor: Servidor = {
    nome: '',
    cargo: '',
    curso: '',
    usuarioSistema: {
      roles: '',
      email: '',
      senha: '',
    },
  };

  confirmarSenha: string = '';
  emailPattern: RegExp = /^[\w-]+(\.[\w-]+)*@restinga\.ifrs\.edu\.br$/;
  exibirCurso: boolean = true;
  habilitarCurso: boolean = true;

  constructor(
    private service: FormularioServidorService,
    private toastService: ToastService
  ) {}

  exibirCursos(event : any){
    const valorSelecionado = event.target.value;
    if(valorSelecionado != "Coordenador"){
      this.exibirCurso = false;
    }
    else{
      this.exibirCurso = true;
      this.habilitarCurso = false;
    }

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
      { nome: 'Curso', valor: this.servidor.curso },
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

    if (
      !/^[\w-]+(\.[\w-]+)*@restinga\.ifrs\.edu\.br$/.test(
        this.servidor.usuarioSistema.email
      )
    ) {
      let mensagem = `O email deve ter o final @restinga.ifrs.edu.br`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    this.service.enviarDados(this.servidor).subscribe(
      (response) => {
        console.log('Servidor cadastrado com sucesso!');
        console.log('Resposta da API:', response);
        this.toastService.showMessage('Servidor Cadastrado.');
        // Lógica adicional após o envio bem-sucedido do formulário
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.toastService.showMessage(
            "erro: ",
            error.error
          );
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
}
