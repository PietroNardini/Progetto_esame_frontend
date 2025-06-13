// Import delle dipendenze Angular per componenti, form, moduli e routing
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import dei servizi custom dell'applicazione
import { UserService } from '../../../core/user.service';
import { AuthService } from '../../../core/auth.service';

// Import della funzione che calcola il cedolino e del relativo tipo
import { computePayslip, Payslip } from '../../../core/payslip-calculator';

@Component({
  standalone: true,
  selector: 'app-payslip',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  // Iniezione dei servizi tramite `inject()` (nuova sintassi Angular)
  private fb      = inject(FormBuilder);
  private userSvc = inject(UserService);
  private auth    = inject(AuthService);

  // Form reattivo per inserire i dati richiesti
  form!: FormGroup;

  // ID dell’utente autenticato
  meId: number | null = null;

  // Risultati grezzi formattati per la visualizzazione
  rawResult: Record<string, any> | null = null;

  // Oggetto Payslip calcolato (contiene netto, tasse, ecc.)
  payslip?: Payslip;

  // Stato di caricamento e gestione errori
  loading = false;
  error: string | null = null;

  // Elenco dei mesi disponibili per la selezione
  months = [
    { value: '01', label: 'Gennaio' },
    { value: '02', label: 'Febbraio' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Aprile' },
    { value: '05', label: 'Maggio' },
    { value: '06', label: 'Giugno' },
    { value: '07', label: 'Luglio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Settembre' },
    { value: '10', label: 'Ottobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Dicembre' }
  ];

  ngOnInit(): void {
    // Recupera l’ID dell’utente loggato
    this.meId = this.auth.getUserId();

    // Costruzione del form con empId e mese obbligatori
    this.form = this.fb.group({
      empId: [this.meId, Validators.required],
      month: ['', Validators.required]
    });
  }

  // Metodo chiamato alla sottomissione del form
  onSubmit(): void {
    if (this.form.invalid) return;

    // Stato iniziale: reset errori e risultati precedenti
    this.loading = true;
    this.error = null;
    this.rawResult = null;
    this.payslip = undefined;

    const { empId, month } = this.form.value;

    // Chiamata al backend per ottenere lo stipendio
    this.userSvc.calculateSalary(+empId, month).subscribe({
      next: data => {
        // Trasforma i dati per una visualizzazione leggibile
        this.rawResult = Object.entries(data).reduce((acc, [key, value]) => {
          let label = key;
          let val = value;

          // Etichetta e formattazione per il tipo di impiegato
          if (key === 'message') {
            label = 'Tipologia';
            if (value === 'Impiegato Stipendiato') {
              val = 'Impiegato';
            }
          }

          // Etichetta e formattazione per lo stipendio
          if (key === 'Stipendio') {
            label = 'Stipendio';
            const num = parseFloat(value);
            if (!isNaN(num)) {
              val = num.toFixed(2).replace('.', ',') + ' €';
            }
          }

          acc[label] = val;
          return acc;
        }, {} as Record<string, string>);

        // Calcolo del cedolino completo partendo dal lordo
        const lordo = parseFloat(data['lordo'] ?? data['stipendio'] ?? 0);
        this.payslip = computePayslip(lordo);
        this.loading = false;

        // Scroll automatico alla tabella dei risultati
        setTimeout(() => {
          const resultTable = document.querySelector('.result-table');
          if (resultTable) {
            resultTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },

      // Gestione errori (es. backend non risponde)
      error: err => {
        this.error = err.error?.error || 'Errore calcolo stipendio';
        this.loading = false;
      }
    });
  }
}
// Questo componente consente di calcolare e visualizzare il cedolino paga per un impiegato
// selezionato, mostrando dettagli come stipendio lordo, netto, tasse e contributi.