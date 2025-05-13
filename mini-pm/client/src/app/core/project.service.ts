import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'Planned'|'In Progress'|'Completed';
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private url = `${environment.apiUrl}/projects`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url);
  }
  get(id: number) {
    return this.http.get<Project>(`${this.url}/${id}`);
  }
  create(data: Partial<Project>) {
    return this.http.post<Project>(this.url, data);
  }
  update(id: number, data: Partial<Project>) {
    return this.http.put<Project>(`${this.url}/${id}`, data);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}