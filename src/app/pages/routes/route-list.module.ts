import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from "../../shared/shared.module";

import { RouteListComponent } from "./route-list.component";
import { RouteDetailComponent } from "./detail/detail.component";

const HOME_ROUTE = [
    { path: '', component: RouteListComponent },
    { path: 'detail/:id', component: RouteDetailComponent }
];

@NgModule ({
    declarations: [
        RouteListComponent,
        RouteDetailComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        RouterModule.forChild(HOME_ROUTE)
    ]
})

export class RouteListModule {  }