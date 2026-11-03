import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { Pet } from '../models/pet';

// CRUD de pets em /api/pets (aceita filtro ?tutor_id=) - [Otávio Michels]
@Injectable({ providedIn: 'root' })
export class PetService extends CrudService<Pet> {
    protected recurso = 'pets';
    protected chaveLista = 'pets';
    protected chaveItem = 'pet';

    listarDoTutor(tutorId: number): Promise<Pet[]> {
        return this.listar({ tutor_id: tutorId });
    }
}
