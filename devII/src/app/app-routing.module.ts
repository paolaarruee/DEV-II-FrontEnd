import { SolicitacaoComponent } from './lista-solicitacoes-aluno/solicitacao/solicitacao.component';
import { SolicitacaoServidorComponent } from './lista-solicitacoes-servidor/solicitacao/solicitacao.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AnaliseDocsComponent } from './analise-docs/analise-docs.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { FormularioCadastroAlunoComponent } from './formulario-cadastro-aluno/formulario-cadastro-aluno.component';
import { FormularioServidorComponent } from './formulario-servidor/formulario-servidor.component';
import { ListaSolicitacoesAlunoComponent } from './lista-solicitacoes-aluno/lista-solicitacoes-aluno.component';
import { TelaSolicitacaoComponent } from './tela-solicitacao/tela-solicitacao.component';
import { ListaSolicitacoesServidorComponent } from './lista-solicitacoes-servidor/lista-solicitacoes-servidor.component';

const routes: Routes = [

 

  {
    path: 'login',
    component: LoginComponent,
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
    path: '**',
    redirectTo: 'analisedocs',
  },


  {
    path: 'listaServ',
    component: ListaSolicitacoesServidorComponent,
    
  },
 


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
