import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    providers: [HomeService]
})

export class HomeComponent implements OnInit {

    public loading: boolean = false;
    service: HomeService;
    todayItems: any = [];

    constructor(service: HomeService) {
        this.service = service;
    }

    ngOnInit() {
        this.loadTodayRoutesData();
    }

    loadTodayRoutesData(): void {
        this.loading = true;
        this.service.getTodayList()
            .subscribe(
                (response: any) => {
                    if (response.success) {
                        this.todayItems = response.result;
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
