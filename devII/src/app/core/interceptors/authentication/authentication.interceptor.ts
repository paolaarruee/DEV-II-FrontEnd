import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  public constructor(private authService: AuthenticationService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = this.authService.token;

    if (!token) {
      return next.handle(request);
    }

    const requestWithToken: HttpRequest<unknown> = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(requestWithToken);
  }
}
