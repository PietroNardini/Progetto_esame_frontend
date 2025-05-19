import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { HoursService, OraImpiegatoRecord } from '../../assign-hours/services/hours.service';
import { AuthService }                from '../../../core/auth.service';
import { RouterModule, Router }       from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-weekly-calendar',
  imports: [CommonModule, RouterModule],
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css']
})
export class WeeklyCalendarComponent implements OnInit {
  private hrsSvc = inject(HoursService);
  private auth   = inject(AuthService);
  private router = inject(Router);

  today      = new Date();
  weekDates: Date[]              = [];
  hoursRange: string[]           = [];
  assignments: OraImpiegatoRecord[] = [];

  ngOnInit() {
    // Se non loggato → login
    this.auth.isLoggedIn$.subscribe(ok => {
      if (!ok) this.router.navigate(['/login']);
    });

    // costruisci settimana e fascia orarie
    this.buildWeek(new Date());
    this.buildHoursRange(8, 18);

    // carica assegnazioni
    this.loadAssignments();
  }

  private buildWeek(ref: Date) {
    const monday = new Date(ref);
    const dow = (monday.getDay() + 6) % 7;
    monday.setDate(ref.getDate() - dow);
    this.weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  private buildHoursRange(startHour: number, endHour: number) {
    this.hoursRange = [];
    for (let h = startHour; h <= endHour; h++) {
      this.hoursRange.push(`${String(h).padStart(2,'0')}:00`);
    }
  }

  private loadAssignments() {
    const start = this.formatYMD(this.weekDates[0]);
    const end   = this.formatYMD(this.weekDates[6]);
    this.hrsSvc.getAssignmentsByRange(start, end)
      .subscribe(list => this.assignments = list || []);
  }

  prevWeek() {
    const ref = new Date(this.weekDates[0]);
    ref.setDate(ref.getDate() - 7);
    this.buildWeek(ref);
    this.loadAssignments();
  }

  nextWeek() {
    const ref = new Date(this.weekDates[0]);
    ref.setDate(ref.getDate() + 7);
    this.buildWeek(ref);
    this.loadAssignments();
  }

  /** Restituisce l’array di impiegati per quella fascia+giorno */
  assignmentsForHourAndDay(hour: string, day: Date) {
    const ds = this.formatYMD(day);
    const rec = this.assignments.find(a =>
      a.data === ds &&
      a.inizio.substr(0,5) === hour
    );
    return rec?.datiImpiegati ?? [];
  }

  private formatYMD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd= String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  }
}