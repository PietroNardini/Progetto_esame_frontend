// src/app/features/view-weekly/view-weekly.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { RouterModule, Router }       from '@angular/router';
import { HoursService, OraImpiegatoRecord } 
  from '../assign-hours/services/hours.service';
import { AuthService }                from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-view-weekly',
  imports: [CommonModule, RouterModule],
  templateUrl: './view-weekly.component.html',
  styleUrls: ['./view-weekly.component.css']
})
export class ViewWeeklyComponent implements OnInit {
  private hrsSvc = inject(HoursService);
  private auth   = inject(AuthService);
  private router = inject(Router);

  weekDates: Date[]                 = [];
  hoursRange = Array.from({length:11},(_,i)=>`${String(i+8).padStart(2,'0')}:00`);
  assignments: OraImpiegatoRecord[] = [];
  userDept: string | null          = null;

  private buildHoursRange(startHour = 8, endHour = 24) {
  this.hoursRange = [];
  for (let h = startHour; h < endHour; h++) {
    this.hoursRange.push(`${String(h).padStart(2, '0')}:00`);
  }
  this.hoursRange.push('00:00');
}

  ngOnInit(): void {
    // 1) recupera il dipartimento del manager
    this.auth.userDepartment$.subscribe(d => this.userDept = d);
    // 2) monta lun–domin
    this.buildWeek(new Date());
    // 3) carica i dati
    this.loadAssignments();

    this.buildHoursRange(8, 24);

  }

  private buildWeek(ref: Date): void {
    const monday = new Date(ref);
    const offset = (ref.getDay() + 6) % 7; // 0=Lun … 6=Dom
    monday.setDate(ref.getDate() - offset);
    this.weekDates = Array.from({length:7},(_,i)=>{
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
    const end   = this.formatYMD(this.weekDates[6]);
    this.hrsSvc.getAssignmentsByRange(start,end)
      .subscribe(list => this.assignments = list || []);
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

  /** 
   * Prende tutti i record (ore+dipendenti) di un certo giorno/ora 
   */
  assignmentsFor(hour: string, day: Date): OraImpiegatoRecord[] {
    const key = this.formatYMD(day);
    return this.assignments.filter(a =>
      a.data === key &&
      a.inizio.substr(0,5) === hour
    );
  }

  isToday(d: Date): boolean {
    return d.toDateString() === new Date().toDateString();
  }
}