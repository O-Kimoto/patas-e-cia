import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Servico } from './models/servico';
import { ServicoService } from './services/servico.service';
import { mensagemDeErro } from '../shared/crud.service';

@Component({
    templateUrl: './servico.component.html'
})
export class ServicoComponent implements OnInit {

    servicos: Servico[] = [];
    servico: Servico = {};
    carregando = false;

    servicoDialog = false;
    submitted = false;
    salvando = false;

    colunasCsv = [
        { field: 'nome', header: 'Serviço' },
        { field: 'descricao', header: 'Descrição' },
        { field: 'preco', header: 'Preço' }
    ];

    constructor(
        private servicoService: ServicoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.carregar();
    }

    // Tabela de preços: todos os serviços em ordem de nome, como a API devolve - [Otávio Michels]
    async carregar() {
        this.carregando = true;
        try {
            this.servicos = await this.servicoService.listar();
        } catch (err) {
            this.erro(err);
        } finally {
            this.carregando = false;
        }
    }

    abrirNovo() {
        this.servico = {};
        this.submitted = false;
        this.servicoDialog = true;
    }

    editar(servico: Servico) {
        this.servico = { ...servico };
        this.submitted = false;
        this.servicoDialog = true;
    }

    // Nome e preço são obrigatórios; preço zero vale (ex.: avaliação gratuita) - [Gabriel França]
    get precoFaltando(): boolean {
        return this.servico.preco === null || this.servico.preco === undefined;
    }

    // Salva e mostra o aviso da API quando o nome já existe ou o preço é inválido - [Gabriel França]
    async salvar() {
        this.submitted = true;
        const s = this.servico;
        if (!s.nome?.trim() || this.precoFaltando) return;

        this.salvando = true;
        try {
            const novo = !s.id;
            await this.servicoService.salvar({ ...s, nome: s.nome.trim() });
            this.messageService.add({ severity: 'success', summary: 'Pronto', detail: novo ? 'Serviço cadastrado' : 'Serviço atualizado' });
            this.servicoDialog = false;
            await this.carregar();
        } catch (err) {
            this.erro(err);
        } finally {
            this.salvando = false;
        }
    }

    // Serviço que já está em agendamentos não sai: a API responde 409 e a mensagem dela aparece - [Gabriel França]
    excluir(servico: Servico) {
        this.confirmationService.confirm({
            header: 'Excluir serviço',
            icon: 'pi pi-exclamation-triangle',
            message: `Excluir o serviço <b>${servico.nome}</b>?`,
            accept: async () => {
                try {
                    await this.servicoService.excluir(servico.id!);
                    this.messageService.add({ severity: 'success', summary: 'Pronto', detail: 'Serviço excluído' });
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
