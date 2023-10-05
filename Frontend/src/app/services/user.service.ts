import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { updateEmailDTO } from '../models/DTOs/updateEmail.dto';
import { updateUsernameDTO } from '../models/DTOs/updateUsername.dto';
import { updateBalanceDTO } from '../models/DTOs/updateBalance.dto';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/User`;
  private balanceSubject = new BehaviorSubject<number>(0);
  public balance$ = this.balanceSubject.asObservable();

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

  getBalance(userId: number): Observable<any> {
    const url = `${this.baseUrl}/balance/${userId}`;
    return this.http.get(url);
  }

  updateBalance(updateBalance: updateBalanceDTO): Observable<any> {
    const url = `${this.baseUrl}/updateBalance`;
    return this.http.put(url, updateBalance);
  }

  updateBalanceInService(newBalance: number): void {
    this.balanceSubject.next(newBalance);
  }
}
