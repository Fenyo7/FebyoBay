import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { registerDTO } from 'src/app/models/DTOs/register.dto';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordLength: number = 6;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onRegister() {
    if (!this.registerForm.value.username) {
      this.toastr.warning('Please provide a username.');
      return;
    }

    if (!this.registerForm.value.email) {
      this.toastr.warning('Please provide an email address.');
      return;
    } else if (
      !this.registerForm.value.email.includes('@') ||
      !this.registerForm.value.email.includes('.')
    ) {
      this.toastr.warning('Please provide a valid email address.');
      return;
    }

    if (!this.registerForm.value.password) {
      this.toastr.warning('Please provide a password.');
      return;
    } else if (this.registerForm.value.password.length < this.passwordLength) {
      this.toastr.warning(`Your password needs 
      to be at least ${this.passwordLength} long.`);
      return;
    }

    const user: registerDTO = {
      Username: this.registerForm.value.username,
      Email: this.registerForm.value.email,
      Password: this.registerForm.value.password,
    };

    if (this.registerForm.valid) {
      this.authService.register(user).subscribe(
        (response: any) => {
          this.toastr.success(
            `Successful registration! Please log in to continue!`
          );
          this.router.navigate(['/login']);
        },
        (error: any) => {
          this.toastr.error('Registration failed.');
          console.log(error);
        }
      );
    }
  }
}
