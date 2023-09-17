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
  }

  getUsername(): string | null {
    const userData = localStorage.getItem('name');
    return userData ? userData : null;
  }

  deleteUser(): void {
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    this.username = null;
  }
}
