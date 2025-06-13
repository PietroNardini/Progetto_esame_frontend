import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService }       from '../../../core/auth.service';
import { ViewWeeklyComponent }   from '../../view-weekly/view-weekly.component';
import { Observable }        from 'rxjs';
import { TwoWeeksCalendarComponent } from '../../two-weeks/two-weeks-calendar.component';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterModule, ViewWeeklyComponent, TwoWeeksCalendarComponent ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Observable che contiene il ruolo utente, ottenuto da AuthService
  userRole$: Observable<string|null>;

  // Data odierna (usata per visualizzazione o calcoli)
  today = new Date();

  // Array di due settimane, ognuna composta da 7 Date, usato per calendario a due settimane
  twoWeeks: Date[][] = [];

  constructor(
    private auth: AuthService,    // Servizio autenticazione per info utente e logout
    private router: Router         // Router per navigazione programmata
  ) {
    // Sottoscrizione a userRole$ per ottenere il ruolo attuale dell'utente in modo reattivo
    this.userRole$ = this.auth.userRole$;
  }

  ngOnInit(): void {
    // Calcolo del lunedì della settimana corrente (con lunedì come primo giorno)
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Calcola indice da 0=Lun a 6=Dom
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek); // Sposta data al lunedì corrente

    // Costruzione della prima settimana (7 giorni da lunedì a domenica)
    const week1 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    // Costruzione della seconda settimana, copiando la prima settimana e aggiungendo 7 giorni a ciascuna data
    const week2 = week1.map(d0 => {
      const d = new Date(d0);
      d.setDate(d0.getDate() + 7);
      return d;
    });

    // Impostazione dell'array di due settimane nel componente
    this.twoWeeks = [ week1, week2 ];
  }

  // Metodo per fare logout e navigare alla pagina di login
  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Metodi di navigazione per varie pagine dell’app
  goToCreateEmployee()     { this.router.navigate(['/create-employee']); }
  goToAssignHours()        { this.router.navigate(['/assign-hours']); }
  goToEmployees()          { this.router.navigate(['/employees']); }
  goToFilter()             { this.router.navigate(['/filter']); }
  goToAssignMultiHours()   { this.router.navigate(['/assign-hours-multiple']); }
  goToMonthlyHours()       { this.router.navigate(['/monthly-hours']); }
}
