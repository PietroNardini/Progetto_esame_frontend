import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { HoursService, OraImpiegatoRecord } from '../assign-hours/services/hours.service';
import { AuthService }                 from '../../core/auth.service';

interface Slot {
  start: string; // “HH:mm”
  end:   string; // “HH:mm”
}

@Component({
  standalone: true,
  selector: 'app-two-weeks-calendar',
  imports: [CommonModule],
  templateUrl: './two-weeks-calendar.component.html',
  styleUrls: ['./two-weeks-calendar.component.css']
})
export class TwoWeeksCalendarComponent implements OnInit {
  private hrs   = inject(HoursService);
  private auth  = inject(AuthService);

  // lunedì di partenza e 14 giorni
  private startDate!: Date;
  days: Date[] = [];

  empId!: string;
  assignments: OraImpiegatoRecord[] = [];

  ngOnInit() {
    // 1) prendi l’ID impiegato (deve esistere, altrimenti redirect nel padre)
    const uid = this.auth.getUserId();
    if (!uid) throw new Error('Utente non loggato');
    this.empId = uid.toString();

    // 2) calcola lun–+14gg
    this.startDate = this.getMonday(new Date());
    this.buildFortnight();

    // 3) carica turni
    this.loadAssignments();
  }

  private getMonday(ref: Date): Date {
    const d = new Date(ref);
    const offset = (d.getDay() + 6) % 7;  // 0=Lun,...6=Dom
    d.setDate(d.getDate() - offset);
    return d;
  }

  private buildFortnight() {
    this.days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(this.startDate);
      d.setDate(this.startDate.getDate() + i);
      return d;
    });
  }

  prevFortnight() {
    this.startDate.setDate(this.startDate.getDate() - 14);
    this.buildFortnight();
    this.loadAssignments();
  }
  nextFortnight() {
    this.startDate.setDate(this.startDate.getDate() + 14);
    this.buildFortnight();
    this.loadAssignments();
  }

  private formatY(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd= String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  private loadAssignments() {
    const start = this.formatY(this.days[0]);
    const end   = this.formatY(this.days[13]);
    this.hrs.getAssignmentsByRange(start, end)
      .subscribe(list => this.assignments = list || []);
  }

  /** unisce tutti i record contigui di questo impiegato in fasce */
  assignmentsFor(day: Date): Slot[] {
    const key = this.formatY(day);
    // filtro solo record di questa data e di questo impiegato
    const raw = this.assignments
      .filter(r => r.data === key)
      .filter(r => r.datiImpiegati.some(u => u.id === this.empId));

    if (!raw.length) return [];

    // ordina per orario di inizio
    const sorted = [...raw].sort((a,b) => a.inizio.localeCompare(b.inizio));

    // merge contigui
    const slots: Slot[] = [];
    let cur: Slot = {
      start: sorted[0].inizio.substr(0,5),
      end:   sorted[0].fine.substr(0,5)
    };

    for (let i = 1; i < sorted.length; i++) {
      const s = sorted[i].inizio.substr(0,5);
      const e = sorted[i].fine.substr(0,5);
      if (s === cur.end) {
        cur.end = e;
      } else {
        slots.push(cur);
        cur = { start: s, end: e };
      }
    }
    slots.push(cur);
    return slots;
  }
}