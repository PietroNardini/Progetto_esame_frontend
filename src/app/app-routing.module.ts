// src/app/app-routing.module.ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }           from './features/auth/login/login.component';
import { DashboardComponent }       from './features/dashboard/dashboard/dashboard.component';
import { CreateEmployeeComponent }  from './features/employee/create-employee.component';
import { ViewEmployeeComponent }    from './features/view-employee/view-employee.component';
import { ForgotPasswordComponent }  from './features/forgot-password/forgot-password.component';
import { ChangePasswordComponent }  from './features/change-password/change-password.component';
import { AuthGuard }                from './core/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  { path: 'create-employee',
    component: CreateEmployeeComponent,
    canActivate: [AuthGuard]
  },

  { path: 'employees',
    component: ViewEmployeeComponent,
    canActivate: [AuthGuard]
  },
  { path: 'employees/:id',
    component: ViewEmployeeComponent,
    canActivate: [AuthGuard]
  },

  // reset password (dashed)
  { path: 'change-password/:token',
    component: ChangePasswordComponent
  },
  // reset password (camelCase)
  { path: 'changePassword/:token',
    component: ChangePasswordComponent
  },

  { path: 'forgot-password',
    component: ForgotPasswordComponent
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}