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

  constructor(private http: HttpClient) { }

  signIn(username: string, password: string): Observable<any> {
    const url = 'localhost:5000';
    return this.http.post<AuthResponse>(url, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  getToken(): string {
    return localStorage.getItem('token') as string;
  }

  private getAuthHeaders(): HttpHeaders{
    const token = this.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
}