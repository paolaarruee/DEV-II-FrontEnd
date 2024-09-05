import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Solicitacao } from 'src/app/shared/interfaces/SolicitarEstagio';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUserData() {
    return this.http.get(`${environment.API_URL}/getAluno`);
  }

  getTodosAlunos(): Observable<any>{
    return this.http.get(`${environment.API_URL}/alunos/buscarAlunos`);
  }

  public excluirAluno(email: any): Observable<any> {
    return this.http.post<void>(
      `${environment.API_URL}/excluirServidorEmail`,
      email
    );
  }

  testeUsuario() {
    return this.http.get(`${environment.API_URL}/teste/cadastrarAlunos`);
  }

  enviarSolicitacao(solicitacao: Solicitacao, file: File[]) {
    const formData = new FormData();
    file.forEach(element => {
      formData.append('file', element)
    });
    formData.append('dados', new Blob([JSON.stringify(solicitacao)],{ type: 'application/json' }));


  return this.http.post<any>(`${environment.API_URL}/cadastrarSolicitacao`, formData);

  }

}
