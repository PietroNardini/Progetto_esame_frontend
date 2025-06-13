import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService, LoginResponse } from '../../../core/user.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // FormGroup per la form di login (email e password)
  loginForm!: FormGroup;

  // Flag per indicare se la form è stata inviata (utile per visualizzare messaggi di errore)
  submitted = false;

  // Flag per indicare lo stato di caricamento (loading)
  loading = false;

  // Messaggio di errore da mostrare all’utente in caso di problemi di login
  errorMsg = '';

  // Gestione delle sottoscrizioni per evitare memory leak
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,           // FormBuilder per costruire la form reattiva
    private userService: UserService,  // Servizio per effettuare la chiamata di login al backend
    private authService: AuthService,  // Servizio per gestire lo stato di autenticazione
    private router: Router              // Router per navigazione
  ) {}

  ngOnInit(): void {
    // Inizializza il form con campi email e password e relative validazioni
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],  // email obbligatoria e valida
      password: ['', Validators.required]                        // password obbligatoria
    });

    // Se l’utente è già loggato, naviga automaticamente alla dashboard
    this.subs.add(
      this.authService.isLoggedIn$.subscribe(logged => {
        if (logged) this.router.navigate(['/dashboard']);
      })
    );
  }

  // Getter per accesso semplificato ai controlli del form (es. f.email)
  get f() { return this.loginForm.controls; }

  // Metodo chiamato al submit del form di login
  onSubmit(): void {
    this.submitted = true;  // Segnala che la form è stata inviata
    this.errorMsg = '';     // Resetta eventuali messaggi di errore
    if (this.loginForm.invalid) return;  // Se la form non è valida, esce subito (evita chiamate API inutili)

    this.loading = true;  // Attiva indicatore di caricamento

    const { email, password } = this.loginForm.value;

    // Effettua chiamata al backend per login

    this.userService.login(email, password).subscribe({
      next: (resp: LoginResponse) => { // Se login ha successo e riceve dati utente
        if (resp.message === 'Login successful' && resp.userData) { // Se login ha successo e riceve dati utente
          this.authService.login({
            id: resp.userData.id,
            email: resp.userData.email,
            tipo: resp.userData.tipo,
            dipartimento: resp.userData.dipartimento
          });
          // Naviga alla dashboard dopo il login
          this.router.navigate(['/dashboard']);
        } else {
          // Se login fallisce, mostra messaggio di errore dal backend
          this.errorMsg = resp.message;
        }
        this.loading = false;  // Disattiva indicatore caricamento
      },
      error: err => {
        // Gestisce errori di rete o risposta non prevista
        this.errorMsg = err.error?.message || 'Errore di rete';
        this.loading = false;  // Disattiva indicatore caricamento
      }
    });
  }

  // Rimuove tutte le sottoscrizioni alla distruzione del componente per evitare memory leak
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
