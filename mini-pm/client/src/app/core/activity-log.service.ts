import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ActivityLog {
  id: number;
  action: string;
  user: { name: string };
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private url = `${environment.apiUrl}/activity-log`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(this.url);
  }
}