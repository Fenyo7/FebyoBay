import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginDTO } from 'src/app/models/DTOs/login.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (!this.loginForm.value.username) {
      this.toastr.warning('Please give a username.');
      return;
    }

    if (!this.loginForm.value.password) {
      this.toastr.warning('Please give a password.');
      return;
    }

    const loginData: loginDTO = {
      Username: this.loginForm.value.username,
      Password: this.loginForm.value.password,
    };

    this.authService.login(loginData).subscribe(
      (response: any) => {
        // Store the JWT token
        localStorage.setItem('token', response.token);
        this.toastr.success(`Welcome, ${this.loginForm.value.username}!`);
        // Navigate to the items
        this.router.navigate(['/items']);
      },
      (error: any) => {
        if (error.status === 404) {
          this.toastr.error('User not found.');
        } else if (error.status === 401) {
          this.toastr.error('Wrong password.');
        } else if (error.status === 400) {
          this.toastr.error(
            'An error occurred during login. Please try again later.'
          );
          console.error(error.error.Details); // Log the detailed error message
        } else {
          this.toastr.error(
            'An unexpected error occurred. Please try again later.'
          );
          console.error(error);
        }
      }
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
