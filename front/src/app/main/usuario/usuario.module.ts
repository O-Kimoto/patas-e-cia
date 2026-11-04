import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UsuarioComponent } from './usuario.component';

// Tela de usuários do sistema em /usuarios - [Otávio Michels]
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{ path: '', component: UsuarioComponent }])
    ],
    declarations: [UsuarioComponent]
})
export class UsuarioModule { }
