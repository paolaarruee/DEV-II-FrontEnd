import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Aluno } from 'src/app/shared/interfaces/aluno';

@Injectable({
  providedIn: 'root',
})
export class FormularioCadastroAlunoService {
  constructor(private http: HttpClient) {}

  enviarDados(aluno: Aluno): Observable<Aluno> {
    return this.http.post<Aluno>(
      `${environment.API_URL}/cadastrarAluno`,
      aluno
    );
  }
}
