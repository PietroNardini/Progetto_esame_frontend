import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

  public userRole$: Observable<string | null>;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.userRole$ = this.authService.userRole$;
  }

  ngOnInit(): void {
    this.generateCurrentWeek(this.today);
  }

  private generateCurrentWeek(reference: Date) {
    const monday = new Date(reference);
    const day = monday.getDay();
    const diff = (day + 6) % 7;
    monday.setDate(monday.getDate() - diff);

    this.week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.week.push(d);
    }
  }

  goToCreateEmployee(): void {
    this.router.navigate(['/create-employee']);
  }

  goToEmployees(): void {
    console.log('⏩ Navigazione a /employees');
    this.router.navigate(['/employees']);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}