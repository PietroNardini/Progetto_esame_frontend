// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ruolo: 'admin' o 'manager'
  private roleSubject = new BehaviorSubject<string>('manager');
  userRole$ = this.roleSubject.asObservable();

  // Dipartimento per i manager
  private deptSubject = new BehaviorSubject<string>('IT');
  userDepartment$ = this.deptSubject.asObservable();

  constructor() { }

  /** Chiamalo al login per cambiare ruolo */
  setRole(role: 'admin' | 'manager'): void {
    this.roleSubject.next(role);
  }

  /** Chiamalo al login per cambiare dipartimento (solo per manager) */
  setDepartment(dept: string): void {
    this.deptSubject.next(dept);
  }
}
