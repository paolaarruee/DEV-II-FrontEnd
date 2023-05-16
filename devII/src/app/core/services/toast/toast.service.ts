import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) { }

  public showMessage(message:string, action: string = 'Fechar'): void {
    this.snackBar.open(message, action, { duration: 1500 })
  }
}
