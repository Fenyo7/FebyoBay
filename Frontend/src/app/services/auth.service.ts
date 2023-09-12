import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

interface AuthResponse{
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private baseUrl = 'localhost:5068';

  constructor(private http: HttpClient) { }

  signIn(username: string, password: string): Observable<any> {
    const url = this.baseUrl;
    return this.http.post<AuthResponse>(url, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/register`;
    return this.http.post(url, {username, password});
  }

  getToken(): string {
    return localStorage.getItem('token') as string;
  }
}