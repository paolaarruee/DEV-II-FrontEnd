import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Vaga } from 'src/app/shared/interfaces/vaga';
import { Component } from '@angular/core';
import { VagasService } from 'src/app/core/services/vagas-estagio/vagas.service';

@Component({
  selector: 'app-cadastrar-vagas',
  templateUrl: './cadastrar-vagas.component.html',
  styleUrls: ['./cadastrar-vagas.component.scss'],
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

  constructor(
    private service: VagasService,
    private toastService: ToastService
  ) {}

  enviarFormulario() {
    this.service.enviarDados(this.vaga).subscribe(
      (response) => {
        this.toastService.showMessage('vaga Cadastrado.');
      },
      (error) => {
        if (error.status === 409) {
          this.toastService.showMessage(
            'Email já está em uso. Por favor, escolha outro email.',
            'error'
          );
        } else {
          this.toastService.showMessage(
            'Não foi possível cadastrar. Verifique os campos!',
            'error'
          );
        }
      }
    );
  }
}
