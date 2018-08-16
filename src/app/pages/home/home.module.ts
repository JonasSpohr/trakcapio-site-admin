import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from "../../shared/shared.module";
import { LoadingModule } from 'ngx-loading';
import { HomeComponent } from "./home.component";
import { PackagesComponent } from "./detail-packages/packages.component";
import { FormsModule } from '@angular/forms';


const HOME_ROUTE = [
    { path: '', component: HomeComponent },
    { path: 'detail/:id', component: PackagesComponent }
];

@NgModule ({
    declarations: [
        HomeComponent,
        PackagesComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        RouterModule.forChild(HOME_ROUTE),
        LoadingModule,
        FormsModule
    ]
})

export class HomeModule {  }