import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  protected username: string | null = null;

  ngOnInit(): void {
    this.username = this.getUsername();
    console.log(this.username);
  }

  getUsername(): string | null {
    const userData = localStorage.getItem('name');
    return userData ? userData : null;
  }

  deleteUser(): void {
    localStorage.removeItem('tokenKey');
    localStorage.removeItem('name');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.username = null;
  }
}
