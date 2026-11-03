import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { Servico } from '../models/servico';

// CRUD de serviços em /api/servicos - [Otávio Michels]
@Injectable({ providedIn: 'root' })
export class ServicoService extends CrudService<Servico> {
    protected recurso = 'servicos';
    protected chaveLista = 'servicos';
    protected chaveItem = 'servico';
}
