import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData {
  email: string;
  tipo: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private role     = new BehaviorSubject<string | null>(null);

  /** Stream di login */
  isLoggedIn$: Observable<boolean>     = this.loggedIn.asObservable();
  /** Stream del ruolo utente */
  userRole$:  Observable<string | null> = this.role.asObservable();

  /** Chiamalo dopo un login andato a buon fine */
  login(userData: UserData): void {
    this.role.next(userData.tipo);
    this.loggedIn.next(true);
  }

  /** Chiamalo al logout */
  logout(): void {
    this.role.next(null);
    this.loggedIn.next(false);
  }
}