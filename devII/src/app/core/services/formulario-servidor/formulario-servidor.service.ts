import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormularioServidorService {
  constructor(private http: HttpClient) {}

  enviarDados(aluno: Servidor): Observable<Servidor> {
    return this.http.post<Servidor>(
      `${environment.API_URL}/cadastrarServidor`,
      aluno
    );
  }
}
