import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Services
  private readonly authSvc = inject(AuthService);
  private readonly router = inject(Router);
  
  // Form variables
  username: string = '';
  password: string = '';

  // Control variables
  isLoginFailed: boolean = false;

  // Error message
  errorMessage: string = '';

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras.state);
    if (navigation?.extras.state?.['isTokenInvalid']) {
      // If the user is redirected here because the token expired, show an error message
      this.isLoginFailed = true;
      this.errorMessage = 'Your session has expired. Please log in again.';
    }
}

  login() {
    this.authSvc.login(this.username, this.password).subscribe({
      next: (res) => {
        // If login is successful, save the token and navigate to the charts page
        localStorage.setItem('token', res.data.token);
        this.router.navigate(['/charts']);
      },
      error: (err) => {
        this.isLoginFailed = true;
      },
    });
  }
}
