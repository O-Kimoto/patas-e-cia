import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

// Base dos services de CRUD: cada entidade só informa a rota e os nomes das chaves do JSON da API - [Otávio Michels]
// Ex.: GET /api/tutores devolve { tutores: [...] } e GET /api/tutores/1 devolve { tutor: {...} }
@Injectable()
export abstract class CrudService<T extends { id?: number }> {
    protected abstract recurso: string;
    protected abstract chaveLista: string;
    protected abstract chaveItem: string;

    constructor(protected http: HttpClient) { }

    protected get url(): string {
        return `${environment.baseUrl}/${this.recurso}`;
    }

    // GET /recurso com filtros opcionais na query string - [Otávio Michels]
    listar(filtros: Record<string, string | number> = {}): Promise<T[]> {
        let params = new HttpParams();
        Object.entries(filtros).forEach(([k, v]) => {
            if (v !== null && v !== undefined && v !== '') params = params.set(k, String(v));
        });
        return firstValueFrom(this.http.get<any>(this.url, { params })).then(res => res[this.chaveLista] as T[]);
    }

    buscar(id: number): Promise<T> {
        return firstValueFrom(this.http.get<any>(`${this.url}/${id}`)).then(res => res[this.chaveItem] as T);
    }

    criar(item: T): Promise<T> {
        return firstValueFrom(this.http.post<any>(this.url, item)).then(res => res[this.chaveItem] as T);
    }

    atualizar(item: T): Promise<T> {
        return firstValueFrom(this.http.put<any>(`${this.url}/${item.id}`, item)).then(res => res[this.chaveItem] as T);
    }

    excluir(id: number): Promise<void> {
        return firstValueFrom(this.http.delete<any>(`${this.url}/${id}`)).then(() => undefined);
    }

    // Salva decidindo entre criar (sem id) e atualizar (com id) - [Otávio Michels]
    salvar(item: T): Promise<T> {
        return item.id ? this.atualizar(item) : this.criar(item);
    }
}

// Extrai a mensagem de erro que a API manda em { message } - [Otávio Michels]
export function mensagemDeErro(err: any): string {
    if (err?.status === 0) return 'Não foi possível falar com o servidor. Verifique se a API está rodando.';
    return err?.error?.message || err?.message || 'Erro inesperado';
}
