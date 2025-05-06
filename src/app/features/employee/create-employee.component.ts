import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule }        from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../core/user.service';

@Component({
  standalone: true,
  selector: 'app-create-employee',
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  private subs = new Subscription();

  
  fields = [
    { key: 'type',              label: 'Tipo Utente',        type: 'text',     placeholder: 'stipendiato' },
    { key: 'email',             label: 'Email',              type: 'email',    placeholder: 'pippo@esempio.com' },
    { key: 'password',          label: 'Password',           type: 'password', placeholder: '' },
    { key: 'nome',              label: 'Nome',               type: 'text',     placeholder: 'Mario' },
    { key: 'cognome',           label: 'Cognome',            type: 'text',     placeholder: 'Rossi' },
    { key: 'telefono',          label: 'Telefono',           type: 'text',     placeholder: '3331234567' },
    { key: 'dipartimento',      label: 'Dipartimento',       type: 'text',     placeholder: 'IT' },
    { key: 'dataDiNascita',     label: 'Data di Nascita',    type: 'date',     placeholder: '' },
    { key: 'stipendioMensile',  label: 'Stipendio Mensile',  type: 'number',   placeholder: '' }
  ];

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    // Montiamo dinamicamente i formControl con validazione required
    const ctrls: any = {};
    this.fields.forEach(f => {
      ctrls[f.key] = [ f.key === 'type' ? 'stipendiato' : '', Validators.required ];
    });
    this.form = this.fb.group(ctrls);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const payload = this.form.value;

    this.subs.add(
      this.userSvc.createEmployee(payload).subscribe({
        next: res => {
          alert('✅ ' + res.message);
          this.form.reset({ type: 'stipendiato' });
          this.submitted = false;
          this.loading = false;
        },
        error: err => {
          this.error = err.error?.error || 'Errore creazione dipendente';
          this.loading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}