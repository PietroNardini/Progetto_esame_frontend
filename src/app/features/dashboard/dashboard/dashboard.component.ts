import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService }       from '../../../core/auth.service';
import { ViewWeeklyComponent }   from '../../view-weekly/view-weekly.component';
import { Observable }        from 'rxjs';
import { TwoWeeksCalendarComponent } from '../../two-weeks/two-weeks-calendar.component';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterModule, ViewWeeklyComponent, TwoWeeksCalendarComponent ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole$: Observable<string|null>;
  today = new Date();
  twoWeeks: Date[][] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.userRole$ = this.auth.userRole$;
  }

  ngOnInit(): void {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; 
    const monday    = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);

    
    const week1 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
    
    const week2 = week1.map(d0 => {
      const d = new Date(d0);
      d.setDate(d0.getDate() + 7);
      return d;
    });

    this.twoWeeks = [ week1, week2 ];
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  goToCreateEmployee() { this.router.navigate(['/create-employee']); }
  goToAssignHours()    { this.router.navigate(['/assign-hours']); }
  goToEmployees()      { this.router.navigate(['/employees']); }
  goToFilter()      { this.router.navigate(['/filter']); }
  goToAssignMultiHours() {this.router.navigate(['/assign-hours-multiple']);}
  goToMonthlyHours() { this.router.navigate(['/monthly-hours']); }
}