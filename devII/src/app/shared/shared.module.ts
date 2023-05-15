import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatStepperModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  imports: [CommonModule, ...MATERIAL_MODULES], 
  exports: [...MATERIAL_MODULES]
})
export class SharedModule { }
