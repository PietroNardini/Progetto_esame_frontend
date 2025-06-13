import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Ruoli previsti
export type UserRole = 'manager' | 'dipendente';

@Injectable({
  providedIn: 'root'  // Servizio singleton disponibile ovunque
})
export class AuthService {
  private roleSubject = new BehaviorSubject<UserRole>('dipendente');  // Ruolo dell’utente
  userRole$ = this.roleSubject.asObservable();                        // Observable pubblico del ruolo

  private deptSubject = new BehaviorSubject<string>('');              // Dipartimento dell’utente
  userDepartment$ = this.deptSubject.asObservable();                  // Observable pubblico del dipartimento

  constructor() {}

  /* Metodo da chiamare al login per aggiornare ruolo e dipartimento */
  loginFromBackend(userData: any): void {
    const tipo = userData.tipo;                // Es. "Manager" o "Dipendente"
    const dipartimento = userData.dipartimento;

    const mappedRole: UserRole = tipo === 'Manager' ? 'manager' : 'dipendente';

    this.roleSubject.next(mappedRole);         // Aggiorna ruolo
    this.deptSubject.next(dipartimento);       // Aggiorna dipartimento
  }

  // Metodo per il logout: resetta ruolo e dipartimento
  logout(): void {
    this.roleSubject.next('dipendente');       // Ruolo base
    this.deptSubject.next('');                 // Dipartimento vuoto
  }
}
