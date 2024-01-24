import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { Solicitacao } from 'src/app/shared/interfaces/SolicitarEstagio';
import { MatRadioModule } from '@angular/material/radio';
@Component({
  templateUrl: './tela-solicitacao.component.html',
  styleUrls: ['./tela-solicitacao.component.scss'],
})
export class TelaSolicitacaoComponent {
  userData: any;
  agenteOutro: boolean = false;
  exibir: boolean = false;
  perfilIncompleto: boolean = false;
  sucesso: boolean = false;
  aviso: string = "Aviso";
  agenteOutroNome : string = "";
  textoEnvio: string =
    'O seu contrato de estágio deve estar com as vias assinadas pelo estudante e pela empresa contratante.';

  solicitacao: Solicitacao = {
    tipo: '',
    alunoId: '',
    nomeEmpresa:'',
    ePrivada: false,
    agente: '',
    cursoId: '',
    finalDataEstagio: new Date(),
    inicioDataEstagio: new Date(),
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.userService.getUserData().subscribe((data: any) => {
      this.verificarDadosPerfil(data);
      this.userData = data;
      this.solicitacao.alunoId = this.userData.id;
      this.solicitacao.cursoId = this.userData.curso.id;
    });
  }

  files: File[] | any[] = [];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      this.toastService.showMessage('arquivo é muito grande!');
      return;
    }
    if (this.files.length < 32) {
      this.files.push(event.target.files[0]);
      const file = event.target.files[0];
      console.log('tamanho do arquivo', file.size);
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

  deletarArquivo(file: File): void {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
  onInput(event: any, nova: string): void {
    let inputValue = event.target.value;
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(1, 1 , "");
      this.toastService.showMessage("Data do início do estágio inválida!" );
    }
    this.solicitacao.inicioDataEstagio = inputValue;
  }

  onInputFim(event: any): void {
    let inputValue = event.target.value;
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
      this.toastService.showMessage("Data do final do estágio inválida!");
    }
    this.solicitacao.finalDataEstagio = inputValue;
  }

  selecionarAgente() {
    if (this.solicitacao.agente === " ") {
      this.agenteOutro = true;
    }
    else{
      this.agenteOutro = false;
    }
  }

  verificarDadosPerfil(data: any) {
      console.log('dados do perfil', data);
      if(data.curso == null || data.matricula == null || data.ingresso == null){
        this.textoEnvio = 'Complete seu perfil para poder solicitar o estágio!';
        this.perfilIncompleto = true;
      }
  }

  redirecionarPerfil() {
    this.router.navigate(['/perfil']);
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
    }
     else {
      this.solicitacao.finalDataEstagio = new Date(this.solicitacao.finalDataEstagio + 'T00:00:00');
      this.solicitacao.inicioDataEstagio = new Date(this.solicitacao.inicioDataEstagio + 'T00:00:00');
      if(this.agenteOutroNome != null && this.agenteOutroNome != ""){
        this.solicitacao.agente = this.agenteOutroNome;
      }
      this.userService
        .enviarSolicitacao(this.solicitacao, this.files)
        .subscribe(
          (response) => {
            console.log('Solicitação cadastrada com sucesso!');
            console.log('Resposta da API:', response);
            this.textoEnvio = 'Solicitação efetuada!!';
            this.aviso = 'Sucesso'
            this.sucesso = true;
          },
          (error) => {
            if (error.status === 409) {
            }
            this.aviso = "Falha ao enviar a solicitação!"
            this.textoEnvio = error.error;
            this.sucesso = true;
          }
        );
    }
  }
}
