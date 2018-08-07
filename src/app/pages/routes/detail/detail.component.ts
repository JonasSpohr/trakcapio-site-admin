import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../../../services/schedules.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Select2OptionData } from 'ng2-select2';
import { confirm } from 'dropzone';

@Component({
    selector: 'route-detail',
    templateUrl: './detail.component.html',
    providers: [SchedulesService]
})

export class RouteDetailComponent implements OnInit {

    public loading = false;
    editing: boolean = false;
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

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.viewModel._id = params['id'];
                this.loadDetail();
            }
        });
    }

    loadDetail(): void {
        if (this.viewModel._id == "0") {
            return;
        }

        this.loading = true;
        this.service.getDetail(this.viewModel._id)
            .subscribe(
            (response: any) => {
                if (response.success) {
                    let model = response.result;
                    this.editing = true;
                    this.viewModel.employee = model.employee[0].socialNumber;
                    this.viewModel.dateSchedule = new Date(model.dateSchedule).toLocaleDateString();
                    this.viewModel.packages = [];

                    for (let p = 0; p < model.packages.length; p++) {
                        let status : string  = 'Pendente de Resposta';

                        let history = model.packages[p].statusHistory;

                        for(let h = 0; h < history.length; h++){
                            if(history[h].status == 'CONFIRMADO'){
                                status = 'Confirmado';
                            }
                            if(history[h].status == 'CANCELADO'){
                                status = 'Cancelado';
                            }
                        }

                        this.viewModel.packages.push({
                            order: model.packages[p].order,
                            status: status,
                            client: {
                                name: model.packages[p].client.name,
                                phone: model.packages[p].client.phone
                            }
                        });
                    }

                    this.viewModel.processed = model.processed ? model.processed : false;

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

    loadEmployeeList(): void {
        this.loading = true;
        this.service.getListEmployees('5b48be0402eebd0014cef631')
            .subscribe(
            (response: any) => {
                if (response.success) {
                    this.employees = response.result.map((item: any) => {
                        return <Select2OptionData>{
                            id: item.socialNumber,
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

    addNewPkg(modal: any): void {
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

    changeOrder(currentIndex: number, nextIndex: number, up: boolean): void {
        let currentValue = this.viewModel.packages[currentIndex];
        currentValue.order = up ? currentValue.order - 1 : currentValue.order + 1;

        let nextValue = this.viewModel.packages[nextIndex];
        nextValue.order = up ? nextValue.order + 1 : nextValue.order - 1;

        this.viewModel.packages[currentIndex] = nextValue;
        this.viewModel.packages[nextIndex] = currentValue;
    }

    appendPackage(closeModalEvent: any): void {
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
                address: this.package.address,
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

    save(processSendSMS: boolean = false): void {
        if (!this.viewModel.employee || this.viewModel.employee == '') {
            alert('Favor selecionar o funcionário responsável por realizar a entrega.');
            return;
        }
        if (!this.viewModel.dateSchedule || this.viewModel.dateSchedule == '') {
            alert('Favor informa a data prevista para a realização da entrega.');
            return;
        }
        if (!this.viewModel.packages || this.viewModel.packages.length == 0) {
            alert('A rota precisa ter pelo menos um pacote para ser entregue.');
            return;
        }

        let employeeSocialNumber = this.viewModel.employee;
        this.viewModel.employee = {
            socialNumber: employeeSocialNumber
        }
        this.viewModel.processSendSMS = processSendSMS;
        this.viewModel.companyId = '5b48be0402eebd0014cef631';
        this.viewModel.userId = '5b2564b43ca749254842f5f8';
        this.viewModel.urlNotificaton = 'https://trackapio.herokuapp.com/api/statusnotification/'

        this.loading = true;
        this.service.insert(this.viewModel)
            .subscribe(
            (response: any) => {
                if (response.success) {
                    alert('Operação efetuada com sucesso.');
                } else {
                    alert(response.errorMessage);
                }
                this.router.navigate(['/routes']);
                this.loading = false;
            },
            error => {
                this.loading = false;
            })
    }

    saveAndProcess(): void {
        confirm('Atenção: Você confirma que deseja notificar os clientes sobre a data prevista para a entrega?', () => {
            this.save(true);
        })
    }

    process() {
        confirm('Atenção: Você confirma que deseja notificar os clientes sobre a data prevista para a entrega?', () => {
            this.loading = true;
            this.service.process(this.viewModel._id, '5b48be0402eebd0014cef631')
                .subscribe(
                (response: any) => {
                    if (response.success) {
                        alert('Operação efetuada com sucesso.');
                        this.viewModel.processed = true;
                    } else {
                        alert(response.errorMessage);
                    }

                    this.loading = false;
                },
                error => {
                    this.loading = false;
                })
        })

    }

    cancel(): void {
        this.router.navigate(['/routes']);
    }

}
