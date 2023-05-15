import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import { AnaliseDocsComponent } from './analise-docs/analise-docs.component';

const routes: Routes = [
 
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'analisedocs',
    component: AnaliseDocsComponent,

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
