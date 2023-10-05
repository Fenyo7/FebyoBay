import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { AddItemDTO } from '../models/DTOs/add-item.dto';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private baseUrl = `${environment.apiUrl}/Shop`;

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<Item[]> {
    const url = `${this.baseUrl}/items`;
    return this.http.get<Item[]>(url);
  }

  getItemById(id: number): Observable<Item> {
    const url = `${this.baseUrl}/item/${id}`;
    return this.http.get<Item>(url);
  }

  createItem(item: AddItemDTO): Observable<Item> {
    const url = `${this.baseUrl}/addItem`;
    return this.http.post<Item>(url, item);
  }

  editItem(id: number, item: AddItemDTO): Observable<Item> {
    const url = `${this.baseUrl}/item/${id}`;
    return this.http.put<Item>(url, item);
  }

  deleteItem(id: number): Observable<any> {
    const url = `${this.baseUrl}/item/${id}`;
    return this.http.delete(url);
  }

  buyItem(itemId: number): Observable<any> {
    const url = `${this.baseUrl}/buy/${itemId}`;
    return this.http.post(url, {});
  }
}
