import { CadastrarVagasService } from './cadastrar-vagas.service';
import { Component } from '@angular/core';
import { ToastService } from '../core/services/toast/toast.service';
import { Vaga } from '../shared/interfaces/vaga';

@Component({
  selector: 'app-cadastrar-vagas',
  templateUrl: './cadastrar-vagas.component.html',
  styleUrls: ['./cadastrar-vagas.component.scss']
})
export class CadastrarVagasComponent {

  vaga: Vaga = {
    titulo: '',
    empresa: '',
    agencia: '',
    descricao: '',
    local: '',
    valor: '',
    turno: '',
  };

  constructor(private service: CadastrarVagasService, private toastService: ToastService){}


  enviarFormulario(){


    this.service.enviarDados(this.vaga).subscribe(
      response => {
        console.log('vaga cadastrado com sucesso!');
        console.log('Resposta da API:', response);
        this.toastService.showMessage('vaga Cadastrado.')
        // Lógica adicional após o envio bem-sucedido do formulário
      },
      error => {
        if (error.status === 409) {
          this.toastService.showMessage('Email já está em uso. Por favor, escolha outro email.', 'error');
        } else {
          console.error('Erro ao enviar o formulário:', error);
          this.toastService.showMessage('Não foi possível cadastrar. Verifique os campos!', 'error');
        }
        // Lógica adicional em caso de erro ao enviar o formulário
      }
    );

  }
}
