import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AnaliseDocsComponent } from './analise-docs/analise-docs.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { FormularioCadastroAlunoComponent } from './formulario-cadastro-aluno/formulario-cadastro-aluno.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'analisedocs',
    component: AnaliseDocsComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'cadastrarAluno',
    component: FormularioCadastroAlunoComponent,
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
