import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData {
  id: number;
  email: string;
  tipo: string;
  dipartimento: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn    = new BehaviorSubject<boolean>(false);
  private role        = new BehaviorSubject<string | null>(null);
  private department  = new BehaviorSubject<string | null>(null);
  private userId      = new BehaviorSubject<number | null>(null);

  /** Stream di login */
  isLoggedIn$:     Observable<boolean>      = this.loggedIn.asObservable();
  /** Stream del ruolo utente */
  userRole$:       Observable<string | null> = this.role.asObservable();
  /** Stream del dipartimento utente */
  userDepartment$: Observable<string | null> = this.department.asObservable();
  /** Stream dell'ID utente */
  userId$:         Observable<number | null> = this.userId.asObservable();

  /** Chiamalo dopo un login andato a buon fine */
  login(userData: UserData): void {
    this.userId.next(userData.id);
    this.role.next(userData.tipo);
    this.department.next(userData.dipartimento);
    this.loggedIn.next(true);
  }

  /** Chiamalo al logout */
  logout(): void {
    this.userId.next(null);
    this.role.next(null);
    this.department.next(null);
    this.loggedIn.next(false);
  }

  /** Restituisce l'ID dell'utente loggato (valore corrente) */
  getUserId(): number | null {
    return this.userId.getValue();
  }
}

