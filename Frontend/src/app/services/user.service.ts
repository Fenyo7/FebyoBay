import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { updateEmailDTO } from '../models/DTOs/updateEmail.dto';
import { updateUsernameDTO } from '../models/DTOs/updateUsername.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:5068/api/User';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<User[]>(url);
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.baseUrl}/user/${id}`;
    return this.http.get<User>(url);
  }

  updateUsername(userUpdateDto: updateUsernameDTO): Observable<any> {
    const url = `${this.baseUrl}/updateUsername`;
    return this.http.put(url, userUpdateDto);
  }

  updateEmail(userUpdateDto: updateEmailDTO): Observable<any> {
    const url = `${this.baseUrl}/updateEmail`;
    return this.http.put(url, userUpdateDto);
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/delete/${userId}`;
    return this.http.delete(url);
  }
}
