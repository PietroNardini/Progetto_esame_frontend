// src/app/app-routing.module.ts
import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { LoginComponent }           from './features/auth/login/login.component';
import { DashboardComponent }       from './features/dashboard/dashboard/dashboard.component';
import { CreateEmployeeComponent }  from './features/employee/create-employee.component';
import { AuthGuard }                from './core/auth.guard';

const routes: Routes = [
  // login pubblico
  { path: 'login', component: LoginComponent },

  // dashboard protetta (tutti gli utenti loggati)
  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // creazione dipendente protetta (solo utenti loggati)
  { path: 'create-employee',
    component: CreateEmployeeComponent,
    canActivate: [AuthGuard]
  },

  // redirect di default a login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // fallback
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}