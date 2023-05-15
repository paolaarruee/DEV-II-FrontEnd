import { HttpClient } from '@angular/common/http';
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

  public getDocList(): Observable<DocFile[]> {
    return this.httpClient.get<DocFile[]>(`${environment.API_URL}/listarDocumento`)
      .pipe(
        map((docList: Array<any>) => docList.map((doc: any) => ({
          name: doc.name,
          binary: new Blob([doc.code])
        })))
      );
  }

  //descobrir o retorno 
}
