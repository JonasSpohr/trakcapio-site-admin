import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../../../services/schedules.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Select2OptionData } from 'ng2-select2';

@Component({
    selector: 'route-detail',
    templateUrl: './detail.component.html',
    providers: [SchedulesService]
})

export class RouteDetailComponent implements OnInit {

    public loading = false;
    router: Router;
    route: ActivatedRoute;
    service: SchedulesService;
    employees: any = [];
    viewModel: any = {
        packages: []
    };

    lastOrder: any = 1;

    package: any = {
        address: {}
    };

    options: any = {
        dropdownAutoWidth: true,
        width: '100%',
        containerCssClass: 'select2-selection--alt',
        dropdownCssClass: 'select2-dropdown--alt'
    };

    maskDate: any = [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    maskTime: any = [/[1-9]/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];
    maskNumber: any = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    maskDateTime: any = [/[1-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];
    maskCEP: any = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
    maskCPF: any = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    maskCreditCard: any = [/[1-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' '];
    maskPhone: any = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    maskPhoneOdd: any = [/[1-9]/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
    maskPhoneUS: any = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    maskMoney: any = ['$', /[1-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, ',', /\d/, /\d/];
    maskIP: any = [/[1-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/];
    maskPercentage: any = [/[1-9]/, /\d/, '.', /\d/, /\d/, '%'];

    constructor(rr: Router, r: ActivatedRoute, schedulesService: SchedulesService) {
        this.service = schedulesService;
        this.route = r;
        this.router = rr;
    }

    ngOnInit() {
        this.loadEmployeeList();
    }

    loadEmployeeList(): void {
        this.loading = true;
        this.service.getListEmployees('5b48be0402eebd0014cef631')
            .subscribe(
            (response: any) => {
                if (response.success) {
                    this.employees = response.result.map((item: any) => {
                        return <Select2OptionData>{
                            id: item._id,
                            text: item.name
                        }
                    });
                } else {
                    alert(response.errorMessage);
                }

                this.loading = false;
            },
            error => {
                this.loading = false;
            })
    }

    addNewPkg(modal : any) : void {
        if (!this.viewModel.employee || this.viewModel.employee == '') {
            alert('O funcionário responsável (motorista) pela entrega deve ser informado.');
            return;
        }

        if (!this.viewModel.dateSchedule || this.viewModel.dateSchedule == '') {
            alert('A data prevista de entrega deve ser informada.');
            return;
        }

        modal.show();
    }

    appendPackage(closeModalEvent : any): void {
        if (!this.package.clientName || this.package.clientName == '') {
            alert('O nome do cliente deve ser informado.');
            return;
        }
        if (!this.package.clientPhone || this.package.clientPhone == '') {
            alert('O telefone do cliente deve ser informado.');
            return;
        }
        if (!this.package.content || this.package.content == '') {
            alert('O conteudo do pacote deve ser informado.');
            return;
        }
        if (!this.package.address.zipCode || this.package.address.zipCode == '') {
            alert('O CEP do endereço deve ser informado.');
            return;
        }
        if (!this.package.address.street || this.package.address.street == '') {
            alert('O logradouro do endereço deve ser informado.');
            return;
        }
        if (!this.package.address.number || this.package.address.number == '') {
            alert('O número do endereço deve ser informado.');
            return;
        }
        if (!this.package.address.district || this.package.address.district == '') {
            alert('O bairro do endereço deve ser informado.');
            return;
        }
        if (!this.package.address.city || this.package.address.city == '') {
            alert('A cidade do endereço deve ser informada.');
            return;
        }
        if (!this.package.address.state || this.package.address.state == '') {
            alert('O estado do endereço deve ser informado.');
            return;
        }

        let newPkg = {
            client: {
                name: this.package.clientName,
                phone: '+55' + this.package.clientPhone,
                socialNumber: this.package.clientSocialNumber,
                address: [this.package.address],
            },
            address: this.package.address,
            name: this.package.content,
            estimatedDate: this.viewModel.dateSchedule,
            order: this.lastOrder,
        };

        this.lastOrder += 1;
        this.viewModel.packages.push(newPkg);
        this.package = {
            address: {}
        };

        //if all goes well, we can close de modal.
        closeModalEvent.hide();
    }

    checkCep(): void {
        if (this.package.address.zipCode && this.package.address.zipCode != '') {
            this.loading = true;
            let oldZipCode = this.package.address.zipCode;
            this.service.getCEP(this.package.address.zipCode)
                .subscribe(
                (response: any) => {
                    if (response.cep) {
                        this.package.address.zipCode = response.cep;
                        this.package.address.street = response.logradouro;
                        this.package.address.district = response.bairro;
                        this.package.address.city = response.localidade;
                        this.package.address.state = response.uf;
                    } else {
                        this.package.address = {};
                        this.package.address.zipCode = oldZipCode;
                    }

                    this.loading = false;
                },
                error => {
                    console.log("Error :: " + error);
                    this.package.address = {};
                    this.package.address.zipCode = oldZipCode;
                    this.loading = false;
                })
        }
    }

}
