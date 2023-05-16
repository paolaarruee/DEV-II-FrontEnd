import { Component } from '@angular/core';
import { Servidor } from './servidor';
import { FormularioServidorService } from './formulario-servidor.service';

@Component({
  selector: 'app-formulario-servidor',
  templateUrl: './formulario-servidor.component.html',
  styleUrls: ['./formulario-servidor.component.scss']
})
export class FormularioServidorComponent {


  servidor: Servidor = {
    nome: '',
    cargo: '',
    curso: '',
    usuarioSistema: {
      email: '',
      senha: ''
    }
  };

  // constructor(private formularioCadastroservidorService: FormularioCadastroservidorService){}
  constructor(private service: FormularioServidorService){}

  enviarFormulario(){
    alert("Formulario enviado")
    console.log(this.servidor.nome)
    console.log(this.servidor.cargo)
    console.log(this.servidor.curso)
    console.log(this.servidor.usuarioSistema.email)
    console.log(this.servidor.usuarioSistema.senha)

    this.service.enviarDados(this.servidor).subscribe(
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
