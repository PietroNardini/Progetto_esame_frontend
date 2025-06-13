import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HoursService, OraImpiegatoRecord } 
  from '../assign-hours/services/hours.service';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-view-weekly',
  imports: [CommonModule, RouterModule],
  templateUrl: './view-weekly.component.html',
  styleUrls: ['./view-weekly.component.css']
})
export class ViewWeeklyComponent implements OnInit {
  // Dependency injection dei servizi
  private hrsSvc = inject(HoursService); // Per ottenere le ore assegnate
  private auth   = inject(AuthService);  // Per gestire l'autenticazione
  private router = inject(Router);       // Per navigazione

  // Stato del componente
  weekDates: Date[] = [];                         // Giorni della settimana (lun–dom)
  hoursRange = Array.from({length:11},(_,i)=>`${String(i+8).padStart(2,'0')}:00`); // Intervallo orario base 08:00–18:00
  assignments: OraImpiegatoRecord[] = [];         // Lista assegnazioni caricate
  userDept: string | null = null;                 // Dipartimento dell’utente corrente

  // Costruisce la fascia oraria visualizzata (es. 08:00–24:00)
  private buildHoursRange(startHour = 8, endHour = 24) {
    this.hoursRange = [];
    for (let h = startHour; h < endHour; h++) {
      this.hoursRange.push(`${String(h).padStart(2, '0')}:00`);
    }
    this.hoursRange.push('00:00'); // Per coprire la mezzanotte del giorno dopo
  }

  // Inizializzazione componente
  ngOnInit(): void {
    // Recupera il dipartimento del manager (utente autenticato)
    this.auth.userDepartment$.subscribe(d => this.userDept = d);

    // Costruisce la settimana corrente (da lunedì a domenica)
    this.buildWeek(new Date());

    // Carica le assegnazioni da backend
    this.loadAssignments();

    // Costruisce la lista delle ore da visualizzare
    this.buildHoursRange(8, 24);
  }

  // Genera i 7 giorni della settimana basandosi su una data di riferimento
  private buildWeek(ref: Date): void {
    const monday = new Date(ref);
    const offset = (ref.getDay() + 6) % 7; // Conversione da 0=Dom → 0=Lun
    monday.setDate(ref.getDate() - offset);

    // Crea un array di 7 giorni consecutivi
    this.weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  // Formatta una data in formato YYYY-MM-DD (usato per confronti)
  private formatYMD(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  // Carica tutte le assegnazioni tra il lunedì e la domenica attuali
  private loadAssignments(): void {
    const start = this.formatYMD(this.weekDates[0]);
    const end   = this.formatYMD(this.weekDates[6]);
    this.hrsSvc.getAssignmentsByRange(start, end)
      .subscribe(list => this.assignments = list || []);
  }

  // Sposta la visualizzazione alla settimana precedente
  prevWeek(): void {
    const ref = new Date(this.weekDates[0]);
    ref.setDate(ref.getDate() - 7);
    this.buildWeek(ref);
    this.loadAssignments();
  }

  // Sposta la visualizzazione alla settimana successiva
  nextWeek(): void {
    const ref = new Date(this.weekDates[0]);
    ref.setDate(ref.getDate() + 7);
    this.buildWeek(ref);
    this.loadAssignments();
  }

  // Restituisce le assegnazioni per una certa ora e giorno
  assignmentsFor(hour: string, day: Date): OraImpiegatoRecord[] {
    const key = this.formatYMD(day);
    return this.assignments.filter(a =>
      a.data === key &&
      a.inizio.substr(0, 5) === hour
    );
  }

  // Verifica se una data corrisponde a oggi
  isToday(d: Date): boolean {
    return d.toDateString() === new Date().toDateString();
  }
}
