import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./login.component";
import { AuthService } from "../services/auth.service.";
import { LoadingModule } from 'ngx-loading';

const LOGIN_ROUTE = [
    { path: '', component:LoginComponent }
];

@NgModule ({
    declarations: [
        LoginComponent
    ],
    imports: [
        LoadingModule,
        FormsModule,
        CommonModule,
        BsDropdownModule.forRoot(),
        RouterModule.forChild(LOGIN_ROUTE)
    ],
    providers: [AuthService]
})

export class LoginModule {  }