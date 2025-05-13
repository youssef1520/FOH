import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  /** GET /api/users */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  /** GET /api/users/:id */
  get(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /** POST /api/users */
  create(data: Partial<User>): Observable<User> {
    return this.http.post<User>(this.baseUrl, data);
  }

  /** PUT /api/users/:id */
  update(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  /** DELETE /api/users/:id */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}