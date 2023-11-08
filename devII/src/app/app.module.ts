import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';


import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { FormularioCadastroAlunoComponent } from './modules/aluno/formulario-cadastro-aluno/formulario-cadastro-aluno.component';
import { DetalhesSolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/detalhes-solicitacao/detalhes-solicitacao.component';
import { ListaSolicitacoesAlunoComponent } from './modules/aluno/solicitacoes-aluno/lista-solicitacoes-aluno/lista-solicitacoes-aluno.component';
import { SolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/solicitacao/solicitacao.component';
import { TelaSolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/tela-solicitacao/tela-solicitacao.component';
import { AnaliseDocsComponent } from './modules/servidor/detalhes-solicitacao-estagio/analise-docs/analise-docs.component';
import { DetalhesSolicitacaoServidorComponent } from './modules/servidor/detalhes-solicitacao-estagio/detalhes-solicitacao/detalhes-solicitacao.component';
import { ListaSolicitacoesServidorComponent } from './modules/servidor/detalhes-solicitacao-estagio/lista-solicitacoes-servidor/lista-solicitacoes-servidor.component';
import { ModalAnaliseComponent } from './modules/servidor/detalhes-solicitacao-estagio/modal-analise/modal-analise.component';
import { SolicitacaoServidorComponent } from './modules/servidor/detalhes-solicitacao-estagio/solicitacao/solicitacao.component';
import { FormularioServidorComponent } from './modules/servidor/formulario-servidor/formulario-servidor.component';
import { CadastrarVagasComponent } from './modules/vagas-estagio/cadastrar-vagas/cadastrar-vagas.component';
import { DetalhesVagaComponent } from './modules/vagas-estagio/detalhes-vaga/detalhes-vaga.component';
import { MuralDeVagasComponent } from './modules/vagas-estagio/mural-de-vagas/mural-de-vagas.component';
import { VagasComponent } from './modules/vagas-estagio/vagas/vagas.component';
import { AtualizarDocsComponent } from './modules/aluno/atualizar-docs/atualizar-docs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CaixaConfimacaoComponent } from './caixa-confimacao/caixa-confimacao.component';
import { ListaServidorComponent } from './modules/servidor/lista-servidor/lista-servidor.component';



const ANGULAR_MODULES = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule,
  MatDialogModule,
  CoreModule,
  SharedModule,
];

const COMPONENTS = [
  AppComponent,
  LoginComponent,
  FormularioCadastroAlunoComponent,
  FormularioServidorComponent,
  MuralDeVagasComponent,
  CadastrarVagasComponent,
  VagasComponent,
  PerfilComponent,
  DetalhesVagaComponent,
  ModalAnaliseComponent,
  SolicitacaoServidorComponent,
  DetalhesSolicitacaoServidorComponent,
  ListaSolicitacoesServidorComponent,
  ListaSolicitacoesAlunoComponent,
  SolicitacaoComponent,
  CaixaConfimacaoComponent,
  DetalhesSolicitacaoComponent,
  TelaSolicitacaoComponent,
  AtualizarDocsComponent,
  ListaServidorComponent,
  AnaliseDocsComponent,
  
];

@NgModule({
  declarations: [...COMPONENTS ],

  imports: [...ANGULAR_MODULES ],
  bootstrap: [AppComponent],
})
export class AppModule {}
