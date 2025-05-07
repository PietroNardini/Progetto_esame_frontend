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
  changeForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMsg = '';
  successMsg = '';

  private token = '';

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.changeForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.changeForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';
    if (this.changeForm.invalid) return;
    this.loading = true;

    this.userSvc.changePassword(this.token, this.changeForm.value.password)
      .subscribe({
        next: resp => {
          if (resp.message === 'Password changed successfully') {
            this.successMsg = resp.message;
          } else {
            this.errorMsg = resp.message || 'Errore sconosciuto';
          }
          this.loading = false;
        },
        error: err => {
          this.errorMsg = err.error?.error || 'Errore di rete';
          this.loading = false;
        }
      });
  }
}