import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  email: string;
  password: string;
  nome: string;
  cognome: string;
  telefono?: string;
  dipartimento: string;
  dataDiNascita: string;
}

export interface LoginResponse {
  message: string;
  userData: { email: string; tipo: string };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /** POST /api/login */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/Login`,
      { email, password }
    );
  }

  /** POST /api/InsertImpiegato */
  createEmployee(emp: Employee): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/InsertImpiegato`,
      emp
    );
  }

  /** Se ti serve anche per manager */
  createManager(mgr: Employee): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/InsertManager`,
      mgr
    );
  }
}