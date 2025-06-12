
import { Injectable } from '@angular/core';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // Simulazione: sostituisci con chiamata HTTP al tuo backend
  private _mockEmployees: Employee[] = [
    { id: 1, nome: 'Mario', cognome: 'Rossi', department: 'IT' },
    { id: 2, nome: 'Lucia', cognome: 'Verdi', department: 'HR' },
    { id: 3, nome: 'Giulia', cognome: 'Bianchi', department: 'IT' },
    { id: 4, nome: 'Paolo', cognome: 'Neri', department: 'Sales' }
  ];

  constructor() { }

  /** Restituisce la lista completa (Promise per allinearsi al tuo codice) */
  getEmployees(): Promise<Employee[]> {
    return Promise.resolve(this._mockEmployees);
  }

  /** Elimina un dipendente (simulazione) */
  deleteEmployee(id: number): void {
    this._mockEmployees = this._mockEmployees.filter(e => e.id !== id);
    console.log(`Dipendente con ID ${id} eliminato.`);
  }
}
