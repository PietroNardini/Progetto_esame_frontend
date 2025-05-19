// src/app/features/monthly-hours/monthly-hours.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { HoursService, Ora }         from '../assign-hours/services/hours.service';
import { AuthService }               from '../../core/auth.service';
import { Router, RouterModule }      from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-monthly-hours',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './monthly-hours.component.html',
  styleUrls:   ['./monthly-hours.component.css']
})
export class MonthlyHoursComponent implements OnInit {
  private hrs    = inject(HoursService);
  private auth   = inject(AuthService);
  private router = inject(Router);

  current      = new Date();
  today        = new Date();
  weeks: (Date|null)[][] = [];
  assignments: Ora[]     = [];
  empId: number | null   = null;

  ngOnInit() {
    this.empId = this.auth.getUserId?.() ?? null; 
    if (this.empId == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.buildCalendar();
    this.loadAssignments();
  }

  private buildCalendar() {
    const year   = this.current.getFullYear();
    const month  = this.current.getMonth();
    const first  = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;   // Lun=0…Dom=6
    const days   = new Date(year, month + 1, 0).getDate();

    const cells: (Date|null)[] = [
      ...Array(offset).fill(null),
      ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1))
    ];
    while (cells.length % 7) cells.push(null);

    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));
    }
  }

  private fmtDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd= String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  }

  private mergeContiguous(intervals: Ora[]): Ora[] {
    if (!intervals.length) return [];
    const sorted = intervals.slice().sort((a,b) => a.inizio.localeCompare(b.inizio));
    const merged: Ora[] = [];
    let cur = { ...sorted[0] };
    for (let next of sorted.slice(1)) {
      if (next.tipo === cur.tipo && next.inizio === cur.fine) {
        cur.fine = next.fine;
      } else {
        merged.push(cur);
        cur = { ...next };
      }
    }
    merged.push(cur);
    return merged;
  }

  loadAssignments() {
    const year  = this.current.getFullYear();
    const month = this.current.getMonth() + 1;
    this.hrs.getMonthlyAssignments(this.empId!, month, year)
      .subscribe(list => this.assignments = list || []);
  }

  prevMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth()-1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }
  nextMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth()+1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }

  assignmentsFor(day: Date|null): Ora[] {
    if (!day) return [];
    const key = this.fmtDate(day);
    const raw = this.assignments.filter(a => a.data === key);
    return this.mergeContiguous(raw);
  }
}