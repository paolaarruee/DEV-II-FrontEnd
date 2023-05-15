import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnaliseDocsComponent } from './analise-docs/analise-docs.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

const ANGULAR_MODULES = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule, 
  HttpClientModule
];

@NgModule({
  declarations: [AppComponent, AnaliseDocsComponent],
  imports: [...ANGULAR_MODULES, CoreModule, SharedModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
