import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthenticationInterceptor } from './interceptors/authentication/authentication.interceptor';

const COMPONENTS = [FooterComponent, HeaderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [...COMPONENTS]
})
export class CoreModule { }
