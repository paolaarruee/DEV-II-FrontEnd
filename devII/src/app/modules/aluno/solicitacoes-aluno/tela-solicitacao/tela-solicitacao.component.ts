import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { Solicitacao } from 'src/app/shared/interfaces/SolicitarEstagio';

@Component({
  templateUrl: './tela-solicitacao.component.html',
  styleUrls: ['./tela-solicitacao.component.scss'],
})
export class TelaSolicitacaoComponent {
  userData: any;
  exibir: boolean = false;
  sucesso: boolean = false;
  textoEnvio: string =
    'O seu contrato de estágio deve estar com as vias assinadas pelo estudante e pela empresa contratante.';

  solicitacao: Solicitacao = {
    tipo: '',
    alunoId: '',
    cursoId: '',
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.userService.getUserData().subscribe((data: any) => {
      this.userData = data;
      this.solicitacao.alunoId = this.userData.id;
      this.solicitacao.cursoId = this.userData.curso.id;
    });
  }

  files: File[] | any[] = [];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      alert('arquivo muito grande!');
      return;
    }
    if (this.files.length < 6) {
      this.files.push(event.target.files[0]);
      const file = event.target.files[0];
      this.toastService.showMessage('Documento anexado com sucesso.');
    } else {
      const result = confirm(
        'Max.  de documentos atingido! quer limpar a lista?'
      );
      if (result) {
        const fileInput: HTMLInputElement = event.target;
        fileInput.value = '';
        this.files.length = 0;
      }
    }
  }

  exibirDiv() {
    if (this.files.length == 0) {
      this.toastService.showMessage('Sem documentos anexados!!');
      return;
    }
    if (this.solicitacao.tipo.length <= 0) {
      this.toastService.showMessage('Selecione o tipo!');
    } else {
      this.exibir = !this.exibir;
    }
  }

  retornar() {
    this.router.navigate(['/listaSolicitacoesAluno']);
    this.exibir = false;
  }

  enviarSolicitacao() {
    if (this.solicitacao.tipo.length <= 0) {
      this.toastService.showMessage('Selecione o tipo!');
    } else {
      this.userService
        .enviarSolicitacao(this.solicitacao, this.files)
        .subscribe(
          (response) => {
            console.log('Solicitação cadastrada com sucesso!');
            console.log('Resposta da API:', response);
            this.textoEnvio = 'Solicitação efetuada!!';
            this.sucesso = true;
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
