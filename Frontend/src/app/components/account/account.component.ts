import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { updateEmailDTO } from 'src/app/models/DTOs/updateEmail.dto';
import { updateUsernameDTO } from 'src/app/models/DTOs/updateUsername.dto';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { loginDTO } from 'src/app/models/DTOs/login.dto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  id: number = 0;
  username: string = '';
  email: string = '';
  newUsername: string = '';
  newEmail: string = '';
  password: string = '';

  editUsername: boolean = false;
  editEmail: boolean = false;
  deleteAccountPass: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id = Number(localStorage.getItem('id')) || 0;
    this.username = localStorage.getItem('name') || '';

    this.userService.getUserById(this.id).subscribe(
      (user: any) => {
        this.email = user.email;
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  updateUsername() {
    if (this.id) {
      if (!this.newUsername) {
        this.toastr.warning('Please provide the new username.');
        return;
      } else if (this.newUsername == this.username){
        this.toastr.warning('Your new username must be different.');
        return;
      }

      const updateDto: updateUsernameDTO = {
        Id: this.id,
        Username: this.newUsername,
      };
      this.userService.updateUsername(updateDto).subscribe(
        (response: any) => {
          this.toastr.success('Username updated successfully!');
          this.username = this.newUsername;
          localStorage.setItem('name', this.newUsername);
          this.editUsername = false;
        },
        (error: any) => {
          this.toastr.error('Could not change username.');
          console.error(error);
        }
      );
    }
  }

  updateEmail() {
    if (this.id) {
      if (!this.newEmail) {
        this.toastr.warning('Please provide the new email address.');
        return;
      } else if (
        !this.newEmail.includes('@') ||
        !this.newEmail.includes('.')
      ) {
        this.toastr.warning('Please provide a valid email address.');
        return;
      } else if (this.newEmail == this.email){
        this.toastr.warning('Your new username must be different.');
        return;
      }

      const updateDto: updateEmailDTO = { Id: this.id, Email: this.newEmail };
      this.userService.updateEmail(updateDto).subscribe(
        (response: any) => {
          this.toastr.success('Email address updated successfully!');
          this.username = this.newUsername;
          this.editEmail = false;
        },
        (error: any) => {
          this.toastr.error('Could not change email address.');
          console.error(error);
        }
      );
    }
  }

  deleteToggle() {
    if(this.deleteAccountPass){
      return;
    }
    this.deleteAccountPass = true;
    this.toastr.warning('Are you sure you want to delete your account? Please provide your password if you\'re sure.');
  }

  cancelDelete() {
    this.deleteAccountPass = false;
    this.password = '';
    this.toastr.success('Cancelled.');
  }

  confirmDelete() {
    if(!this.password){
      this.toastr.warning('You have failed to provide a password. Aborting deletion.');
      this.deleteAccountPass = false;
      return;
    } else {
      const loginData: loginDTO = {
        Username: this.username,
        Password: this.password,
      };

      this.authService.login(loginData).subscribe(
        (response: any) => {
          this.deleteAccount();
        },
        (error: any) => {
          this.deleteAccountPass = false;
          this.password = '';
          this.toastr.error('Incorrect password. Please try again.');
          return;
        }
      )
    }
  }

  deleteAccount(){
    const userId = localStorage.getItem('id');
    if (userId && this.deleteAccountPass) {
      this.userService.deleteUser(Number(userId)).subscribe(
        (response: any) => {
          this.toastr.success('User deleted successfully. Sorry to see you go!');
          localStorage.clear();
          this.router.navigate(['/items']);
        },
        (error: any) => {
          this.toastr.error('Could not delete account.');
          console.error('Error deleting account:', error);
        }
      );
    }
  }

  logOut() {
    this.toastr.success('Logged out. Bye-bye!');
    localStorage.clear();
    this.router.navigate(['/items']);
  }
}
