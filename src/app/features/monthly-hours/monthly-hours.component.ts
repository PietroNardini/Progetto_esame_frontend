// src/app/features/monthly-hours/monthly-hours.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
// IMPORT CORRETTO (senza .ts e percorso relativo giusto)
import { HoursService, MonthlyAssignment } from '../assign-hours/services/hours.service';
import { AuthService }               from '../../core/auth.service';
import { RouterModule }              from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-monthly-hours',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './monthly-hours.component.html',
  styleUrls: ['./monthly-hours.component.css']
})
export class MonthlyHoursComponent implements OnInit {
  private hrs     = inject(HoursService);
  private auth    = inject(AuthService);

  /** data corrente usata per il mese */
  current = new Date();
  /** oggi, per evidenziare il giorno corrente */
  today   = new Date();            // ← aggiunto

  /** array di Date per ogni giorno del mese */
  daysInMonth: Date[] = [];
  /** assegnazioni ricevute dal server */
  assignments: MonthlyAssignment[] = [];
  /** id dell’impiegato loggato */
  empId!: number;

  ngOnInit() {
    // Supponiamo che AuthService esponga l’id via un payload o simile:
    // per esempio: this.empId = this.auth.getUserId();
    // oppure ricavalo dal token / userData che hai salvato
    this.empId = this.auth.getUserId()!;
    this.buildCalendar();
    this.loadAssignments();
  }

  private buildCalendar() {
    const year  = this.current.getFullYear();
    const month = this.current.getMonth();
    const days  = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) =>
      new Date(year, month, i + 1)
    );
  }

  loadAssignments() {
    const year  = this.current.getFullYear();
    const month = this.current.getMonth() + 1; // API usa 1–12
    this.hrs.getMonthlyAssignments(this.empId, month, year)
      .subscribe(list => this.assignments = list || []);
  }

  prevMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth() - 1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }

  nextMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }

  // monthly-hours.component.ts

private formatLocalYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

assignmentsFor(day: Date): MonthlyAssignment[] {
  const ds = this.formatLocalYMD(day);
  return this.assignments.filter(a => a.data === ds);
  } 
}