import { ToastService } from './../core/services/toast/toast.service';
import { Aluno } from '../shared/interfaces/aluno';
import { FormularioCadastroAlunoService } from './formulario-cadastro-aluno.service';
import { Component} from '@angular/core';


@Component({
  selector: 'app-formulario-cadastro-aluno',
  templateUrl: './formulario-cadastro-aluno.component.html',
  styleUrls: ['./formulario-cadastro-aluno.component.scss']
})

export class FormularioCadastroAlunoComponent {

  aluno: Aluno = {
    nomeCompleto: '',
    usuarioSistema: {
      email: '',
      senha: ''
      },
    turno: '',
    matricula: '',
    ingresso: '',
    curso: ''
  };

  confirmarSenha: string = '';
  private static readonly emailPattern = /^[\w-]+(\.[\w-]+)*@restinga\.ifrs\.edu\.br$/;

  // constructor(private formularioCadastroAlunoService: FormularioCadastroAlunoService){}
  constructor(private service: FormularioCadastroAlunoService, private toastService: ToastService){}

  enviarFormulario(){
    console.log(this.aluno.nomeCompleto)
    console.log(this.aluno.usuarioSistema.email)
    console.log(this.aluno.usuarioSistema.senha)
    console.log(this.aluno.turno)
    console.log(this.aluno.matricula)
    console.log(this.aluno.ingresso)
    console.log(this.aluno.curso)
    console.log(this.confirmarSenha)

    let camposObrigatorios = [
      { nome: 'Nome Completo', valor: this.aluno.nomeCompleto },
      { nome: 'Email institucional', valor: this.aluno.usuarioSistema.email },
      { nome: 'Turno', valor: this.aluno.turno },
      { nome: 'Matrícula', valor: this.aluno.matricula },
      { nome: 'Ingresso', valor: this.aluno.ingresso },
      { nome: 'Curso', valor: this.aluno.curso },
      { nome: 'Senha', valor: this.aluno.usuarioSistema.senha }
    ];

    let camposVazios = camposObrigatorios.filter(campo => !campo.valor);

    if (camposVazios.length > 0) {
      let mensagem = `Preencha o(s) campo(s) obrigatório(s): ${camposVazios.map(campo => campo.nome).join(', ')}`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    if(this.aluno.usuarioSistema.senha != this.confirmarSenha){
      let mensagem = `As senhas não são iguais. Tente novamente.`;
      this.toastService.showMessage(mensagem, 'error');
      return;
    }

    // if (!FormularioCadastroAlunoComponent.emailPattern.test(this.aluno.usuarioSistema.email)) {
    //   let mensagem = `O email deve ter o final @restinga.ifrs.edu.br`;
    //   this.toastService.showMessage(mensagem, 'error');
    //   return;
    // }

    this.service.enviarDados(this.aluno).subscribe(
      response => {
        console.log('Aluno cadastrado com sucesso!');
        console.log('Resposta da API:', response);
        this.toastService.showMessage('Aluno Cadastrado.')
        // Lógica adicional após o envio bem-sucedido do formulário
      },
      error => {
        console.error('Erro ao enviar o formulário:', error);
        this.toastService.showMessage('Não foi possivel cadastrar. Verifique os campos!')
        // Lógica adicional em caso de erro ao enviar o formulário
      }
    );

  }

}
