// Import delle dipendenze Angular e RxJS
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Import dei servizi per ottenere utenti e autenticazione
import { UserService, Employee } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-filter',                          // Selettore HTML del componente
  imports: [CommonModule],                         // Importa CommonModule per l’uso di *ngFor, *ngIf, ecc.
  templateUrl: './filter.component.html',          // Template HTML associato
  styleUrls: ['./filter.component.css']            // CSS del componente
})
export class FilterComponent implements OnInit, OnDestroy {
  @ViewChild('filter') filterInput!: ElementRef;   // Riferimento al campo input di filtro (HTML)

  private subscriptions = new Subscription();      // Raccolta delle sottoscrizioni RxJS per la pulizia
  private userSvc = inject(UserService);           // Iniezione servizio utente
  private auth    = inject(AuthService);           // Iniezione servizio di autenticazione

  employees: Employee[] = [];                      // Tutti gli impiegati ricevuti dal backend
  filteredEmployees: Employee[] = [];              // Lista impiegati dopo i filtri
  isManager = false;                               // Flag se l’utente è un manager
  userDepartment: string = '';                     // Dipartimento dell’utente corrente
  userRole: string = '';                           // Ruolo dell’utente (manager/dipendente)

  ngOnInit(): void {
    // 1. Carica lista completa impiegati
    this.subscriptions.add(
      this.userSvc.getAllImpiegati().subscribe(list => {
        this.employees = list;
        this.applyDepartmentFilter();              // Applica filtro in base al dipartimento
      })
    );

    // 2. Osserva ruolo utente
    this.subscriptions.add(
      this.auth.userRole$.subscribe(role => {
        this.userRole = role ?? '';
        this.isManager = this.userRole.toLowerCase() === 'manager';
        this.applyDepartmentFilter();              // Ricalcola il filtro se cambia il ruolo
      })
    );

    // 3. Osserva dipartimento utente
    this.subscriptions.add(
      this.auth.userDepartment$.subscribe(dept => {
        this.userDepartment = dept ?? '';
        this.applyDepartmentFilter();              // Ricalcola il filtro se cambia il dipartimento
      })
    );
  }

  // Filtro principale: mostra solo dipendenti dello stesso dipartimento del manager
  applyDepartmentFilter(): void {
    if (this.isManager) {
      this.filteredEmployees = this.employees.filter(
        e => e.dipartimento === this.userDepartment
      );
    } else {
      this.filteredEmployees = [];
    }
  }

  // Ricerca testuale all'interno della lista già filtrata per dipartimento
  filterResults(text: string): void {
    const base = this.isManager
      ? this.employees.filter(e => e.dipartimento === this.userDepartment)
      : [];

    this.filteredEmployees = base.filter(e =>
      (`${e.nome} ${e.cognome}`)
        .toLowerCase()
        .includes(text.toLowerCase())
    );
  }

  // Rimuove filtro testuale, torna allo stato solo-dipartimento
  removeFilters(): void {
    this.applyDepartmentFilter();
    if (this.filterInput) {
      this.filterInput.nativeElement.value = '';  // Reset campo input
    }
  }

  // Pulisce le sottoscrizioni per evitare memory leak
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
