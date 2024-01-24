import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/login/login.component';
import { FormularioCadastroAlunoComponent } from './modules/aluno/formulario-cadastro-aluno/formulario-cadastro-aluno.component';
import { ListaSolicitacoesAlunoComponent } from './modules/aluno/solicitacoes-aluno/lista-solicitacoes-aluno/lista-solicitacoes-aluno.component';
import { SolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/solicitacao/solicitacao.component';
import { TelaSolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/tela-solicitacao/tela-solicitacao.component';
import { AnaliseDocsComponent } from './modules/servidor/detalhes-solicitacao-estagio/analise-docs/analise-docs.component';
import { ListaSolicitacoesServidorComponent } from './modules/servidor/detalhes-solicitacao-estagio/lista-solicitacoes-servidor/lista-solicitacoes-servidor.component';
import { FormularioServidorComponent } from './modules/servidor/formulario-servidor/formulario-servidor.component';
import { CadastrarVagasComponent } from './modules/vagas-estagio/cadastrar-vagas/cadastrar-vagas.component';
import { MuralDeVagasComponent } from './modules/vagas-estagio/mural-de-vagas/mural-de-vagas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaServidorComponent} from './modules/servidor/lista-servidor/lista-servidor.component';
import { ListaEstagiariosComponent } from './modules/servidor/lista-estagiarios/lista-estagiarios.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { RecuperarSenhaComponent } from './modules/recuperar-senha/recuperar-senha.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'recuperarSenha/:token',
    component: RecuperarSenhaComponent,
  },
  {
    path: 'recuperarSenha',
    component: RecuperarSenhaComponent,
  },
  {
    path:'listaEstagiarios',
    component: ListaEstagiariosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listaSolicitacoesServidor',
    component: ListaSolicitacoesServidorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listaServidores',
    component: ListaServidorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'solicitacaoEstagio',
    component: TelaSolicitacaoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'analisedocs/:id',
    component: AnaliseDocsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cadastrarAluno',
    component: FormularioCadastroAlunoComponent,
  },
  {
    path: 'cadastrarServidor',
    component: FormularioServidorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listaSolicitacoesAluno',
    component: ListaSolicitacoesAlunoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'solicitacao',
    component: SolicitacaoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'muralVagas',
    component: MuralDeVagasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cadastroVagas',
    component: CadastrarVagasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'muralVagas',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
