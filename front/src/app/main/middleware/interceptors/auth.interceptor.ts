import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    // Coloca o token JWT em toda chamada para a nossa API e trata o token vencido - [Otávio Michels]
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Só manda o token para a nossa API (ViaCEP e IBGE não recebem o token) - [Otávio Michels]
        if (!req.url.startsWith(environment.baseUrl)) {
            return next.handle(req);
        }

        const token = localStorage.getItem('token');
        const request = token ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }) : req;

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                // 401 fora do login = token vencido ou inválido: limpa e volta para a tela de login - [Otávio Michels]
                if (err.status === 401 && !req.url.includes('/auth/login')) {
                    localStorage.removeItem('token');
                    this.router.navigate(['/auth/login'], { queryParams: { expirado: 1 } });
                }
                return throwError(() => err);
            })
        );
    }
}
