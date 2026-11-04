import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ServicoComponent } from './servico.component';

// Tela de serviços e preços em /servicos - [Otávio Michels]
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{ path: '', component: ServicoComponent }])
    ],
    declarations: [ServicoComponent]
})
export class ServicoModule { }
