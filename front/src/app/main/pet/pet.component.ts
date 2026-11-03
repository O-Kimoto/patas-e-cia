import { Component, OnInit } from '@angular/core';
import { Pet } from './models/pet';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PetService } from './services/pet.service';

@Component({
    templateUrl: './pet.component.html',
    providers: [MessageService]
})
export class PetComponent implements OnInit {

    petDialog: boolean = false;

    deletePetDialog: boolean = false;

    deletePetsDialog: boolean = false;

    pets: Pet[] = [];

    pet: Pet = {};

    tutors: any[] = [
        { name: 'Maria Silva', code: 1 },
        { name: 'João Souza', code: 2 },
    ];
    selectedPets: Pet[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private petService: PetService, private messageService: MessageService) { }

    ngOnInit() {

        this.getPets();

        this.cols = [
            { field: 'pet', header: 'Pet' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    getPets() {
        this.petService.getPets().then(data => {
            console.log("no compoente", data)
            this.pets = data
        });
    }

    openNew() {
        this.pet = {};
        this.submitted = false;
        this.petDialog = true;
    }

    deleteSelectedPets() {
        this.deletePetsDialog = true;
    }

    editPet(pet: Pet) {
        this.pet = { ...pet };
        this.petDialog = true;
    }

    deletePet(pet: Pet) {
        this.deletePetDialog = true;
        this.pet = { ...pet };
    }

    confirmDeleteSelected() {
        this.deletePetsDialog = false;
        this.pets = this.pets.filter(val => !this.selectedPets.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pets Deleted', life: 3000 });
        this.selectedPets = [];
    }

    confirmDelete() {
        this.deletePetDialog = false;
        this.pets = this.pets.filter(val => val.id !== this.pet.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pet Deleted', life: 3000 });
        this.pet = {};
    }

    hideDialog() {
        this.petDialog = false;
        this.submitted = false;
    }

    savePet() {
        this.submitted = true;
        console.log("salvando pet", this.pet);

        if (this.pet.name?.trim()) {
            if (this.pet.id) {
                // @ts-ignore
                // this.pets[this.findIndexById(this.pet.id)] = this.pet;
                this.petService.updatePet(this.pet);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pet Updated', life: 3000 });
            } else {
                // @ts-ignore
                this.pet.idTutor = this.pet.id_tutor['code'];
                this.petService.savePet(this.pet);
                this.getPets();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pet Created', life: 3000 });
            }

            this.pets = [...this.pets];
            this.petDialog = false;
            this.pet = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.pets.length; i++) {
            if (this.pets[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
