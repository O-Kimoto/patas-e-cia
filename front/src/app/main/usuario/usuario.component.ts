import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Usuario } from './models/usuario';
import { UsuarioService } from './services/usuario.service';
import { AuthService, UsuarioLogado } from '../middleware/auth/auth.service';
import { mensagemDeErro } from '../shared/crud.service';

@Component({
    templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

    usuarios: Usuario[] = [];
    carregando = false;
    usuarioLogado: UsuarioLogado | null;

    constructor(
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        authService: AuthService
    ) {
        this.usuarioLogado = authService.getUsuario();
    }

    ngOnInit() {
        this.carregar();
    }

    async carregar() {
        this.carregando = true;
        try {
            this.usuarios = await this.usuarioService.listar();
        } catch (err) {
            this.erro(err);
        } finally {
            this.carregando = false;
        }
    }

    // Marca na lista quem está usando o sistema agora - [Otávio Michels]
    souEu(usuario: Usuario): boolean {
        return !!this.usuarioLogado && usuario.id === this.usuarioLogado.id;
    }

    // O SQLite grava criado_em em UTC sem fuso ("2026-10-29 03:00:00"); o Z faz o date pipe mostrar no horário local - [Otávio Michels]
    criadoEm(usuario: Usuario): string | null {
        return usuario.criado_em ? usuario.criado_em.replace(' ', 'T') + 'Z' : null;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    private erro(err: any) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: mensagemDeErro(err), life: 6000 });
    }
}
