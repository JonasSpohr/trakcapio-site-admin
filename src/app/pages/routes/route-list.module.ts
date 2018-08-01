import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";

import { RouteListComponent } from "./route-list.component";
import { RouteDetailComponent } from "./detail/detail.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { Select2Module } from 'ng2-select2';

import { LoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';

const HOME_ROUTE = [
    { path: '', component: RouteListComponent },
    { path: 'detail/:id', component: RouteDetailComponent }
];

@NgModule({
    declarations: [
        RouteListComponent,
        RouteDetailComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        RouterModule.forChild(HOME_ROUTE),
        ModalModule.forRoot(),
        LoadingModule,
        NgxPaginationModule,
        FormsModule,
        Select2Module
    ]
})

export class RouteListModule { }