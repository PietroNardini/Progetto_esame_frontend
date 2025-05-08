import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { inject } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @ViewChild('filter') filterInput!: ElementRef;

  private subscriptions: Subscription = new Subscription();
  employeeService = inject(EmployeeService);
  authService = inject(AuthService);

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  isAdmin = false;
  userDepartment: string = '';

  ngOnInit(): void {
    this.loadEmployees();

    this.subscriptions.add(
      this.authService.userRole$.subscribe(role => {
        this.isAdmin = role === 'admin';
      })
    );

    this.subscriptions.add(
      this.authService.userDepartment$.subscribe(dept => {
        this.userDepartment = dept;
        this.applyDepartmentFilter();
      })
    );
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().then((employees: Employee[]) => {
      this.employees = employees;
      this.applyDepartmentFilter();
    }).catch(error => console.error('Error fetching employees:', error));
  }

  applyDepartmentFilter(): void {
    if (this.isAdmin) {
      this.filteredEmployees = this.employees;
    } else {
      this.filteredEmployees = this.employees.filter(
        e => e.department === this.userDepartment
      );
    }
  }

  filterResults(text: string): void {
    const baseList = this.isAdmin ? this.employees : this.employees.filter(
      e => e.department === this.userDepartment
    );
    this.filteredEmployees = baseList.filter(employee =>
      `${employee.nome} ${employee.cognome}`.toLowerCase().includes(text.toLowerCase())
    );
  }

  removeFilters(): void {
    this.applyDepartmentFilter();
    if (this.filterInput) {
      this.filterInput.nativeElement.value = '';
    }
  }

  refreshPage(): void {
    this.loadEmployees();
  }

  confirmDelete(employeeId: number): void {
    if (confirm('Vuoi eliminare questo dipendente?')) {
      this.employeeService.deleteEmployee(employeeId);
      this.refreshPage();
    }
  }
}
