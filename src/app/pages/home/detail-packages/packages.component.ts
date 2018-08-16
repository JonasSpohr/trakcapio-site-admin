import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../services/home.service';

@Component({
    selector: 'app-packages-home',
    templateUrl: './packages.component.html',
    providers: [HomeService]
})

export class PackagesComponent implements OnInit {

    public loading: boolean = false;
    user: any = JSON.parse(localStorage.getItem('traclapioUser'));
    service: HomeService;
    package: any = {};
    route: Router;
    activatedRoute: ActivatedRoute;
    deliveryStatus: string = 'PENDING';

    constructor(r: Router, activatedRoute: ActivatedRoute, service: HomeService) {
        this.service = service;
        this.route = r;
        this.activatedRoute = activatedRoute;
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                let id = params['id'];
                this.loadDetailPackage(id);
            }
        });
    }

    loadDetailPackage(id: any): void {
        this.loading = true;
        this.service.getPackageDetail(id)
            .subscribe(
                (response: any) => {
                    if (response.success) {
                        let pkg = response.result;

                        let isPending = pkg.statusHistory.filter((f: any) => {
                            return f.status == 'CONFIRMADO' || f.status == 'CANCELADO';
                        }).length == 0;

                        let isCanceled = pkg.statusHistory.filter((f: any) => {
                            return f.status == 'CANCELADO';
                        }).length > 0;

                        let isConfirmed = pkg.statusHistory.filter((f: any) => {
                            return f.status == 'CONFIRMADO';
                        }).length > 0;


                        if (isConfirmed) {
                            this.package.status = 'Confirmado'
                        }
                        if (isCanceled) {
                            this.package.status = 'Cancelado'
                        }
                        if (isPending) {
                            this.package.status = 'Não respondeu'
                        }

                        if (!pkg.deliveryStatus) {
                            this.deliveryStatus = 'PENDING';
                        } else {
                            this.deliveryStatus = pkg.deliveryStatus;
                        }

                        this.package.clientName = pkg.client.name;
                        this.package.clientPhone = pkg.client.phone.replace('+55', '');

                        let address = pkg.client.address[0];
                        let number = address.number;
                        while (number.lastIndexOf('_') != -1) {
                            number = number.replace('_', '');
                        }
                        let complement = address.complement == undefined ? '' : '(' + address.complement + ')';
                        this.package.clientAddress = `${address.street} Nº ${number} ${complement}, ${address.city} (${address.state}) - CEP: ${address.zipCode}`

                    } else {
                        alert(response.errorMessage);
                    }

                    this.loading = false;
                },
                error => {
                    console.log("Error :: " + error);
                    this.loading = false;
                });
    }

    beginRoute(): void {
        if(confirm('Ao iniciar a rota de entrega o cliente será informado que você está a caminho! Você confirma o início da rota de entrega?')){

        }
    }

}
