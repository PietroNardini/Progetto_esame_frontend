// src/app/app-routing.module.ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }           from './features/auth/login/login.component';
import { DashboardComponent }       from './features/dashboard/dashboard/dashboard.component';
import { CreateEmployeeComponent }  from './features/employee/create-employee.component';
import { ViewEmployeeComponent }    from './features/view-employee/view-employee.component';
import { FilterComponent }          from './features/filter/filter.component';
import { ForgotPasswordComponent }  from './features/forgot-password/forgot-password.component';
import { ChangePasswordComponent }  from './features/change-password/change-password.component';
import { AssignMultiHoursComponent } from './features/assign-hours/assign-hours-multiple/assign-hours-multiple';
import { MonthlyCalendarComponent }  from './features/weekly-calendar/weekly-calendar/monthly-calendar.component';
import { PayslipComponent } from './features/payroll/payslip/payslip.component';
import { TwoWeeksCalendarComponent } from './features/two-weeks/two-weeks-calendar.component';

// import { AssignHoursComponent }     from './features/assign-hours/assign-hours-single/assign-hours.component';  
import { MonthlyHoursComponent } from './features/monthly-hours/monthly-hours.component';
import { AuthGuard }                from './core/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // filtro dipartimento accessibile ai manager
  { path: 'filter', component: FilterComponent, canActivate: [AuthGuard] },
  // route legacy
  { path: 'employees/filter', component: FilterComponent, canActivate: [AuthGuard] },

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

 // { path: 'assign-hours',
   // component: AssignHoursComponent,
   // canActivate: [AuthGuard]
 // },
  {
    path: 'assign-hours-multiple',
    component: AssignMultiHoursComponent,
    canActivate: [AuthGuard]
  },

  { 
    path: 'monthly-hours', 
    component: MonthlyHoursComponent,
    canActivate: [AuthGuard]   
  },

  {
    path: 'Monthly-calendar',
    component: MonthlyCalendarComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'two-weeks', 
    component: TwoWeeksCalendarComponent ,
    canActivate: [AuthGuard]
  },
  {
    path: 'payslip',
    component: PayslipComponent,
    canActivate: [AuthGuard]
  },

  // default and wildcard
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}