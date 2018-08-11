import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'employee-detail',
    templateUrl: './detail.component.html',
    providers: [EmployeeService]
})

export class EmployeeDetailComponent implements OnInit {

    router: Router;
    route: ActivatedRoute;
    public loading = false;
    service: EmployeeService;
    viewModel: any = {
        address: {}
    };

    maskDate: any = [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    maskTime: any = [/[1-9]/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];
    maskNumber: any = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
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

    constructor(rr : Router, r: ActivatedRoute, employeeService: EmployeeService) {
        this.service = employeeService;
        this.route = r;
        this.router = rr;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.viewModel._id = params['id'];
                this.loadDetail();
            }
        });
    }

    checkCep(): void {
        if (this.viewModel.address.zipCode && this.viewModel.address.zipCode != '') {
            this.loading = true;
            let oldZipCode = this.viewModel.address.zipCode;
            this.service.getCEP(this.viewModel.address.zipCode)
                .subscribe(
                (response: any) => {
                    if (response.cep) {
                        this.viewModel.address.zipCode = response.cep;
                        this.viewModel.address.street = response.logradouro;
                        this.viewModel.address.district = response.bairro;
                        this.viewModel.address.city = response.localidade;
                        this.viewModel.address.state = response.uf;
                    } else {
                        this.viewModel.address = {};
                        this.viewModel.address.zipCode = oldZipCode;
                    }

                    this.loading = false;
                },
                error => {
                    console.log("Error :: " + error);
                    this.viewModel.address = {};
                    this.viewModel.address.zipCode = oldZipCode;
                    this.loading = false;
                })
        }
    }

    cancel(): void {
        this.router.navigate(["/employees"])
    }

    loadDetail(): void {
        if(this.viewModel._id == "0"){
            return;
        }
        
        this.loading = true;
        this.service.getDetail(this.viewModel._id)
            .subscribe(
            (response: any) => {
                if (response.success) {
                    this.viewModel = response.result;
                } else {
                    alert(response.errorMessage);
                }

                this.loading = false;
            },
            error => {
                console.log("Error :: " + error);
                this.loading = false;
            })
    }

    save(): void {
        if (!this.viewModel.name || this.viewModel.name == '') {
            alert('O nome do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.phone || this.viewModel.phone == '') {
            alert('O telefone CELULAR do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.socialNumber || this.viewModel.socialNumber == '') {
            alert('O número da CPF do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.driverLicenseNumber || this.viewModel.driverLicenseNumber == '') {
            alert('O número da CNH do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.address.zipCode || this.viewModel.address.zipCode == '') {
            alert('O CEP do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.address.street || this.viewModel.address.street == '') {
            alert('O logradouro (endereço) do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.address.number || this.viewModel.address.number == '') {
            alert('O número do endereço do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.address.district || this.viewModel.address.district == '') {
            alert('O bairro do endereço do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.address.city || this.viewModel.address.city == '') {
            alert('A cidade do endereço do funcionário deve ser informado.');
            return;
        }

        if (!this.viewModel.address.state || this.viewModel.address.state == '') {
            alert('A cidade do endereço do funcionário deve ser informado.');
            return;
        }

        this.loading = true;
        if (!this.viewModel._id || this.viewModel._id == "0") {
            delete this.viewModel._id;
            this.service.insert(this.viewModel)
                .subscribe(
                (response: any) => {
                    if (response.success) {
                        this.viewModel._id = response.result._id;
                        alert('Operação efetuada com sucesso.');
                    } else {
                        alert(response.errorMessage);
                    }

                    this.loading = false;
                },
                error => {
                    console.log("Error :: " + error);
                    this.loading = false;
                })
        } else {
            this.service.update(this.viewModel)
                .subscribe(
                (response: any) => {
                    if (response.success) {
                        alert('Operação efetuada com sucesso.');
                    } else {
                        alert(response.errorMessage);
                    }
                    this.loading = false;
                },
                error => {
                    console.log("Error :: " + error);
                    this.loading = false;
                })
        }
    }

}
