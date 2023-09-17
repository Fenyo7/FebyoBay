import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { updateEmailDTO } from 'src/app/models/DTOs/updateEmail.dto';
import { updateUsernameDTO } from 'src/app/models/DTOs/updateUsername.dto';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  id: number = 0;
  username: string = '';
  email: string = '';
  newUsername: string = '';
  newEmail: string = '';
  editUsername: boolean = false;
  editEmail: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.id = Number(localStorage.getItem('id')) || 0;
    this.username = localStorage.getItem('name') || '';

    this.userService.getUserById(this.id).subscribe(
      user => {
        console.log(user);
        this.email = user.email;
        console.log(`email: ${this.email}`);
      },
      error => {
        console.error('Error fetching user details:', error);
      }
    );

    
  }

  updateUsername() {
    if (this.id && this.newUsername) {
      const updateDto : updateUsernameDTO = { Id: this.id, Username: this.newUsername };
      this.userService.updateUsername(updateDto).subscribe(
        response => {
          console.log('Username updated successfully');
          this.username = this.newUsername;
          localStorage.setItem('name', this.newUsername);
          this.editUsername = false;
        },
        error => {
          console.error('Error updating username:', error);
        }
      );
    }
  }

  updateEmail() {
    if (this.id && this.newEmail) {
      const updateDto : updateEmailDTO = { Id: this.id, Email: this.newEmail };
      this.userService.updateEmail(updateDto).subscribe(
        response => {
          console.log('Email updated successfully');
          this.username = this.newUsername;
          this.editEmail = false;
        },
        error => {
          console.error('Error updating email:', error);
        }
      );
    }
  }

  deleteAccount() {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.userService.deleteUser(Number(userId)).subscribe(
        response => {
          console.log('Account deleted successfully');
          localStorage.clear();
          this.router.navigate(['/items']);
        },
        error => {
          console.error('Error deleting account:', error);
        }
      );
    }
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/items']);
  }
}
