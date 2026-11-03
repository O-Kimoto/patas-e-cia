import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Agendamento, StatusAgendamento } from './models/agendamento';
import { AgendamentoService } from './services/agendamento.service';
import { Tutor } from '../tutor/models/tutor';
import { TutorService } from '../tutor/services/tutor.service';
import { Pet } from '../pet/models/pet';
import { PetService } from '../pet/services/pet.service';
import { Servico } from '../servico/models/servico';
import { ServicoService } from '../servico/services/servico.service';
import { mensagemDeErro } from '../shared/crud.service';
import { dataHoraDaApi, dataHoraParaApi, dataParaApi } from '../shared/formatos';

@Component({
    templateUrl: './agendamento.component.html'
})
export class AgendamentoComponent implements OnInit {

    agendamentos: Agendamento[] = [];
    agendamento: Agendamento = {};
    // O calendário trabalha com Date; na hora de salvar vira texto AAAA-MM-DDTHH:MM - [Otávio Michels]
    dataHora: Date | null = null;

    tutores: Tutor[] = [];
    petsDoTutor: Pet[] = [];
    servicos: Servico[] = [];

    agendamentoDialog = false;
    submitted = false;
    carregando = false;
    salvando = false;
    carregandoPets = false;

    filtroStatus: StatusAgendamento | null = null;
    filtroData: Date | null = null;

    statusOpcoes: StatusAgendamento[] = ['Agendado', 'Confirmado', 'Concluído', 'Cancelado'];

    colunasCsv = [
        { field: 'data_hora', header: 'Data/Hora' },
        { field: 'pet_nome', header: 'Pet' },
        { field: 'tutor_nome', header: 'Tutor' },
        { field: 'servico_nome', header: 'Serviço' },
        { field: 'servico_preco', header: 'Valor' },
        { field: 'status', header: 'Status' }
    ];

    constructor(
        private agendamentoService: AgendamentoService,
        private tutorService: TutorService,
        private petService: PetService,
        private servicoService: ServicoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.carregar();
        // Listas dos selects do formulário - [Otávio Michels]
        Promise.all([this.tutorService.listar(), this.servicoService.listar()])
            .then(([tutores, servicos]) => {
                this.tutores = tutores;
                this.servicos = servicos;
            })
            .catch(err => this.erro(err));
    }

    // Lista com os filtros de status e dia aplicados pela API - [Otávio Michels]
    async carregar() {
        this.carregando = true;
        try {
            this.agendamentos = await this.agendamentoService.listar({
                status: this.filtroStatus || '',
                data: this.filtroData ? dataParaApi(this.filtroData) : ''
            });
        } catch (err) {
            this.erro(err);
        } finally {
            this.carregando = false;
        }
    }

    filtrarHoje() {
        this.filtroData = new Date();
        this.carregar();
    }

    limparFiltros() {
        this.filtroStatus = null;
        this.filtroData = null;
        this.carregar();
    }

    abrirNovo() {
        this.agendamento = { status: 'Agendado' };
        // Sugere amanhã às 9h para agilizar o preenchimento - [Otávio Michels]
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(9, 0, 0, 0);
        this.dataHora = amanha;
        this.petsDoTutor = [];
        this.submitted = false;
        this.agendamentoDialog = true;
    }

    async editar(agendamento: Agendamento) {
        this.agendamento = { ...agendamento };
        this.dataHora = dataHoraDaApi(agendamento.data_hora || '');
        this.submitted = false;
        this.agendamentoDialog = true;
        await this.carregarPets(agendamento.tutor_id);
    }

    // Ao trocar o tutor, só os pets dele aparecem e o pet escolhido é limpo - [Otávio Michels]
    async aoMudarTutor() {
        this.agendamento.pet_id = undefined;
        await this.carregarPets(this.agendamento.tutor_id);
        if (this.petsDoTutor.length === 1) {
            this.agendamento.pet_id = this.petsDoTutor[0].id;
        }
    }

    async carregarPets(tutorId?: number) {
        this.petsDoTutor = [];
        if (!tutorId) return;
        this.carregandoPets = true;
        try {
            this.petsDoTutor = await this.petService.listarDoTutor(tutorId);
        } catch (err) {
            this.erro(err);
        } finally {
            this.carregandoPets = false;
        }
    }

    get servicoEscolhido(): Servico | undefined {
        return this.servicos.find(s => s.id === this.agendamento.servico_id);
    }

    async salvar() {
        this.submitted = true;
        const a = this.agendamento;
        if (!a.tutor_id || !a.pet_id || !a.servico_id || !this.dataHora || !a.status) return;

        a.data_hora = dataHoraParaApi(this.dataHora);
        this.salvando = true;
        try {
            const novo = !a.id;
            await this.agendamentoService.salvar(a);
            this.messageService.add({ severity: 'success', summary: 'Pronto', detail: novo ? 'Agendamento criado' : 'Agendamento atualizado' });
            this.agendamentoDialog = false;
            await this.carregar();
        } catch (err) {
            this.erro(err);
        } finally {
            this.salvando = false;
        }
    }

    // Atalho da tabela para mudar o status sem abrir o formulário - [Otávio Michels]
    async mudarStatus(agendamento: Agendamento, status: StatusAgendamento) {
        try {
            await this.agendamentoService.atualizar({ ...agendamento, status });
            this.messageService.add({ severity: 'success', summary: 'Pronto', detail: `Agendamento marcado como ${status}` });
            await this.carregar();
        } catch (err) {
            this.erro(err);
        }
    }

    excluir(agendamento: Agendamento) {
        this.confirmationService.confirm({
            header: 'Excluir agendamento',
            icon: 'pi pi-exclamation-triangle',
            message: `Excluir o agendamento de <b>${agendamento.pet_nome}</b> (${agendamento.servico_nome})?`,
            accept: async () => {
                try {
                    await this.agendamentoService.excluir(agendamento.id!);
                    this.messageService.add({ severity: 'success', summary: 'Pronto', detail: 'Agendamento excluído' });
                    await this.carregar();
                } catch (err) {
                    this.erro(err);
                }
            }
        });
    }

    // Cor da etiqueta de status na tabela - [Otávio Michels]
    severidade(status?: StatusAgendamento): string {
        switch (status) {
            case 'Confirmado': return 'warning';
            case 'Concluído': return 'success';
            case 'Cancelado': return 'danger';
            default: return 'info';
        }
    }

    emAberto(a: Agendamento): boolean {
        return a.status === 'Agendado' || a.status === 'Confirmado';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    private erro(err: any) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: mensagemDeErro(err), life: 6000 });
    }
}
