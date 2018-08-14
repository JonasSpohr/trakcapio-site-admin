import { Component, OnInit, trigger, state, style, transition, animate} from '@angular/core';
import { SharedService } from "../../shared/services/shared.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    animations: [
        trigger('toggleHeight', [
            state('inactive', style({
                height: '0',
                opacity: '0'
            })),
            state('active', style({
                height: '*',
                opacity: '1'
            })),
            transition('inactive => active', animate('200ms ease-in')),
            transition('active => inactive', animate('200ms ease-out'))
        ])
    ]
})

export class NavigationComponent implements OnInit {
    sidebarVisible: boolean;
    isDriver : boolean = false;
    isAdministrator : boolean = false;

    // Sub menu visibilities
    navigationSubState:any = {
        Tables: 'inactive',
        Forms: 'inactive',
        SamplePages: 'inactive',
        UserInterface: 'inactive',
        Components: 'inactive',
        Charts: 'inactive',
    };

    user : any  = JSON.parse(localStorage.getItem('traclapioUser'));
    router: Router;

    // Toggle sub menu
    toggleNavigationSub(menu, event) {
        event.preventDefault();
        this.navigationSubState[menu] = (this.navigationSubState[menu] === 'inactive' ? 'active' : 'inactive');
    }

    constructor(private sharedService: SharedService, r: Router) {
        sharedService.sidebarVisibilitySubject.subscribe((value) => {
            this.sidebarVisible = value
        })
        this.router = r;
    }

    ngOnInit() {
        this.isDriver = this.user.type == 'Motorista';
        this.isAdministrator = this.user.type == 'isAdministrator';
    }

    logoff() : void {
        if(confirm('Você realmente deseja sair do sistema?')) {
            localStorage.removeItem('traclapioUser');
            this.router.navigate(['login']);
        }
    }
}
