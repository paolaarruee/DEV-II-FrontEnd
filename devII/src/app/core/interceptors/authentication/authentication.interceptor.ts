import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = localStorage.getItem('token');

    if (!token) {
      return next.handle(request);
    }

    const requestWithToken: HttpRequest<unknown> = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(requestWithToken);
  }
}
