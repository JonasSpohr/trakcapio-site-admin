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
    pkgId: any = 0;

    constructor(r: Router, activatedRoute: ActivatedRoute, service: HomeService) {
        this.service = service;
        this.route = r;
        this.activatedRoute = activatedRoute;
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                let id = params['id'];
                this.pkgId = id;
                this.loadDetailPackage(id);
            }
        });
    }

    cancel(): void {
        this.route.navigate(['/home']);
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

                        let address = pkg.address;
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
        if (confirm('Ao iniciar a rota de entrega o cliente será informado que você está a caminho! Você confirma o início da rota de entrega?')) {
            this.loading = true;
            this.service.postBeginRoute(this.pkgId)
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            alert('Cliente informado com sucesso.')
                            this.deliveryStatus = 'STARTED';
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
    }

    delivered(): void {
        if (confirm('Você confirma a entrega do pacote?')) {
            this.loading = true;
            this.service.postDeliveredSuccessfully(this.pkgId)
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            alert('Cliente informado da entrega realizada.')
                            this.deliveryStatus = 'DONE';
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
    }

    failed(): void {
        if (confirm('Você confirma que não foi possível realizar a entrega do pacote?')) {
            this.loading = true;
            this.service.postDeliveredSuccessfully(this.pkgId)
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            alert('Cliente informado da entrega não realizada.')
                            this.deliveryStatus = 'DONE';
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
    }

}
