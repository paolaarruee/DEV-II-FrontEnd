import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { Solicitacao } from 'src/app/shared/interfaces/SolicitarEstagio';
import { ListaEstagiariosServiceService } from 'src/app/core/services/estagiarios/lista-estagiarios-service.service';

@Component({
  templateUrl: './tela-solicitacao.component.html',
  styleUrls: ['./tela-solicitacao.component.scss'],
})
export class TelaSolicitacaoComponent {

  idParaDeletar = "";
  userData: any;
  agenteOutro: boolean = false;
  exibir: boolean = false;
  perfilIncompleto: boolean = false;
  sucesso: boolean = false;
  aviso: string = "Aviso";
  agenteOutroNome : string = "";
  textoEnvio: string =
    'O contrato de estágio deve ter a assinatura tanto do estudante quanto da empresa contratante!';
  tipoAproveitamento: string = "";
  inicioDataEstagio: string = "";
  finalDataEstagio: string = "";

  camposErro: { [key: string]: boolean } = {
    nomeEmpresa: false,
    ePrivada: false,
    agente: false,
    cursoId: false,
    salario: false,
    cargaHoraria: false,
    contatoEmpresa: false,
    turnoEstagio: false,
    finalDataEstagio: false,
    inicioDataEstagio: false,
  };
 
