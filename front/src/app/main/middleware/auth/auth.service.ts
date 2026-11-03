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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private apiUrl = environment.baseUrl + '/auth'; // ajuste para a URL do seu backend

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkToken(); // Verifica se há um token válido e conecta o WebSocket após refresh
  }

  // Método de login
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      // Make sure the endpoint matches your backend API
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      );

      // Make sure the token is valid before saving it
      if (response && response.token) {
        await this.setToken(response.token);

        return response.token;
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Salvar o token no localStorage
  async setToken(token: string): Promise<void> {
    if (!token) {
      console.error('Attempting to set empty token');
      return;
    }
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Método de logout
  logout(): void {
    // Desconectar o WebSocket ao deslogar
    console.log('Desconectando WebSocket ao fazer logout...');

    // Remover o token
    this.removeToken();
    this.router.navigate(['/auth/login']);
    window.location.reload();
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      // Safe token validation
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if token has exp claim and is not expired
      if (decodedToken && decodedToken.exp && decodedToken.exp > currentTime) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      this.removeToken(); // Clear invalid token
      return false;
    }
  }

  // Checar se o token é válido ao iniciar o serviço
  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const expirationDate = new Date(decodedToken.exp * 1000);

        if (expirationDate < new Date()) {
          this.logout();
        } else {
          // Conectar ao WebSocket se o token for válido
          console.log('Reconectando WebSocket após refresh, token válido...');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        this.logout();
      }
    }
  }

}



