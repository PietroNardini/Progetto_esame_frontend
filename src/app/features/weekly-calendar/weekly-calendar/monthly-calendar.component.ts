import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { HoursService, OraImpiegatoRecord } from '../../assign-hours/services/hours.service';
import { RouterModule, Router }       from '@angular/router';
import { AuthService }                from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-monthly-calendar',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './monthly-calendar.component.html',
  styleUrls:   ['./monthly-calendar.component.css']
})
export class MonthlyCalendarComponent implements OnInit {
  private hrs    = inject(HoursService);
  private auth   = inject(AuthService);
  private router = inject(Router);

  today           = new Date();
  current         = new Date();
  daysInMonth: Date[]               = [];
  leadingSlots:  undefined[]        = [];
  trailingSlots: undefined[]        = [];
  assignments: OraImpiegatoRecord[] = [];
  userDept: string | null           = null;

  ngOnInit() {
    // se non loggato → login
    this.auth.isLoggedIn$.subscribe(ok => {
      if (!ok) this.router.navigate(['/login']);
    });
    // prendi dipartimento
    this.auth.userDepartment$.subscribe(d => this.userDept = d);

    this.buildCalendar();
    this.loadAssignments();
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

  private buildCalendar() {
    const y     = this.current.getFullYear();
    const m     = this.current.getMonth();
    // numero di giorni
    const count = new Date(y, m + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: count }, (_, i) =>
      new Date(y, m, i + 1)
    );

    // calcola quante celle vuote mettere all’inizio
    const firstDow = new Date(y, m, 1).getDay();           // 0=Dom…6=Sab
    const lead = (firstDow + 6) % 7;                       // trasformo in Lun=0…Dom=6
    this.leadingSlots = Array(lead);

    // quante celle vuote alla fine
    const total = lead + count;
    const trail = (7 - (total % 7)) % 7;
    this.trailingSlots = Array(trail);
  }

  private formatYMD(d: Date): string {
    return d.toISOString().slice(0,10);
  }

  private loadAssignments() {
    const y     = this.current.getFullYear();
    const m     = this.current.getMonth();
    const start = this.formatYMD(new Date(y, m, 1));
    const end   = this.formatYMD(new Date(y, m, this.daysInMonth.length));
    this.hrs.getAssignmentsByRange(start, end)
      .subscribe(list => this.assignments = list || []);
  }

  /** restituisce la lista di impiegati per quel giorno (solo dipartimento proprio) */
  employeesFor(day: Date) {
    const key = this.formatYMD(day);
    return this.assignments
      .filter(r => r.data === key)
      .flatMap(r => r.datiImpiegati
      );
  }

  uniqueEmployeesFor(day: Date|null) {
  if (!day) return [];
  const key = this.formatYMD(day);
  // prendi tutti i record di quel giorno
  const records = this.assignments.filter(r => r.data === key);
  // appiattisci in un unico array di impiegati
  const allEmps = records.flatMap(r => r.datiImpiegati);
  // deduplica per id
  const map = new Map<string, typeof allEmps[0]>();
  allEmps.forEach(emp => map.set(emp.id, emp));
  return Array.from(map.values());
}

  isToday(d: Date) {
    return d.toDateString() === this.today.toDateString();
  }

  goToDay(day: Date) {
    this.router.navigate(['/day-detail'], { queryParams: { date: this.formatYMD(day) } });
  }
}