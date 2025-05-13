// src/app/features/assign-hours/assign-hours.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { UserService, Employee } from '../../../core/user.service';
import { HoursService, Ora }     from '../services/hours.service';

@Component({
  standalone: true,
  selector: 'app-assign-hours',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './assign-hours.component.html',
  styleUrls: ['./assign-hours.component.css']
})
export class AssignHoursComponent implements OnInit {
  form!: FormGroup;
  employees: Employee[] = [];
  hours:     Ora[]      = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb:      FormBuilder,
    private userSvc: UserService,
    private hrsSvc:  HoursService,
    private router:  Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email:   ['', [Validators.required, Validators.email]],
      oraId:   [null, Validators.required],
      tipoOra: ['normale', Validators.required]
    });

    // Carica i dipendenti
    this.userSvc.getAllImpiegati()
      .subscribe(list => this.employees = list);

    // Carica le ore
    this.hrsSvc.getAllWorkingHours()
      .subscribe(list => this.hours = list);
  }

  onSubmit(): void {
    this.error = null;
    if (this.form.invalid) {
      this.error = 'Compila tutti i campi';
      return;
    }

    this.loading = true;
    const { email, oraId, tipoOra } = this.form.value;

    // Trova impiegato dall'email
    const imp = this.employees.find(e => e.email === email);
    if (!imp) {
      this.error = 'Impiegato non valido';
      this.loading = false;
      return;
    }

    // Passa tipoOra così com'è ('normale' o 'straordinario')
    this.hrsSvc.assignSingleHour(oraId, imp.id, tipoOra)
      .subscribe({
        next: res => {
          alert(res.message ?? res.error ?? 'Operazione completata');
          if (res.message) {
            this.router.navigate(['/hours/assign']);
          } else {
            this.loading = false;
          }
        },
        error: err => {
          this.error = err.error?.message || 'Errore del server';
          this.loading = false;
        }
      });
  }
}