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
    loginForm!: FormGroup;
    submitted = false;
    loading   = false;
    errorMsg  = '';

    private subs = new Subscription();

    constructor(
      private fb:         FormBuilder,
      private userService: UserService,
      private authService: AuthService,
      private router:      Router
    ) {}

    ngOnInit(): void {
      this.loginForm = this.fb.group({
        email:    ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });

      // se sei già loggato, vai subito in dashboard
      this.subs.add(
        this.authService.isLoggedIn$.subscribe(logged => {
          if (logged) this.router.navigate(['/dashboard']);
        })
      );
    }

    get f() { return this.loginForm.controls; }

    onSubmit(): void {
      this.submitted = true;
      this.errorMsg  = '';
      if (this.loginForm.invalid) return;

      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.userService.login(email, password).subscribe({
  next: (resp: LoginResponse) => {
    if (resp.message === 'Login successful' && resp.userData) {
      // ora resp.userData contiene email, tipo e dipartimento
      this.authService.login({
         id:   resp.userData.id,
          email: resp.userData.email,
          tipo:  resp.userData.tipo,
          dipartimento: resp.userData.dipartimento});
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMsg = resp.message;
    }
    this.loading = false;
  },
        error: err => {
          this.errorMsg = err.error?.message || 'Errore di rete';
          this.loading = false;
        }
      });
    }

    ngOnDestroy(): void {
      this.subs.unsubscribe();
    }
  }