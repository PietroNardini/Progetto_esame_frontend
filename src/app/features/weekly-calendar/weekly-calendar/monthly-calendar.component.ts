import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoursService, OraImpiegatoRecord } from '../../assign-hours/services/hours.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-monthly-calendar',
  imports: [CommonModule, RouterModule],
  templateUrl: './monthly-calendar.component.html',
  styleUrls: ['./monthly-calendar.component.css']
})
export class MonthlyCalendarComponent implements OnInit {
  // 🔧 Dependency Injection
  private hrs = inject(HoursService);         // Servizio per caricare le ore assegnate
  private auth = inject(AuthService);         // Servizio per autenticazione
  private router = inject(Router);            // Servizio di routing

  // 📆 Stato e dati del calendario
  today = new Date();                         // Data odierna
  current = new Date();                       // Mese attualmente visualizzato
  daysInMonth: Date[] = [];                   // Giorni del mese corrente
  leadingSlots: undefined[] = [];             // Slot vuoti all'inizio del mese
  trailingSlots: undefined[] = [];            // Slot vuoti alla fine del mese
  assignments: OraImpiegatoRecord[] = [];     // Assegnazioni caricate
  userDept: string | null = null;             // Dipartimento dell’utente loggato

  //  Lifecycle hook principale
  ngOnInit() {
    //  Se non loggato → redirect al login
    this.auth.isLoggedIn$.subscribe(ok => {
      if (!ok) this.router.navigate(['/login']);
    });

    //  Recupera dipartimento dell’utente
    this.auth.userDepartment$.subscribe(d => this.userDept = d);

    //  Costruisce calendario e carica dati
    this.buildCalendar();
    this.loadAssignments();
  }

  //  Navigazione: mese precedente
  prevMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth() - 1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }

  //  Navigazione: mese successivo
  nextMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }

  //  Costruisce la griglia del calendario
  private buildCalendar() {
    const y = this.current.getFullYear();
    const m = this.current.getMonth();
    const count = new Date(y, m + 1, 0).getDate(); // Numero di giorni nel mese

    //  Genera lista dei giorni del mese
    this.daysInMonth = Array.from({ length: count }, (_, i) => new Date(y, m, i + 1));

    //  Slot iniziali vuoti per allineamento (il calendario inizia di lunedì)
    const firstDow = new Date(y, m, 1).getDay();      // Giorno della settimana (0=dom)
    const lead = (firstDow + 6) % 7;                  // Offset per far iniziare da lunedì
    this.leadingSlots = Array(lead);

    //  Slot finali vuoti per completare la griglia settimanale
    const total = lead + count;
    const trail = (7 - (total % 7)) % 7;
    this.trailingSlots = Array(trail);
  }

  //  Formatta una data come YYYY-MM-DD
  private formatYMD(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  //  Carica assegnazioni del mese corrente
  private loadAssignments() {
    const y = this.current.getFullYear();
    const m = this.current.getMonth();
    const start = this.formatYMD(new Date(y, m, 1));
    const end = this.formatYMD(new Date(y, m, this.daysInMonth.length));
    
    this.hrs.getAssignmentsByRange(start, end)
      .subscribe(list => this.assignments = list || []);
  }

  //  Ottiene lista impiegati assegnati per un determinato giorno
  employeesFor(day: Date) {
    const key = this.formatYMD(day);
    return this.assignments
      .filter(r => r.data === key)
      .flatMap(r => r.datiImpiegati);
  }

  //  Restituisce impiegati unici per un giorno (no duplicati)
  uniqueEmployeesFor(day: Date | null) {
    if (!day) return [];
    const key = this.formatYMD(day);
    const records = this.assignments.filter(r => r.data === key);
    const allEmps = records.flatMap(r => r.datiImpiegati);

    // Deduplicazione tramite Map con chiave = id impiegato
    const map = new Map<string, typeof allEmps[0]>();
    allEmps.forEach(emp => map.set(emp.id, emp));
    return Array.from(map.values());
  }

  //  Controlla se la data è oggi (per evidenziare)
  isToday(d: Date) {
    return d.toDateString() === this.today.toDateString();
  }

  //  Naviga alla vista di dettaglio di un giorno
  goToDay(day: Date) {
    this.router.navigate(['/day-detail'], {
      queryParams: { date: this.formatYMD(day) }
    });
  }
}
