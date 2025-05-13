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

import { UserService, Employee } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-filter',
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {
  @ViewChild('filter') filterInput!: ElementRef;

  private subscriptions = new Subscription();
  private userSvc = inject(UserService);
  private auth    = inject(AuthService);

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  isManager = false;
  userDepartment: string = '';
  userRole: string = '';

  ngOnInit(): void {
    // Carica lista completa dipendenti
    this.subscriptions.add(
      this.userSvc.getAllImpiegati().subscribe(list => {
        this.employees = list;
        this.applyDepartmentFilter();
      })
    );

    // Sottoscrivi ruolo utente
    this.subscriptions.add(
      this.auth.userRole$.subscribe(role => {
        this.userRole = role ?? '';
        this.isManager = this.userRole.toLowerCase() === 'manager';
        this.applyDepartmentFilter();
      })
    );

    // Sottoscrivi dipartimento utente
    this.subscriptions.add(
      this.auth.userDepartment$.subscribe(dept => {
        this.userDepartment = dept ?? '';
        this.applyDepartmentFilter();
      })
    );
  }

  applyDepartmentFilter(): void {
    if (this.isManager) {
      this.filteredEmployees = this.employees.filter(
        e => e.dipartimento === this.userDepartment
      );
    } else {
      this.filteredEmployees = [];
    }
  }

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

  removeFilters(): void {
    this.applyDepartmentFilter();
    if (this.filterInput) {
      this.filterInput.nativeElement.value = '';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}