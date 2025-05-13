import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { UserService, Employee } from '../../../core/user.service';
import { HoursService, Ora } from '../../assign-hours/services/hours.service';

@Component({
  standalone: true,
  selector: 'app-assign-multi-hours',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './assign-hours-multiple.component.html',
  styleUrls: ['./assign-hours-multiple.component.css']
})
export class AssignMultiHoursComponent implements OnInit {
  form!: FormGroup;
  employees: Employee[] = [];
  hours: Ora[] = [];
  loading = false;
  submitted = false;
  error: string | null = null;

  // Array manuale dei dipendenti selezionati
  selectedEmployees: number[] = [];

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private hrsSvc: HoursService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Includo il controllo 'dipendenti' per validazione
    this.form = this.fb.group({
      dipendenti: [[], Validators.required],
      ore:        [[], Validators.required],
      tipoOra:    ['normale', Validators.required]
    });

    // Carico dati
    this.userSvc.getAllImpiegati().subscribe(list => this.employees = list);
    this.hrsSvc.getAllWorkingHours().subscribe(list => this.hours = list);
  }

  /** Gestisce il toggle delle checkbox dipendenti */
  onEmployeeToggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const id = +checkbox.value;
    if (checkbox.checked) {
      this.selectedEmployees.push(id);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(x => x !== id);
    }
    // Aggiorno il valore nel form per la validazione
    this.form.get('dipendenti')?.setValue(this.selectedEmployees);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.form.invalid) return;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const idsDip = this.selectedEmployees;
    const idsOre = this.form.value.ore.map((o: any) => +o);
    const tipo   = this.form.value.tipoOra;

    console.log('payload multi-assign', { Lista_Id_Ore: idsOre, Lista_Id_Impiegati: idsDip, tipoOra: tipo });


    this.hrsSvc.assignMultipleHours(idsOre, idsDip, tipo)
      .subscribe({
        next: res => {
          alert(res.message ?? res.error ?? 'Assegnazione completata');
          if (res.message) {
            this.router.navigate(['/dashboard']);
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