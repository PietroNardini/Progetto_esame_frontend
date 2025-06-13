// Import dei moduli Angular necessari
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';          // Per template-driven forms (ngModel)
import { RouterModule } from '@angular/router';        // Per routing (in caso si voglia usare routerLink)
import { UserService } from '../../core/user.service'; // Servizio utente per richieste al backend

@Component({
  standalone: true,                                     // Il componente è standalone (non parte di un modulo)
  selector: 'app-forgot-password',                      // Nome del selettore HTML
  imports: [CommonModule, FormsModule, RouterModule],   // Moduli importati necessari al template
  templateUrl: './forgot-password.component.html',      // Template HTML associato
  styleUrls: ['./forgot-password.component.css']        // Fogli di stile associati
})
export class ForgotPasswordComponent {
  email: string = '';          // Campo email inserito dall'utente
  loading = false;             // Indica se è in corso la richiesta
  message = '';                // Messaggio di successo
  errorMsg = '';               // Messaggio di errore

  // Iniezione del servizio utente
  constructor(private userSvc: UserService) {}

  // Metodo chiamato al submit del form
  onSubmit() {
    this.loading = true;       // Mostra stato di caricamento
    this.message = '';         // Reset messaggi precedenti
    this.errorMsg = '';

    // Invoca il servizio per inviare la richiesta di reset password
    this.userSvc.requestPasswordReset(this.email).subscribe({
      next: resp => {
        // Mostra messaggio di conferma all'utente
        this.message = resp.message;
        this.loading = false;
      },
      error: err => {
        // Gestione dell'errore (es. email non trovata o problema server)
        this.errorMsg = err.error?.error || 'Errore di rete';
        this.loading = false;
      }
    });
  }
}
