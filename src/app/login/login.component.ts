import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service.'
import { Router } from '@angular/router';

@Component({
    selector: 'app-loign',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    viewModel: any = {};
    service: AuthService;
    public loading: boolean = false;
    router: Router;

    constructor(r: Router, authService: AuthService) {
        this.service = authService;
        this.router = r;
    }

    ngOnInit() {

    }

    login(): void {
        if (!this.viewModel.email || this.viewModel.email == '') {
            alert('Favor informar o email do usuário.');
            return;
        }
        if (!this.viewModel.password || this.viewModel.password == '') {
            alert('Favor informar a senha do usuário.');
            return;
        }

        this.loading = true;

        this.service.login({
            email: this.viewModel.email,
            pwd: this.viewModel.password
        })
            .subscribe(
                (response: any) => {
                    if (response.success) {
                        localStorage.setItem('traclapioUser', JSON.stringify(response.result));
                        this.router.navigate(['home'])
                    } else {
                        alert('Usuário ou senha são inválidos.');
                    }
                    this.loading = false;
                },
                error => {
                    alert('Usuário ou senha são inválidos.');
                    this.loading = false;
                })
    }

}
