import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../core/user.service';

@Component({
  standalone: true,
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  // FormGroup per la form di cambio password
  changeForm!: FormGroup;

  // Flag per indicare se la form è stata inviata (utilizzato per visualizzare messaggi di errore)
  submitted = false;

  // Flag per indicare lo stato di caricamento durante la chiamata al backend
  loading = false;

  // Messaggi di errore e successo da mostrare all’utente
  errorMsg = '';
  successMsg = '';

  // Token di reset password estratto dall’URL (parametro route)
  private token = '';

  constructor(
    private fb: FormBuilder,          // FormBuilder per costruire reactive form
    private userSvc: UserService,     // Servizio per chiamate API utente (changePassword)
    private router: Router,           // Router per eventuali navigazioni (non usato qui)
    private route: ActivatedRoute     // Per leggere parametri dalla route (es. token)
  ) {}

  ngOnInit(): void {
    // Legge il token dai parametri della route all’inizializzazione del componente
    this.token = this.route.snapshot.paramMap.get('token') || '';

    // Costruisce la form con un campo password con validazione: required e minimo 6 caratteri
    this.changeForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter per un accesso più comodo ai controlli del form (es. f.password)
  get f() { return this.changeForm.controls; }

  // Metodo chiamato al submit della form
  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';

    // Se la form non è valida (es. password mancante o troppo corta), esce subito
    if (this.changeForm.invalid) return;

    // Imposta lo stato di caricamento mentre si attende la risposta dal backend
    this.loading = true;

    // Chiama il servizio per cambiare la password, passando il token e la nuova password
    this.userSvc.changePassword(this.token, this.changeForm.value.password)
      .subscribe({
        next: resp => {
          // Se la risposta indica successo, mostra messaggio di conferma
          if (resp.message === 'Password changed successfully') {
            this.successMsg = resp.message;
          } else {
            // Altrimenti mostra un errore generico o il messaggio fornito
            this.errorMsg = resp.message || 'Errore sconosciuto';
          }
          this.loading = false;  // Ferma lo stato di caricamento
        },
        error: err => {
          // In caso di errore HTTP o di rete, mostra messaggio di errore
          this.errorMsg = err.error?.error || 'Errore di rete';
          this.loading = false;  // Ferma lo stato di caricamento
        }
      });
  }
}
