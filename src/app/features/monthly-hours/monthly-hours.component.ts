// Import dei moduli Angular core e comuni
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';

// Import del servizio delle ore e del tipo di dato `Ora`
import { HoursService, Ora }         from '../assign-hours/services/hours.service';

// Import del servizio di autenticazione
import { AuthService }               from '../../core/auth.service';

// Router per reindirizzamenti
import { Router, RouterModule }      from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-monthly-hours',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './monthly-hours.component.html',
  styleUrls:   ['./monthly-hours.component.css']
})
export class MonthlyHoursComponent implements OnInit {
  // Iniezione dei servizi tramite la funzione `inject`
  private hrs    = inject(HoursService);
  private auth   = inject(AuthService);
  private router = inject(Router);

  // Stato attuale del calendario
  current      = new Date();                // Mese corrente visualizzato
  today        = new Date();                // Data odierna
  weeks: (Date|null)[][] = [];              // Matrice 2D che rappresenta settimane -> giorni
  assignments: Ora[]     = [];              // Ore assegnate al dipendente
  empId: number | null   = null;            // ID del dipendente loggato

  ngOnInit() {
    // Recupera l'ID dell'utente loggato, se non esiste lo reindirizza al login
    this.empId = this.auth.getUserId?.() ?? null; 
    if (this.empId == null) {
      this.router.navigate(['/login']);
      return;
    }

    // Costruisce il calendario del mese corrente e carica le assegnazioni
    this.buildCalendar();
    this.loadAssignments();
  }

  // Costruisce la struttura del calendario mensile sotto forma di settimane
  private buildCalendar() {
    const year   = this.current.getFullYear();
    const month  = this.current.getMonth();

    const first  = new Date(year, month, 1);                     // Primo giorno del mese
    const offset = (first.getDay() + 6) % 7;                     // Offset per allineare al lunedì
    const days   = new Date(year, month + 1, 0).getDate();       // Numero di giorni nel mese

    const cells: (Date|null)[] = [
      ...Array(offset).fill(null),                               // Spazi vuoti all'inizio della settimana
      ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)) // Giorni del mese
    ];
    while (cells.length % 7) cells.push(null);                   // Completa la griglia con null

    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));                    // Divide i giorni in settimane
    }
  }

  // Formatta una data nel formato "YYYY-MM-DD"
  private fmtDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd= String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  }

  // Unisce intervalli orari contigui dello stesso tipo per una visualizzazione più pulita
  private mergeContiguous(intervals: Ora[]): Ora[] {
    if (!intervals.length) return [];

    const sorted = intervals.slice().sort((a,b) => a.inizio.localeCompare(b.inizio));
    const merged: Ora[] = [];

    let cur = { ...sorted[0] };

    for (let next of sorted.slice(1)) {
      // Se stesso tipo e intervalli contigui (inizio == fine del precedente), li unisce
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

  // Carica le assegnazioni orarie per il mese visualizzato
  loadAssignments() {
    const year  = this.current.getFullYear();
    const month = this.current.getMonth() + 1;

    this.hrs.getMonthlyAssignments(this.empId!, month, year)
      .subscribe(list => this.assignments = list || []);
  }

  // Naviga al mese precedente
  prevMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth()-1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }

  // Naviga al mese successivo
  nextMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth()+1, 1);
    this.buildCalendar();
    this.loadAssignments();
  }

  // Restituisce le ore assegnate in una determinata giornata, unendole se contigue
  assignmentsFor(day: Date|null): Ora[] {
    if (!day) return [];
    const key = this.fmtDate(day);
    const raw = this.assignments.filter(a => a.data === key);
    return this.mergeContiguous(raw);
  }
}
// Questo componente gestisce la visualizzazione delle ore assegnate mensilmente per un dipendente.
// Permette di navigare tra i mesi e visualizza le assegnazioni in un calendario mensile.