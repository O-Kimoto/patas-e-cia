import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService, UsuarioLogado } from '../main/middleware/auth/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    usuario: UsuarioLogado | null;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private authService: AuthService) {
        this.usuario = this.authService.getUsuario();
    }

    // Sai do sistema pelo AuthService (apaga o token e volta ao login) - [Otávio Michels]
    logout() {
        this.authService.logout();
    }
}
