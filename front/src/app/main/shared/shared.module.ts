import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

// Módulos do PrimeNG usados em todas as telas de CRUD, importados de uma vez só - [Otávio Michels]
const MODULOS = [
    CommonModule, FormsModule, TableModule, ButtonModule, RippleModule, ToastModule, ToolbarModule,
    InputTextModule, InputTextareaModule, InputNumberModule, InputMaskModule, DropdownModule,
    SelectButtonModule, CalendarModule, DialogModule, ConfirmDialogModule, TagModule, TooltipModule
];

@NgModule({
    imports: MODULOS,
    exports: MODULOS
})
export class SharedModule { }
