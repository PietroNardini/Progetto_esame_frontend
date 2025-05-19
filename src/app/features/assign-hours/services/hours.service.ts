// src/app/features/assign-hours/services/hours.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ora {
  id:                   number;
  data:                 string;
  tipo:                 string;
  turno_lavorativo_id:  number;
  inizio:               string;  // “HH:mm:ss”
  fine:                 string;  // “HH:mm:ss”
}
export interface OraImpiegatoRecord {
  oraId:           number;
  data:            string;           // “YYYY-MM-DD”
  inizio:          string;           // “HH:mm:ss”
  fine:            string;           // “HH:mm:ss”
  datiImpiegati: Array<{
    id:      string;
    nome:    string;
    cognome: string;
    email:   string;
  }>;
}

export type MonthlyAssignment = Ora;

@Injectable({ providedIn: 'root' })
export class HoursService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  
  getAllWorkingHours(
    filters: { month?: string; day?: string; year?: string } = {}
  ): Observable<Ora[]> {
    return this.http.post<Ora[]>(
      `${this.baseUrl}/GetAllWorkingHours`,
      filters
    );
  }

  getMonthlyAssignments(
    impId: number,
    month: number,
    year: number
  ): Observable<MonthlyAssignment[]> {
    const body = {
      Id_Impiegato: impId.toString(),
      month:        month.toString(),
      year:         year.toString()
    };
    return this.http.post<MonthlyAssignment[]>(
      `${this.baseUrl}/GetAllWorkingHoursByImpiegato`,
      body
    );
  }


  assignSingleHour(
    oraId:   number,
    impId:   number,
    tipoOra: 'normale' | 'straordinario'
  ): Observable<{ message?: string; error?: string }> {
    const body = {
      Id_Ora:       oraId.toString(),
      Id_Impiegato: impId.toString(),
      tipoOra
    };
    return this.http.post<{ message?: string; error?: string }>(
      `${this.baseUrl}/AssegnaSingolaOra`,
      body
    );
  }

  assignMultipleHours(
    idsOre: number[],
    idsImp: number[],
    tipoOra: 'normale' | 'straordinario'
  ): Observable<{ message?: string; error?: string }> {
    const body = {
      Lista_Id_Ore:       idsOre,
      Lista_Id_Impiegati: idsImp,
      tipoOra
    };
    return this.http.post<{ message?: string; error?: string }>(
      `${this.baseUrl}/AssegnaOre`,
      body
    );
  }
  getEmployeeHours(
    empId: number,
    filters: { month?: string; day?: string; year?: string } = {}
  ): Observable<Ora[]> {
    return this.http.post<Ora[]>(
      `${this.baseUrl}/GetAllWorkingHoursByImpiegato`,
      { Id_Impiegato: empId.toString(), ...filters }
    );
  }


  getAssignmentsByRange(
      start: string, 
      end:   string
    ): Observable<OraImpiegatoRecord[]> {
    return this.http.post<OraImpiegatoRecord[]>(
      `${this.baseUrl}/GetOreImpiegatiPerRange`,
      { start, end }
    );
  }
}