  solicitacao: Solicitacao = {
    tipo: '',
    alunoId: '',
    nomeEmpresa:'',
    ePrivada: false,
    agente: '',
    cursoId: '',
    salario: '',
    cargaHoraria: '',
    contatoEmpresa: '',
    turnoEstagio: '',
    finalDataEstagio: new Date(),
    inicioDataEstagio: new Date(),
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
    private estagiariosService: ListaEstagiariosServiceService
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
  documentos: { [key: string]: File | any } = {};

  anexarDocObrigatorios(event: any, tipo: string) {
    if(event.target.files[0].size > 1048576){
      this.toastService.showMessage('arquivo é muito grande!');
      return;
    }
    this.documentos[tipo] = event.target.files[0];
  }


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

  inputMostrar = {
    tce : false,
    atividades : false,
    requerimento : false,
    vinculo : false,
    atividadesEmpresa : false,
    comprovanteExtensao : false
  }

  resetCamposErro() {
    for (let key in this.camposErro) {
      this.camposErro[key] = false;
    }
  }

  mostrarDocumentosObrigatorios(){
    this.inputMostrar.tce = false;
    this.inputMostrar.atividades = false;
    this.inputMostrar.requerimento = false;
    this.inputMostrar.vinculo = false;
    this.inputMostrar.atividadesEmpresa = false;
    this.inputMostrar.comprovanteExtensao = false;
    this.documentos = {};
    

    switch(this.solicitacao.tipo){
      case 'Obrigatório':
        this.inputMostrar.tce = true;
        this.inputMostrar.atividades = true;
        this.tipoAproveitamento = "";
        break;
      case 'Não obrigatório':
        this.inputMostrar.tce = true;
        this.inputMostrar.atividades = true;
        this.tipoAproveitamento = "";
        break;
        case 'Aproveitamento':
          if(this.tipoAproveitamento == "APRO1"){
            this.inputMostrar.requerimento = true;
            this.inputMostrar.tce = true;
            this.inputMostrar.atividades = true;
          }
          else if(this.tipoAproveitamento == "APRO2"){
            this.inputMostrar.requerimento = true;
            this.inputMostrar.vinculo = true;
            this.inputMostrar.atividadesEmpresa = true;
          }
          else if(this.tipoAproveitamento == "APRO3"){
            this.inputMostrar.requerimento = true;
            this.inputMostrar.comprovanteExtensao = true;
          }
          else if(this.tipoAproveitamento == "APRO4"){
            this.inputMostrar.requerimento = true;
            this.inputMostrar.vinculo = true;
            this.inputMostrar.atividadesEmpresa = true;
          }
          break;
        
    }
    

  }

  validarContato(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^\d]/g, "");
    if (inputValue.length > 11) {
      inputValue = inputValue.slice(0, 11);
      this.toastService.showMessage("Contato da empresa inválido!", "Max 11 caracteres");
    }
    this.solicitacao.contatoEmpresa = inputValue;
    event.target.value = inputValue;
    }


  validarSalario(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^\d.-]/g, "");
    inputValue = inputValue.replace(/(\d{1})(\d{2})$/, "$1,$2");
    inputValue =  inputValue.replace('.', ',');
    if (inputValue.length > 7) {
      inputValue = inputValue.slice(0, 7);
      this.toastService.showMessage("Salário inválido!" );
    }
    this.solicitacao.salario = inputValue;
    event.target.value = inputValue;
  }

  validarCargaHoraria(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^\d]/g, "");
    if (inputValue.length > 4) {
      inputValue = inputValue.slice(0, 4);
      this.toastService.showMessage("Carga horária inválida!", "MAX 4 caracteres");
    }
    this.solicitacao.cargaHoraria = inputValue;
    event.target.value = inputValue;
  
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

  estagiarios: any[] = [];
  pegarEstagioEstagiario(id : number) {
    this.estagiariosService.retornarEstagioEstagiario(id).subscribe((res: any) => {
      this.estagiarios = res;
      console.log(res);
    });
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
      if(data.curso == null || data.matricula == null){
        this.textoEnvio = 'Complete seu perfil para poder solicitar o estágio!';
        this.perfilIncompleto = true;
      }
  }

  redirecionarPerfil() {
    this.router.navigate(['/perfil']);
  }

  exibirDiv() {
    if (this.files['length'] == 0 && Object.keys(this.documentos).length == 0){
      this.toastService.showMessage('Sem documentos anexados!!');
      return;
    }

    if( this.verificarDados()){
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

  verificarDados(): boolean{
    var erro = 'Campos inválidos: ';
    var erroOn = false;

    if (this.solicitacao.tipo.length <= 0) {
      erro += 'Selecione o tipo! ';
      this.camposErro['tipo'] = true;
      erroOn = true;
    }

    if(this.solicitacao.nomeEmpresa.length > 48){
      erro += 'Nome da empresa muito grande! ';
      this.camposErro['nomeEmpresa'] = true;
      erroOn = true;
    }
    if (this.solicitacao.agente.length > 20){
      erro += 'Nome do agente muito grande! ';
      this.camposErro['agente'] = true;
      erroOn = true;
    }
    if(this.solicitacao.salario.length > 7 || this.solicitacao.salario.length < 1)
    {
      erro += 'Salário inválido! ';
      this.camposErro['salario'] = true;
      erroOn = true;
    }
    if(this.solicitacao.cargaHoraria.length > 5 || this.solicitacao.cargaHoraria.length < 1){
      erro += 'Carga horária inválida! ';
      this.camposErro['cargaHoraria'] = true;
      erroOn = true;
    }
    if(this.solicitacao.turnoEstagio.length <= 0){
      erro += 'Selecione o turno do estágio! ';
      this.camposErro['turnoEstagio'] = true;
      erroOn = true;
    }
    if(this.solicitacao.contatoEmpresa.length > 11 || this.solicitacao.contatoEmpresa.length < 11){
      erro += 'Contato da empresa inválido! ';
      this.camposErro['contatoEmpresa'] = true;
      erroOn = true;
    }
    if(this.solicitacao.nomeEmpresa.length < 3 || this.solicitacao.nomeEmpresa.length > 48 ){
      erro += 'Nome da empresa inválido! ';
      this.camposErro['nomeEmpresa'] = true;
      erroOn = true;
    }
    if(this.inicioDataEstagio == "" || this.finalDataEstagio == "" || this.solicitacao.inicioDataEstagio == null || this.solicitacao.finalDataEstagio == null){
      erro += 'Data inválida! ';
      this.camposErro['inicioDataEstagio'] = true;
      this.camposErro['finalDataEstagio'] = true;
      erroOn = true;
    }
    if(this.solicitacao.inicioDataEstagio > this.solicitacao.finalDataEstagio){
      erro += 'Data de início maior que a data final! ';
      this.camposErro['inicioDataEstagio'] = true;
      erroOn = true;
    }
    if(this.solicitacao.tipo == "Aproveitamento" && this.tipoAproveitamento.length <= 0){
      erro += 'Selecione o tipo de aproveitamento! ';
      erroOn = true;
    }
    if(this.solicitacao.tipo == "Aproveitamento" && this.tipoAproveitamento == "APRO1" && (this.documentos['requerimento'] == null || this.documentos['tce'] == null || this.documentos['atividades'] == null)){
      erro += 'Anexe todos os documentos! ';
      erroOn = true;
    }
    if(this.solicitacao.tipo == "Aproveitamento" && this.tipoAproveitamento == "APRO2" && (this.documentos['requerimento'] == null || this.documentos['vinculo'] == null || this.documentos['atividadesEmpresa'] == null)){
      erro += 'Anexe todos os documentos! ';
      erroOn = true;
    }
    if(this.solicitacao.tipo == "Aproveitamento" && this.tipoAproveitamento == "APRO3" && (this.documentos['requerimento'] == null || this.documentos['termoFornalizacao'] == null|| this.documentos['comprovanteExtensao'] == null)){
      erro += 'Anexe todos os documentos! ';
      erroOn = true;
    }
    if(this.solicitacao.tipo == "Aproveitamento" && this.tipoAproveitamento == "APRO4" && (this.documentos['requerimento'] == null || this.documentos['vinculo'] == null || this.documentos['atividadesEmpresa'] == null)){
      erro += 'Anexe todos os documentos! ';
      erroOn = true;
    }
    if(this.solicitacao.tipo == "Obrigatório"  && (this.documentos['tce'] == null || this.documentos['atividades'] == null)){
      erro += 'Anexe todos os documentos! ';
      erroOn = true;
    }
    if(this.solicitacao.tipo == "Não obrigatório"  && (this.documentos['tce'] == null || this.documentos['atividades'] == null)){
      erro += 'Anexe todos os documentos! ';
      erroOn = true;
    }
    if(this.solicitacao.agente == ""){
      erro += 'Selecione o agente! ';
      this.camposErro['agente'] = true;
      erroOn = true;
    }
    if(erroOn){
      this.toastService.showMessageTimer(erro, 3500);
    }
    return erroOn;
  }

  enviarSolicitacao() {
    if (this.solicitacao.tipo.length <= 0) {
      this.toastService.showMessage('Selecione o tipo!');
    }
    else if(this.verificarDados()){
      this.exibir = false;
      return;
    }
     else {
      for (const key in this.documentos) {
        if (this.documentos[key] != null) {
          this.files.push(this.documentos[key]);
        }
      }
      if(this.tipoAproveitamento != ""){
        this.solicitacao.tipo += " " + this.tipoAproveitamento;
      }

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
