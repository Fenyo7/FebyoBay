import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { registerDTO } from 'src/app/models/DTOs/register.dto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onRegister() {
    const user: registerDTO = {
      Username: this.registerForm.value.username,
      Email: this.registerForm.value.email,
      Password: this.registerForm.value.password
    }

    if (this.registerForm.valid) {
      this.authService
        .register(user)
        .subscribe(
          (response: any) => {
            console.log('Registration successful!', response);
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Registration failed:', error);
          }
        );
    }
  }
}
