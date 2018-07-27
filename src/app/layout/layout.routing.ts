import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const LAYOUT_ROUTES: Routes = [
    { path: '', component: LayoutComponent, children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', loadChildren: '../pages/home/home.module#HomeModule' },
        { path: 'routes', loadChildren: '../pages/routes/route-list.module#RouteListModule' },
        { path: 'employees', loadChildren: '../pages/employees/list.module#EmployeeListModule' }
    ]}
];

export const LayoutRouting = RouterModule.forChild(LAYOUT_ROUTES);