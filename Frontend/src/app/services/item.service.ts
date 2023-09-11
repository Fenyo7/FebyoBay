import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = 'localhost:5000';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<Item[]> {
    const url = `${this.baseUrl}/items`;
    return this.http.get<Item[]>(url);
  }

  getItemById(id: number): Observable<Item> {
    const url = `${this.baseUrl}/items/${id}`;
    return this.http.get<Item>(url);
  }
  
  createItem(item: Item, userId: number): Observable<Item> {
    const url = `${this.baseUrl}/items`;
    item.sellerId = userId;
    return this.http.post<Item>(url, item);
  }
  
  buyItem(id: number): Observable<any> {
    const url = `${this.baseUrl}/items/buy/${id}`;
    return this.http.post(url, {});
  }  
}
