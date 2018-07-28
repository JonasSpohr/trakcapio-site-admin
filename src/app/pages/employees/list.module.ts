import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from '@angular/forms';
import { EmployeeListComponent } from "./list.component";
import { EmployeeDetailComponent } from "./detail/detail.component";
import { EmployeeService } from "../../services/employee.service";
import { LoadingModule } from 'ngx-loading';

const HOME_ROUTE = [
    { path: '', component: EmployeeListComponent },
    { path: 'detail/:id', component: EmployeeDetailComponent }
];

@NgModule({
    declarations: [
        EmployeeListComponent,
        EmployeeDetailComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        RouterModule.forChild(HOME_ROUTE),
        FormsModule,
        LoadingModule
    ],
    providers: [EmployeeService]
})

export class EmployeeListModule { }