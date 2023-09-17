import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { loginDTO } from '../models/DTOs/login.dto';
import { registerDTO } from '../models/DTOs/register.dto';

interface AuthResponse{
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private baseUrl = 'http://localhost:5068/api/User'

  constructor(private http: HttpClient) { }

  login(user: loginDTO): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<AuthResponse>(url, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  register(user: registerDTO): Observable<any> {
    const url = `${this.baseUrl}/register`
    return this.http.post(url, user);
  }

  getToken(): string {
    return localStorage.getItem('token') as string;
  }
}