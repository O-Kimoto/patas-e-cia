import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AgendamentoComponent } from './agendamento.component';

// Tela de agendamentos em /agendamentos - [Otávio Michels]
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{ path: '', component: AgendamentoComponent }])
    ],
    declarations: [AgendamentoComponent]
})
export class AgendamentoModule { }
