import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnaliseDocsComponent } from './analise-docs/analise-docs.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormularioCadastroAlunoComponent } from './formulario-cadastro-aluno/formulario-cadastro-aluno.component';
import { FormularioServidorComponent } from './formulario-servidor/formulario-servidor.component';
import { MuralDeVagasComponent } from './mural-de-vagas/mural-de-vagas.component';
import { VagasComponent } from './mural-de-vagas/vagas/vagas.component';
import { DetalhesVagaComponent } from './mural-de-vagas/vagas/detalhes-vaga/detalhes-vaga.component';
import { MatDialogModule } from '@angular/material/dialog';

const ANGULAR_MODULES = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  HttpClientModule,
  MatToolbarModule,
  ReactiveFormsModule,
  FormsModule,
  MatDialogModule,
];

const COMPONENTS = [
  AppComponent,
  AnaliseDocsComponent,
  LoginComponent,
  FormularioCadastroAlunoComponent,
  FormularioServidorComponent,
  MuralDeVagasComponent, 
  VagasComponent, 
  DetalhesVagaComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...ANGULAR_MODULES, CoreModule, SharedModule],


  providers: [],

  bootstrap: [AppComponent],
})
export class AppModule {}
