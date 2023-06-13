import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AnaliseDocsComponent } from './analise-docs/analise-docs.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { FormularioCadastroAlunoComponent } from './formulario-cadastro-aluno/formulario-cadastro-aluno.component';
import { FormularioServidorComponent } from './formulario-servidor/formulario-servidor.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'analisedocs',
    component: AnaliseDocsComponent,
  },

  {
    path: 'cadastrarAluno',
    component: FormularioCadastroAlunoComponent,
  },

  {
    path: 'cadastrarServidor',
    component: FormularioServidorComponent,
    // canActivate: [AuthGuard],
  },

  {
    path: '**',
    redirectTo: 'analisedocs',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
