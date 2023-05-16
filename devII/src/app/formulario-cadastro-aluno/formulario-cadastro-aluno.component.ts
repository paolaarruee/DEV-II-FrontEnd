import { Aluno } from './aluno';
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

  // constructor(private formularioCadastroAlunoService: FormularioCadastroAlunoService){}
  constructor(private service: FormularioCadastroAlunoService){}

  enviarFormulario(){
    alert("Formulario enviado")
    console.log(this.aluno.nomeCompleto)
    console.log(this.aluno.usuarioSistema.email)
    console.log(this.aluno.usuarioSistema.senha)
    console.log(this.aluno.turno)
    console.log(this.aluno.matricula)
    console.log(this.aluno.ingresso)
    console.log(this.aluno.curso)

    this.service.enviarDados(this.aluno).subscribe(
      response => {
        console.log('Resposta da API:', response);
        // Lógica adicional após o envio bem-sucedido do formulário
      },
      error => {
        console.error('Erro ao enviar o formulário:', error);
        // Lógica adicional em caso de erro ao enviar o formulário
      }
    );

  }

}
