import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoursService, OraImpiegatoRecord } from '../assign-hours/services/hours.service';
import { AuthService } from '../../core/auth.service';

// Interfaccia che rappresenta uno slot orario con inizio e fine
interface Slot {
  start: string; // Ora inizio (formato "HH:mm")
  end: string;   // Ora fine (formato "HH:mm")
}

@Component({
  standalone: true,
  selector: 'app-two-weeks-calendar',
  imports: [CommonModule],
  templateUrl: './two-weeks-calendar.component.html',
  styleUrls: ['./two-weeks-calendar.component.css']
})
export class TwoWeeksCalendarComponent implements OnInit {

  // Iniettiamo i servizi necessari con Angular inject
  private hrs = inject(HoursService);
  private auth = inject(AuthService);

  // Data iniziale della visualizzazione: lunedì della prima settimana
  private startDate!: Date;

  // Array contenente le 14 date (due settimane)
  days: Date[] = [];

  // Id utente autenticato
  empId!: string;

  // Lista di tutti gli assegnamenti di ore relativi alle due settimane
  assignments: OraImpiegatoRecord[] = [];

  ngOnInit() {
    // Prendi l'ID utente dall'autenticazione
    const uid = this.auth.getUserId();
    if (!uid) throw new Error('Utente non loggato');
    this.empId = uid.toString();

    // Trova il lunedì della settimana corrente e costruisci l'array di 14 giorni
    this.startDate = this.getMonday(new Date());
    this.buildFortnight();

    // Carica gli assegnamenti per l'intervallo di due settimane
    this.loadAssignments();
  }


  private getMonday(ref: Date): Date {
    const d = new Date(ref);
    // getDay(): domenica=0, lunedì=1, ..., sabato=6
    // Vogliamo lunedì = 0, quindi offset = (giorno + 6) % 7
    const offset = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - offset);
    return d;
  }

  // Costruisce l'array days contenente 14 date consecutive a partire da startDate
  private buildFortnight() {
    this.days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(this.startDate);
      d.setDate(this.startDate.getDate() + i);
      return d;
    });
  }

  // Vai indietro di due settimane e ricarica dati
  prevFortnight() {
    this.startDate.setDate(this.startDate.getDate() - 14);
    this.buildFortnight();
    this.loadAssignments();
  }

 // Vai avanti di due settimane e ricarica dati
  nextFortnight() {
    this.startDate.setDate(this.startDate.getDate() + 14);
    this.buildFortnight();
    this.loadAssignments();
  }


  private formatY(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  // Carica gli assegnamenti tra la prima e la quattordicesima data
  
  private loadAssignments() {
    const start = this.formatY(this.days[0]);
    const end = this.formatY(this.days[13]);
    this.hrs.getAssignmentsByRange(start, end)
      .subscribe(list => this.assignments = list || []);
  }

  assignmentsFor(day: Date): Slot[] {
    const key = this.formatY(day);

    // Filtra gli assegnamenti del giorno e dell'impiegato loggato
    const raw = this.assignments
      .filter(r => r.data === key)
      .filter(r => r.datiImpiegati.some(u => u.id === this.empId));

    if (!raw.length) return [];

    // Ordina per orario inizio
    const sorted = [...raw].sort((a, b) => a.inizio.localeCompare(b.inizio));

    // Accorpa gli slot consecutivi (fine di uno = inizio del prossimo)
    const slots: Slot[] = [];
    let cur: Slot = {
      start: sorted[0].inizio.substring(0, 5),
      end: sorted[0].fine.substring(0, 5)
    };

    for (let i = 1; i < sorted.length; i++) {
      const s = sorted[i].inizio.substring(0, 5);
      const e = sorted[i].fine.substring(0, 5);
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

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  
   // Proprietà calcolata per mostrare "Giugno 2025" ecc. in header// 
  get currentMonthYear(): string {
    if (!this.startDate) return '';
    // Formatta con italiano e maiuscole iniziali
    return this.startDate.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long'
    }).replace(/^\w/, c => c.toUpperCase());
  }
}
