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
    
    options: any = {
        dropdownAutoWidth: true,
        width: '100%',
        containerCssClass: 'select2-selection--alt',
        dropdownCssClass: 'select2-dropdown--alt'
    };

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

}
