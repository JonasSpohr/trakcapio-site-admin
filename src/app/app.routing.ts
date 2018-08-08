import { Routes, RouterModule, CanActivate } from '@angular/router';

import {
    AuthGuard
} from './services/auth.guard';

const ROUTES: Routes = [
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(ROUTES);