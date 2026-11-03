import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pet } from '../models/pet';
import {environment} from '../../../../environments/environment'

@Injectable()
export class PetService {
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    });

    urlApi = environment.baseUrl+"/pets"

    getPets() {
        return this.http.get<any>(this.urlApi, {headers: this.headers})
            .toPromise()
            .then(res => {
                console.log("Pers service", res)
                return res.pets as Pet[]
            })
    }


    getPetById(id: number) {
        return this.http.get<any>(`${this.urlApi}/${id}`, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.pet as Pet
            })
    }

    savePet(pet: Pet) {
        return this.http.post<any>(this.urlApi, pet, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.pet as Pet
            })
    }   

    deletePet(id: number) {
        return this.http.delete<any>(`${this.urlApi}/${id}`, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.success as boolean
            })
    }

    updatePet(pet: Pet) {
        return this.http.put<any>(`${this.urlApi}/${pet.id}`, pet, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.pet as Pet
            })
    }   
}
