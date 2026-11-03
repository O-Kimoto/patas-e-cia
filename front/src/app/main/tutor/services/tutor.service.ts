import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { Tutor } from '../models/tutor';

// CRUD de tutores em /api/tutores - [Otávio Michels]
@Injectable({ providedIn: 'root' })
export class TutorService extends CrudService<Tutor> {
    protected recurso = 'tutores';
    protected chaveLista = 'tutores';
    protected chaveItem = 'tutor';
}
