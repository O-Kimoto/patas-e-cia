import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { Agendamento } from '../models/agendamento';

// CRUD de agendamentos em /api/agendamentos (aceita ?status= e ?data=) - [Otávio Michels]
@Injectable({ providedIn: 'root' })
export class AgendamentoService extends CrudService<Agendamento> {
    protected recurso = 'agendamentos';
    protected chaveLista = 'agendamentos';
    protected chaveItem = 'agendamento';
}
