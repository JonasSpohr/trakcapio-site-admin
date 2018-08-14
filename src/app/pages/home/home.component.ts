import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    providers: [HomeService]
})

export class HomeComponent implements OnInit {

    public loading: boolean = false;
    user: any = JSON.parse(localStorage.getItem('traclapioUser'));
    service: HomeService;
    todayItems: any = [];
    todayStatusItems: any = [];
    todayStatusCanceledItems: any = [];
    todayStatusConfirmedItems: any = [];
    todayEmployeeItems: any = [];
    route: Router;
    isDriver: boolean = false;

    constructor(r: Router, service: HomeService) {
        this.service = service;
        this.route = r;
    }

    ngOnInit() {
        this.isDriver = this.user.type == 'Motorista';
        if (!this.isDriver) {
            this.loadTodayRoutesData();
        } else {
            this.loadEmployeeTodayRoutesData();
        }
    }

    refresh(): void {
        this.todayItems = [];
        this.todayStatusItems = [];
        this.loadTodayRoutesData();
    }

    loadTodayRoutesData(): void {
        this.loading = true;
        this.service.getTodayList()
            .subscribe(
            (response: any) => {
                if (response.success) {
                    this.todayItems = response.result;

                    for (let i = 0; i < this.todayItems.length; i++) {
                        let item = this.todayItems[i];

                        for (let p = 0; p < item.packages.length; p++) {
                            let itemReturn: any = {};
                            let pkg = item.packages[p];

                            let isPeding = pkg.statusHistory.filter((f: any) => {
                                return f.status == 'CONFIRMADO' || f.status == 'CANCELADO';
                            }).length == 0;

                            let isCanceled = pkg.statusHistory.filter((f: any) => {
                                return f.status == 'CANCELADO';
                            }).length > 0;

                            let isConfirmed = pkg.statusHistory.filter((f: any) => {
                                return f.status == 'CONFIRMADO';
                            }).length > 0;

                            itemReturn.employeeName = item.employee[0].name + ' (' + item.employee[0].phone.replace('+55', '') + ')';
                            itemReturn.clientName = pkg.client.name;
                            itemReturn.clientPhone = pkg.client.phone.replace('+55', '');

                            let address = pkg.client.address[0];
                            let complement = address.complement == undefined ? '' : '(' + address.complement + ')';
                            itemReturn.clientAddress = `${address.street} Nº ${address.number} ${complement}, ${address.city} (${address.state}) - CEP: ${address.zipCode}`

                            if (isPeding) {
                                this.todayStatusItems.push(itemReturn);
                            }
                            else if (isCanceled) {
                                this.todayStatusCanceledItems.push(itemReturn);
                            }
                            else if (isConfirmed) {
                                this.todayStatusConfirmedItems.push(itemReturn);
                            }
                        }
                    }

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

    loadEmployeeTodayRoutesData(): void {
        this.loading = true;
        this.service.getEmployeeTodayList()
            .subscribe(
            (response: any) => {
                if (response.success) {
                    this.todayItems = response.result;

                    for (let i = 0; i < this.todayItems.length; i++) {
                        let item = this.todayItems[i];

                        for (let p = 0; p < item.packages.length; p++) {
                            let itemReturn: any = {};
                            let pkg = item.packages[p];

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
                                itemReturn.status = 'Confirmado'
                            }
                            if (isCanceled) {
                                itemReturn.status = 'Cancelado'
                            }
                            if (isPending) {
                                itemReturn.status = 'Não respondeu'
                            }

                            itemReturn.order = pkg.order;
                            itemReturn.clientName = pkg.client.name;
                            itemReturn.clientPhone = pkg.client.phone.replace('+55', '');

                            let address = pkg.client.address[0];
                            let complement = address.complement == undefined ? '' : '(' + address.complement + ')';
                            itemReturn.clientAddress = `${address.street} Nº ${address.number} ${complement}, ${address.city} (${address.state}) - CEP: ${address.zipCode}`

                            this.todayEmployeeItems.push(itemReturn);
                        }
                    }

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

    view(id: string): void {
        this.route.navigate(['/routes/detail/' + id]);
    }

}
