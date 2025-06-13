// Import di base Angular e RxJS
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Servizio per interagire con utenti/dipendenti
import { UserService } from '../../core/user.service';

@Component({
  standalone: true,
  selector: 'app-create-employee',                          // Selettore del componente (HTML)
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ], // Moduli richiesti
  templateUrl: './create-employee.component.html',          // Template HTML
  styleUrls: ['./create-employee.component.css']            // CSS del componente
})
export class CreateEmployeeComponent implements OnInit, OnDestroy {
  form!: FormGroup;              // Oggetto reattivo per il form
  submitted = false;             // Indica se l’utente ha premuto "submit"
  loading = false;               // Stato di caricamento per disabilitare UI
  error = '';                    // Messaggio di errore
  private subs = new Subscription();  // Per gestire e pulire le sottoscrizioni RxJS

  // Lista dei campi del form per generazione dinamica dei controlli
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
    private fb: FormBuilder,         // Iniezione form builder reattivo
    private userSvc: UserService     // Iniezione servizio per utenti
  ) {}

  ngOnInit(): void {
    // In fase di inizializzazione, crea dinamicamente i form controls con Validators.required
    const ctrls: any = {};
    this.fields.forEach(f => {
      // Valore predefinito per il campo 'type', altrimenti vuoto
      ctrls[f.key] = [ f.key === 'type' ? 'stipendiato' : '', Validators.required ];
    });
    this.form = this.fb.group(ctrls); // Crea il form group completo
  }

  // Metodo chiamato alla submit del form
  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Se il form è invalido, non invia nulla
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const payload = this.form.value; // Recupera i dati del form

    // Chiamata al backend per creare un nuovo dipendente
    this.subs.add(
      this.userSvc.createEmployee(payload).subscribe({
        next: res => {
          alert('✅ ' + res.message);                     // Mostra conferma all'utente
          this.form.reset({ type: 'stipendiato' });      // Reset form con default 'type'
          this.submitted = false;
          this.loading = false;
        },
        error: err => {
          this.error = err.error?.error || 'Errore creazione dipendente'; // Messaggio di errore
          this.loading = false;
        }
      })
    );
  }

  // Pulizia delle sottoscrizioni per evitare memory leak
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
