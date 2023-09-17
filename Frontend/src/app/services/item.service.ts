import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { AddItemDTO } from '../models/DTOs/add-item.dto';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = 'http://localhost:5068/api/Shop';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<Item[]> {
    const url = `${this.baseUrl}/items`;
    return this.http.get<Item[]>(url);
  }

  getItemById(id: number): Observable<Item> {
    const url = `${this.baseUrl}/item/${id}`;
    return this.http.get<Item>(url);
  }
  
  createItem(item : AddItemDTO): Observable<Item> {
    const url = `${this.baseUrl}/addItem`;
    return this.http.post<Item>(url, item);
  }
  
  buyItem(id: number): Observable<any> {
    const url = `${this.baseUrl}/buy/${id}`;
    return this.http.post(url, {});
  }  
}
