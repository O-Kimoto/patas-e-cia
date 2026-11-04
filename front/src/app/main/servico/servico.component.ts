import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Servico } from './models/servico';
import { ServicoService } from './services/servico.service';
import { mensagemDeErro } from '../shared/crud.service';

@Component({
    templateUrl: './servico.component.html'
})
export class ServicoComponent implements OnInit {

    servicos: Servico[] = [];
    carregando = false;

    colunasCsv = [
        { field: 'nome', header: 'Serviço' },
        { field: 'descricao', header: 'Descrição' },
        { field: 'preco', header: 'Preço' }
    ];

    constructor(
        private servicoService: ServicoService,
        private messageService: MessageService
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    private erro(err: any) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: mensagemDeErro(err), life: 6000 });
    }
}
