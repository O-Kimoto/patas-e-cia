import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    // Menu lateral do petshop, agrupado por assunto - [Otávio Michels]
    // Nesta parte só Agendamentos funciona; os outros itens ficam no layout, mas ainda sem link
    ngOnInit() {
        this.model = [
            {
                label: 'Início',
                items: [
                    { label: 'Painel', icon: 'pi pi-fw pi-home' }
                ]
            },
            {
                label: 'Atendimento',
                items: [
                    { label: 'Agendamentos', icon: 'pi pi-fw pi-calendar', routerLink: ['/agendamentos'] }
                ]
            },
            {
                label: 'Cadastros',
                items: [
                    { label: 'Tutores', icon: 'pi pi-fw pi-users' },
                    { label: 'Pets', icon: 'pi pi-fw pi-heart' }
                ]
            },
            {
                label: 'Catálogo',
                items: [
                    { label: 'Serviços', icon: 'pi pi-fw pi-star' },
                    { label: 'Produtos', icon: 'pi pi-fw pi-shopping-bag' }
                ]
            },
            {
                label: 'Sistema',
                items: [
                    { label: 'Usuários', icon: 'pi pi-fw pi-user-edit' },
                    { label: 'Documentação da API', icon: 'pi pi-fw pi-book' }
                ]
            }
        ];
    }
}
