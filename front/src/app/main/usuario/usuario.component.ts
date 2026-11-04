import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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

    usuario: Usuario = {};
    confirmacao = '';
    usuarioDialog = false;
    submitted = false;
    salvando = false;

    constructor(
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
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

    abrirNovo() {
        this.usuario = {};
        this.confirmacao = '';
        this.submitted = false;
        this.usuarioDialog = true;
    }

    // Na edição a senha começa vazia: só troca se alguém digitar uma nova - [Gabriel França]
    editar(usuario: Usuario) {
        this.usuario = { id: usuario.id, nome: usuario.nome, username: usuario.username, password: '' };
        this.confirmacao = '';
        this.submitted = false;
        this.usuarioDialog = true;
    }

    // Mesmas regras da API, para avisar antes de enviar - [Gabriel França]
    get loginInvalido(): boolean {
        return !/^[A-Za-z0-9._-]{3,30}$/.test((this.usuario.username || '').trim());
    }

    get senhaInvalida(): boolean {
        const senha = this.usuario.password || '';
        if (!this.usuario.id && !senha) return true;
        return senha.length > 0 && senha.length < 6;
    }

    get confirmacaoDiferente(): boolean {
        return (this.usuario.password || '') !== this.confirmacao;
    }

    async salvar() {
        this.submitted = true;
        const u = this.usuario;
        if (!u.nome?.trim() || this.loginInvalido || this.senhaInvalida || this.confirmacaoDiferente) return;

        const dados: Usuario = { id: u.id, nome: u.nome.trim(), username: u.username!.trim() };
        if (u.password) dados.password = u.password;

        this.salvando = true;
        try {
            await this.usuarioService.salvar(dados);
            let detalhe = u.id ? 'Usuário atualizado' : 'Usuário cadastrado';
            if (u.id && u.password) detalhe = 'Usuário e senha atualizados';
            // O nome no topo vem do token, então só muda no próximo login - [Gabriel França]
            if (this.souEu(u)) detalhe += '. O nome no topo muda no próximo login';
            this.messageService.add({ severity: 'success', summary: 'Pronto', detail: detalhe });
            this.usuarioDialog = false;
            await this.carregar();
        } catch (err) {
            this.erro(err);
        } finally {
            this.salvando = false;
        }
    }

    // A API não deixa excluir a si mesmo nem o último usuário; aqui o botão já fica desligado para você mesmo - [Gabriel França]
    excluir(usuario: Usuario) {
        this.confirmationService.confirm({
            header: 'Excluir usuário',
            icon: 'pi pi-exclamation-triangle',
            message: `Excluir o usuário <b>${usuario.username}</b>? Ele não vai conseguir mais entrar no sistema.`,
            accept: async () => {
                try {
                    await this.usuarioService.excluir(usuario.id!);
                    this.messageService.add({ severity: 'success', summary: 'Pronto', detail: 'Usuário excluído' });
                    await this.carregar();
                } catch (err) {
                    this.erro(err);
                }
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    private erro(err: any) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: mensagemDeErro(err), life: 6000 });
    }
}
