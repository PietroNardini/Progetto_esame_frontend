import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData {
  email: string;
  tipo: string;
  dipartimento: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private role     = new BehaviorSubject<string | null>(null);
  private dept     = new BehaviorSubject<string | null>(null);

  /** Stream di login */
  isLoggedIn$: Observable<boolean>     = this.loggedIn.asObservable();
  /** Stream del ruolo utente */
  userRole$:  Observable<string | null> = this.role.asObservable();
  userDepartment$: Observable<string | null> = this.dept.asObservable();

  login(userData: UserData): void {
   this.role.next(userData.tipo);
   this.dept.next(userData.dipartimento);  // ← imposti il dept
   this.loggedIn.next(true);
  }

  /** Chiamalo al logout */
  logout(): void {
    this.role.next(null);
    this.loggedIn.next(false);
    this.dept.next(null); 
  }
}