import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servidor } from '../shared/interfaces/servidor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormularioServidorService {
  private readonly urlAPI =
    'http://localhost:8088/assinaturaapi/cadastroServidor';

  constructor(private http: HttpClient) {}

  enviarDados(aluno: Servidor): Observable<Servidor> {
    return this.http.post<Servidor>(this.urlAPI, aluno);
  }
}
