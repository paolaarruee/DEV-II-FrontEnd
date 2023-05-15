import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DocFile } from 'src/app/shared/interfaces/doc';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  public constructor(private httpClient: HttpClient) { }

  public uploadDocs(files: FormData): Observable<void> {
    return this.httpClient.post<void>(`${environment.API_URL}/salvarDocumento`, files);
  }

  public downloadDoc(id: number): Observable<Blob> {
    return this.httpClient.get<Blob>(`${environment.API_URL}/downloadDocumento?chamadoId=${id}`, { responseType: 'blob' as 'json' });
  }

  public deleteDoc(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.API_URL}/deletarDocumento?chamadoId=${id}`);
  }

  public getDocList(): Observable<DocFile[]> {
    return this.httpClient.get<DocFile[]>(`${environment.API_URL}/listarDocumento`);
  }
}
