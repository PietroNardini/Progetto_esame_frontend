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

export type MonthlyAssignment = Ora;

@Injectable({ providedIn: 'root' })
export class HoursService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}  // HttpClient iniettato

  /** Carica tutte le ore disponibili con filtri opzionali */
  getAllWorkingHours(
    filters: { month?: string; day?: string; year?: string } = {}
  ): Observable<Ora[]> {
    return this.http.post<Ora[]>(
      `${this.baseUrl}/GetAllWorkingHours`,
      filters
    );
  }

  /**
   * Recupera tutte le ore lavorative già assegnate a un impiegato per mese/anno.
   * Ritorna un array di assegnazioni con data, fasce orarie e tipo.
   */
  getMonthlyAssignments(
    impId: number,
    month: number,
    year: number
  ): Observable<MonthlyAssignment[]> {
    const body = {
      Id_Impiegato: impId.toString(),
      month: month.toString(),
      year: year.toString()
    };
    return this.http.post<MonthlyAssignment[]>(
      `${this.baseUrl}/GetAllWorkingHoursByImpiegato`,
      body
    );
  }


  /** Assegna una singola ora a un impiegato */
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

  /** Assegna più ore a più dipendenti */
 assignMultipleHours(
    idsOre: number[],
    idsImp: number[],
    tipoOra: 'normale' | 'straordinario'
  ): Observable<{ message?: string; error?: string }> {
    const body = {
      Lista_Id_Ore: idsOre,
      Lista_Id_Impiegati: idsImp,
      tipoOra
    };
    console.log('→ POST /api/AssegnaOre', body);
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
}
