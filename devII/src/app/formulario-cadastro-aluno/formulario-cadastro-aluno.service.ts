import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from './aluno';

@Injectable({
  providedIn: 'root'
})
export class FormularioCadastroAlunoService {

  private readonly urlAPI = 'http://localhost:8088/assinaturaapi/cadastrarAluno';

  constructor(private http: HttpClient) { }

  enviarDados(aluno: Aluno): Observable<Aluno>{
    return this.http.post<Aluno>(this.urlAPI, aluno);
  }

}
