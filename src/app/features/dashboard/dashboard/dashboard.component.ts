import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService }       from '../../../core/auth.service';
import { Observable }        from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    // punto di partenza: lunedì della settimana corrente
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Lun, …, 6 = Dom
    const monday    = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);

    // prima settimana
    const week1 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
    // seconda settimana
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