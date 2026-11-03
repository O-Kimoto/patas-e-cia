import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

// Dados que o back grava dentro do token (ver gerarToken no authController) - [Otávio Michels]
export interface UsuarioLogado {
  id: number;
  username: string;
  nome?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private apiUrl = environment.baseUrl + '/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Faz login na API e guarda o token no localStorage - [Otávio Michels]
  async login(credentials: LoginCredentials): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
    );

    if (!response || !response.token) {
      throw new Error('Token inválido recebido do servidor');
    }
    this.setToken(response.token);
    return response.token;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Sai do sistema: apaga o token e volta para o login - [Otávio Michels]
  logout(): void {
    this.removeToken();
    this.router.navigate(['/auth/login']);
  }

  // Lê nome e id do usuário direto do token, sem precisar chamar a API - [Otávio Michels]
  getUsuario(): UsuarioLogado | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<UsuarioLogado>(token);
    } catch {
      return null;
    }
  }

  // Autenticado = existe token e ele ainda não venceu - [Otávio Michels]
  isAuthenticated(): boolean {
    const usuario = this.getUsuario();
    if (usuario && usuario.exp && usuario.exp > Date.now() / 1000) {
      return true;
    }
    this.removeToken();
    return false;
  }
}
