import { Component, OnInit, ViewChild } from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
import { Router } from '@angular/router';
import { confirm } from 'dropzone';
import { dateFormatPipe } from '../../pipes/date-pipe'
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { ModalDirective } from 'ngx-bootstrap';

const URL = 'http://localhost:3000/api/schedules/import/';

@Component({
    selector: 'route-list',
    templateUrl: './route-list.component.html',
    providers: [SchedulesService],
    styleUrls: [
        './custom-style.css'
    ]
})

export class RouteListComponent implements OnInit {

    selectedFiles: FileList;
    currentFileUpload: File;

    public loading = false;
    public uploader:FileUploader = new FileUploader({url: URL});
    @ViewChild('modalImport') public modal: ModalDirective;

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
        this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
        this.uploader.setOptions({
            queueLimit : 1
        })
        this.uploader.onSuccessItem = () => {
            alert('Rota importada com sucesso');
            this.uploader.clearQueue();
            this.modal.hide();
        }
        this.uploader.onErrorItem = () => {
            alert('Não foi possivel importar a rota');
            this.uploader.clearQueue();
            this.modal.hide();
        }
    }

    selectFile(event): void {
        this.selectedFiles = event.target.files;
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

    upload(): void {
        this.loading = true;
        this.currentFileUpload = this.selectedFiles.item(0);
        this.service.pushFileToStorage(this.currentFileUpload, this.user.companyId)
            .subscribe(
            (response: any) => {
                if (response.success) {
                    this.loadData();
                    alert('Operação efetuada com sucesso.');
                } else {
                    alert(response.errorMessage);
                }
                this.selectedFiles = undefined;
                this.loading = false;
            },
            error => {
                console.log("Error :: " + error);
                this.loading = false;
            });

    }
}
