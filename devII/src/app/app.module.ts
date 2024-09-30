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
import { ListaSolicitacoesServidorComponent } from './modules/servidor/Listas/solicitacao-estagios-lista/tipos/lista-solicitacoes-servidor/estagios/lista-solicitacoes-servidor.component';
import { ModalAnaliseComponent } from './modules/servidor/detalhes-solicitacao-estagio/modal-analise/modal-analise.component';
import { SolicitacaoServidorComponent } from './modules/servidor/detalhes-solicitacao-estagio/solicitacao/solicitacao.component';
import { FormularioServidorComponent } from './modules/servidor/formulario-servidor/formulario-servidor.component';
import { MuralDeVagasComponent } from './modules/vagas-estagio/mural-de-vagas/mural-de-vagas.component';
import { AtualizarDocsComponent } from './modules/aluno/atualizar-docs/atualizar-docs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CaixaConfimacaoComponent } from './caixa-confimacao/caixa-confimacao.component';
import { ListaServidorComponent } from './modules/servidor/lista-servidor/lista-servidor.component';
import { ListaEstagiariosComponent } from './modules/servidor/lista-estagiarios/lista-estagiarios.component';
import { DatePipe } from '@angular/common';
import { RecuperarSenhaComponent } from './modules/recuperar-senha/recuperar-senha.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import { TelaVisualizacaoEstagiarioComponent } from './modules/servidor/tela-visualizacao-estagiario/tela-visualizacao-estagiario.component';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import { EnviarDocumentosSolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/solicitacao/dialogs/enviar-documentos-solicitacao/enviar-documentos-solicitacao.component';
import { GerenciarCursosComponent } from './modules/servidor/gerenciar-cursos/gerenciar-cursos.component';
import { MenuServidoresComponent } from './modules/servidor/Listas/solicitacao-estagios-lista/menu-servidores/menu-servidores.component';
import { SolicitacaoEstagiosListaComponent } from './modules/servidor/Listas/solicitacao-estagios-lista/solicitacao-estagios-lista.component';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ListaAlunosComponent } from './modules/servidor/lista-alunos/lista-alunos.component';
import { ManualDoAlunoComponent } from './manual-do-aluno/manual-do-aluno.component';
import { MatExpansionModule } from '@angular/material/expansion';



const ANGULAR_MODULES = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule,
  MatListModule,
  MatDialogModule,
  CoreModule,
  SharedModule,
  MatButtonModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatSelectModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatTableModule,
  MatInputModule,
  MatCardModule,
  MatTabsModule,
  MatExpansionModule,
  
];

const COMPONENTS = [
  AppComponent,
  LoginComponent,
  FormularioCadastroAlunoComponent,
  FormularioServidorComponent,
  MuralDeVagasComponent,
  PerfilComponent,
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
  ListaEstagiariosComponent,
  RecuperarSenhaComponent,
  TelaVisualizacaoEstagiarioComponent,
  EnviarDocumentosSolicitacaoComponent,
  GerenciarCursosComponent,
  MenuServidoresComponent,
  SolicitacaoEstagiosListaComponent,
  ListaAlunosComponent,
];

@NgModule({
  declarations: [...COMPONENTS, ManualDoAlunoComponent],
  providers: [ DatePipe ],
  imports: [...ANGULAR_MODULES ],
  bootstrap: [AppComponent],
})
export class AppModule {}
