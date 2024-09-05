import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { FormularioCadastroAlunoComponent } from './modules/aluno/formulario-cadastro-aluno/formulario-cadastro-aluno.component';
import { ListaSolicitacoesAlunoComponent } from './modules/aluno/solicitacoes-aluno/lista-solicitacoes-aluno/lista-solicitacoes-aluno.component';
import { SolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/solicitacao/solicitacao.component';
import { TelaSolicitacaoComponent } from './modules/aluno/solicitacoes-aluno/tela-solicitacao/tela-solicitacao.component';
import { AnaliseDocsComponent } from './modules/servidor/detalhes-solicitacao-estagio/analise-docs/analise-docs.component';
import { ListaSolicitacoesServidorComponent } from './modules/servidor/Listas/solicitacao-estagios-lista/tipos/lista-solicitacoes-servidor/estagios/lista-solicitacoes-servidor.component';
import { FormularioServidorComponent } from './modules/servidor/formulario-servidor/formulario-servidor.component';
import { MuralDeVagasComponent } from './modules/vagas-estagio/mural-de-vagas/mural-de-vagas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaServidorComponent} from './modules/servidor/lista-servidor/lista-servidor.component';
import { ListaEstagiariosComponent } from './modules/servidor/lista-estagiarios/lista-estagiarios.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { RecuperarSenhaComponent } from './modules/recuperar-senha/recuperar-senha.component';
import { GerenciarCursosComponent } from './modules/servidor/gerenciar-cursos/gerenciar-cursos.component';  
import { MenuServidoresComponent } from './modules/servidor/Listas/solicitacao-estagios-lista/menu-servidores/menu-servidores.component';
import { SolicitacaoEstagiosListaComponent } from './modules/servidor/Listas/solicitacao-estagios-lista/solicitacao-estagios-lista.component';
import { ListaAlunosComponent } from './modules/servidor/lista-alunos/lista-alunos.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/:id',
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
    path: 'lista/solicitacaoEstagiosLista',
    component: SolicitacaoEstagiosListaComponent,
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
    path: 'devOnly',
    component: MenuServidoresComponent,
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
    path: 'listaAlunos',
    component: ListaAlunosComponent,
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
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gerenciarCursos',
    component: GerenciarCursosComponent,
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
