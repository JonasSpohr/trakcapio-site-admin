import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from "../../shared/shared.module";
import { LoadingModule } from 'ngx-loading';
import { HomeComponent } from "./home.component";

const HOME_ROUTE = [
    { path: '', component: HomeComponent }
];

@NgModule ({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        RouterModule.forChild(HOME_ROUTE),
        LoadingModule
    ]
})

export class HomeModule {  }