// src/app/core/user.service.ts

import { Injectable }      from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import { Observable }      from 'rxjs';

export interface Employee {
  type: string;  
  id: number;
  email: string;
  nome: string;
  cognome: string;
  telefono?: string;
  dipartimento: string;
  dataDiNascita: string;
}

export interface LoginResponse {
  message: string;
  userData: {
    email:       string;
    tipo:        string;
    dipartimento: string;
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /** GET /api/GetAllImpiegati */
  getAllImpiegati(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/GetAllImpiegati`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.post<Employee>(
      `${this.baseUrl}/GetById`,
      { id }
    );
  }

  /** (se in back-end serve davvero) POST /api/GetByDipartimento */
  getByDipartimento(tipo: string, dip: string): Observable<Employee[]> {
    return this.http.post<Employee[]>(
      `${this.baseUrl}/GetByDipartimento`,
      { tipo_Utente: tipo, dipartimento: dip }
    );
  }

  /** POST /api/InsertImpiegato */
  createEmployee(emp: Employee): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/InsertImpiegato`,
      emp
    );
  }

  /** POST /api/InsertManager */
  createManager(mgr: Employee): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/InsertManager`,
      mgr
    );
  }

  /** POST /api/ResetPasswordRequest */
  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/ResetPasswordRequest`,
      { email }
    );
  }

  /** POST /api/updatePassword */
  changePassword(token: string, newPassword: string): Observable<{ message: string; userData?: any }> {
    return this.http.post<{ message: string; userData?: any }>(
      `${this.baseUrl}/updatePassword`,
      { token, password: newPassword }
    );
  }

  /** POST /api/gethours */

  assignOre(
    oraId: number,
    email: string,
    tipoOra: 'normale' | 'straordinario'
  ): Observable<{ message?: string; error?: string }> {
    const body = {
      Id_Ora:  oraId.toString(),
      email:   email,
      tipoOra: tipoOra
    };
    return this.http.post<{ message?: string; error?: string }>(
      `${this.baseUrl}/AssegnaOre`,
      body
    );
  }

  

  /** POST /api/Login */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/Login`,
      { email, password }
    );
  }
}