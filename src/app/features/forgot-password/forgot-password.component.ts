import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/user.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  loading = false;
  message = '';
  errorMsg = '';

  constructor(private userSvc: UserService) {}

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.errorMsg = '';

    this.userSvc.requestPasswordReset(this.email).subscribe({
      next: resp => {
        this.message = resp.message;
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err.error?.error || 'Errore di rete';
        this.loading = false;
      }
    });
  }
}