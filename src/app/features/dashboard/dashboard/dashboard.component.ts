import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable }        from 'rxjs';
import { AuthService }       from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  week: Date[] = [];
  today = new Date();
  userRole$: Observable<string | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.userRole$ = this.authService.userRole$;
  }

  ngOnInit(): void {
    this.generateCurrentWeek(this.today);
  }

  /** Logout e redirect a /login */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private generateCurrentWeek(ref: Date) {
    const monday = new Date(ref);
    const day = monday.getDay();
    const diff = (day + 6) % 7; // trasforma Sunday=0→6, Monday=1→0, …
    monday.setDate(monday.getDate() - diff);

    this.week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.week.push(d);
    }
  }
}