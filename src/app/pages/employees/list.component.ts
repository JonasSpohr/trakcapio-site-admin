import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { confirm } from 'dropzone';

@Component({
    selector: 'employee-list',
    templateUrl: './list.component.html',
    providers: [EmployeeService]
})

export class EmployeeListComponent implements OnInit {
    user : any  = JSON.parse(localStorage.getItem('traclapioUser'));
    router: Router;
    public loading = false;
    service: EmployeeService;
    items: any[] = [];

    constructor(r: Router, employeeService: EmployeeService) {
        this.service = employeeService;
        this.router = r;
    }

    ngOnInit() {
        this.loadData();
    }

    delete(id: string): void {
        confirm('Você confirma a exclusão do funcionário. Essa operação NÃO pode ser revertida!', () => {
            this.service.delete(id)
                .subscribe(
                (response: any) => {
                    if (response.success) {
                        this.loadData();
                        alert('Operação efetuada com sucesso.');
                    } else {
                        alert(response.errorMessage);
                        this.loading = false;
                    }                    
                },
                error => {
                    console.log("Error :: " + error);
                    this.loading = false;
                });
        });
    }

    detail(id: string): void {
        this.router.navigate(['/employees/detail/' + id]);
    }

    loadData(): void {
        this.loading = true;
        this.service.getList(this.user.companyId)
            .subscribe(
            (response: any) => {
                if (response.success) {
                    this.items = response.result;
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
