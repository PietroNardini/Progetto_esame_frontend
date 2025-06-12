import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserService } from '../../../core/user.service';
import { AuthService } from '../../../core/auth.service';
import { computePayslip, Payslip } from '../../../core/payslip-calculator';

@Component({
  standalone: true,
  selector: 'app-payslip',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  private fb      = inject(FormBuilder);
  private userSvc = inject(UserService);
  private auth    = inject(AuthService);

  form!: FormGroup;
  meId: number | null              = null;
  rawResult: Record<string, any> | null = null;
  payslip?: Payslip;
  loading = false;
  error: string | null = null;

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
    // 1) Recupera l'ID utente
    this.meId = this.auth.getUserId();

    // 2) Inizializza il form (mese e anno possono essere uniti in un select unico o input)
    this.form = this.fb.group({
      empId: [this.meId, Validators.required],
      month: ['', Validators.required]  // es. "06"
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error   = null;
    this.rawResult = null;
    this.payslip   = undefined;

    const { empId, month } = this.form.value;
    this.userSvc.calculateSalary(+empId, month).subscribe({
      next: data => {
        this.rawResult = data;
        const lordo = parseFloat(data['lordo'] ?? data['stipendio'] ?? 0);
        this.payslip  = computePayslip(lordo);
        this.loading = false;
      },
      error: err => {
        this.error   = err.error?.error || 'Errore calcolo stipendio';
        this.loading = false;
      }
    });
  }
}