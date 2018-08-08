import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
import { Router } from '@angular/router';
import { confirm } from 'dropzone';
import { dateFormatPipe } from '../../pipes/date-pipe'

@Component({
    selector: 'route-list',
    templateUrl: './route-list.component.html',
    providers: [SchedulesService],
    styleUrls: [
        './custom-style.css'
    ]
})

export class RouteListComponent implements OnInit {

    public loading = false;
    router: Router;
    p: number = 1;
    service: SchedulesService;
    items: any[] = [];
    user: any = JSON.parse(localStorage.getItem('traclapioUser'));

    constructor(r: Router, schedulesService: SchedulesService) {
        this.service = schedulesService;
        this.router = r;
    }

    ngOnInit() {
        this.loadData()
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

    view(id: any): void {
        this.router.navigate(['/routes/detail/' + id]);
    }

    delete(id: any): void {
        confirm('Atenção essa operação não pode ser revertida! Você confirma a exclusão da rota?', () => {
            this.loading = true;
            this.service.delete(id)
                .subscribe(
                (response: any) => {
                    if (response.success) {
                        this.loadData();
                        alert('Operação efetuada com sucesso.');
                    } else {
                        alert(response.errorMessage);
                    }

                    this.loading = false;
                },
                error => {
                    console.log("Error :: " + error);
                    this.loading = false;
                });
        });
    }
}
