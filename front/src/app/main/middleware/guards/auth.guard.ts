import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, UrlTree } from '@angular/router';

// Bloqueia as telas internas para quem não está logado e manda para o login - [Otávio Michels]
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    return this.router.createUrlTree(['/auth/login']);
  }

  // Confere de novo a cada troca de tela interna (o token pode ter vencido no meio do uso) - [Otávio Michels]
  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
