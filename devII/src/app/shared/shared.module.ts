import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PermissionDirective } from './directives/permission/permission.directive';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatStepperModule,
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
];

const DIRECTIVES = [PermissionDirective];

@NgModule({
  imports: [CommonModule, ...MATERIAL_MODULES],
  exports: [...MATERIAL_MODULES, ...DIRECTIVES],
  declarations: [...DIRECTIVES],
})
export class SharedModule {}
