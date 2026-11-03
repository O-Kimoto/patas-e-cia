// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      console.log('is authenticated');
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}