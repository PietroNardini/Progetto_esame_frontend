// src/app/features/view-weekly/view-weekly.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HoursService, OraImpiegatoRecord } 
  from '../assign-hours/services/hours.service';
import { AuthService } from '../../core/auth.service';
import { UserService, Employee } from '../../core/user.service';

@Component({
  standalone: true,
  selector: 'app-view-weekly',
  imports: [CommonModule, RouterModule],
  templateUrl: './view-weekly.component.html',
  styleUrls: ['./view-weekly.component.css']
})
export class ViewWeeklyComponent implements OnInit, OnDestroy {
  private hrsSvc = inject(HoursService);
  private auth   = inject(AuthService);
  private userSvc= inject(UserService);
  private router = inject(Router);

  weekDates: Date[] = [];
  hoursRange: string[] = Array.from({length:11}, (_,i) => `${String(i+8).padStart(2,'0')}:00`);
  assignments: OraImpiegatoRecord[] = [];

  userDept: string | null = null;
  private deptEmpIds = new Set<string>();
  private subs = new Subscription();

  ngOnInit(): void {
    // 1) build week and hours
    this.buildWeek(new Date());
    this.buildHoursRange(8,24);

    // 2) subscribe to user department and load employee IDs
    this.subs.add(
      this.auth.userDepartment$.subscribe(dept => {
        this.userDept = dept;
        if (dept) {
          this.userSvc.getAllImpiegati().subscribe((emps: Employee[]) => {
            // filter employees by same department
            this.deptEmpIds = new Set(
              emps
                .filter(e => e.dipartimento === dept)
                .map(e => e.id.toString())
            );
            // after loading IDs, reload assignments
            this.loadAssignments();
          });
        } else {
          this.deptEmpIds.clear();
          this.loadAssignments();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private buildHoursRange(startHour = 8, endHour = 24) {
    this.hoursRange = [];
    for (let h = startHour; h < endHour; h++) {
      this.hoursRange.push(`${String(h).padStart(2,'0')}:00`);
    }
    this.hoursRange.push('00:00');
  }

  private buildWeek(ref: Date): void {
    const monday = new Date(ref);
    const offset = (ref.getDay() + 6) % 7;
    monday.setDate(ref.getDate() - offset);
    this.weekDates = Array.from({length: 7}, (_,i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  private formatYMD(d: Date): string {
    return d.toISOString().slice(0,10);
  }

  private loadAssignments(): void {
    const start = this.formatYMD(this.weekDates[0]);
    const end   = this.formatYMD(this.weekDates[this.weekDates.length-1]);
    this.hrsSvc.getAssignmentsByRange(start,end)
      .subscribe(list => this.assignments = list || []);
  }

  /**
   * Restituisce solo i record e i dipendenti del dipartimento
   */
  assignmentsFor(hour: string, day: Date): OraImpiegatoRecord[] {
    const key = this.formatYMD(day);
    return this.assignments
      .filter(a =>
        a.data === key &&
        a.inizio.substr(0,5) === hour
      )
      .map(a => ({
        ...a,
        datiImpiegati: a.datiImpiegati.filter(emp =>
          this.deptEmpIds.has(emp.id)
        )
      }))
      .filter(a => a.datiImpiegati.length > 0);
  }

  prevWeek(): void {
    const ref = new Date(this.weekDates[0]);
    ref.setDate(ref.getDate() - 7);
    this.buildWeek(ref);
    this.loadAssignments();
  }

  nextWeek(): void {
    const ref = new Date(this.weekDates[0]);
    ref.setDate(ref.getDate() + 7);
    this.buildWeek(ref);
    this.loadAssignments();
  }

  isToday(d: Date): boolean {
    return d.toDateString() === new Date().toDateString();
  }
}