// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'manager' | 'dipendente';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleSubject = new BehaviorSubject<UserRole>('dipendente');
  userRole$ = this.roleSubject.asObservable();

  private deptSubject = new BehaviorSubject<string>('');
  userDepartment$ = this.deptSubject.asObservable();

  constructor() { }

  /** Chiamalo al login con risposta dal backend */
  loginFromBackend(userData: any): void {
    const tipo = userData.tipo;
    const dipartimento = userData.dipartimento;

    const mappedRole: UserRole = tipo === 'Manager' ? 'manager' : 'dipendente';

    this.roleSubject.next(mappedRole);
    this.deptSubject.next(dipartimento);
  }

  logout(): void {
    this.roleSubject.next('dipendente');
    this.deptSubject.next('');
  }
}
