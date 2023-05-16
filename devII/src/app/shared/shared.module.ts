import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatStepperModule,
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule
];

@NgModule({
  imports: [CommonModule, ...MATERIAL_MODULES], 
  exports: [...MATERIAL_MODULES]
})
export class SharedModule { }
