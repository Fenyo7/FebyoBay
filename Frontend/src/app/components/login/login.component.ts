import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginDTO } from 'src/app/models/DTOs/login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    const loginData : loginDTO = {
      Username: this.loginForm.value.username,
      Password: this.loginForm.value.password
    };
  
    this.authService.login(loginData).subscribe(
      (response: any) => {
        // Store the JWT token
        localStorage.setItem('token', response.token);
        // Navigate to the items or dashboard page
        this.router.navigate(['/items']);
      },
      (error) => {
        console.error('Login failed:', error);
        // Handle login error, maybe show a message to the user
      }
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }  
}