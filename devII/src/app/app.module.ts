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
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormularioCadastroAlunoComponent } from './formulario-cadastro-aluno/formulario-cadastro-aluno.component';

const ANGULAR_MODULES = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  HttpClientModule,
  MatToolbarModule,
  FormsModule,
];

@NgModule({
  declarations: [
    AppComponent,
    AnaliseDocsComponent,
    LoginComponent,
    FormularioCadastroAlunoComponent,
  ],
  imports: [...ANGULAR_MODULES, CoreModule, SharedModule],

  providers: [],

  bootstrap: [AppComponent],
})
export class AppModule {}
