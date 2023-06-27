
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


 

const routes: Routes = [

 

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'listaSolicitacoesServidor',
    component: ListaSolicitacoesServidorComponent,
    
  },
  {

    path: "solicitacaoEstagio",
    component: TelaSolicitacaoComponent,
  },
  {
    path: 'analisedocs',
    component: AnaliseDocsComponent,

    //canActivate: [AuthGuard],
  },

  {
    path: 'cadastrarAluno',
    component: FormularioCadastroAlunoComponent,
  }, 

  {
    path: 'cadastrarServidor',
    component: FormularioServidorComponent,
    //ncanActivate: [AuthGuard],
  },

  {
    path: 'listaSolicitacoesAluno',
    component: ListaSolicitacoesAlunoComponent,
  },

  {
    path: 'solicitacao',
    component: SolicitacaoComponent,
  },

  {
    path: 'muralVagas',
    component: MuralDeVagasComponent,
  },

  {
    path: 'cadastroVagas',
    component: CadastrarVagasComponent,
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
