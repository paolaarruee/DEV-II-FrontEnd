import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AnaliseDocumentosService {
  public constructor(private httpClient: HttpClient) {}

  public enviarDeferimento(flag: FormData): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.API_URL}/enviarDeferimento`,
      flag
    );
  }

  public enviarIndeferimento(data: FormData): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.API_URL}/enviarIndeferimento`,
      data
    );
  }
}
