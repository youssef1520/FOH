import { Injectable }                 from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
import { Observable, Subject }        from 'rxjs';
import { tap }                        from 'rxjs/operators';
import { environment }                from '../../environments/environment';

export interface Task {
  id: number;
  title: string;
  description?: string;
  assigned_user_id: string;
  project_id: number;
  status: 'To Do' | 'In Progress' | 'Done';
  due_date?: string;
  project?: { name: string };
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly url = `${environment.apiUrl}/tasks`;

  /** Emits whenever a task is created / updated / deleted */
  private _refresh = new Subject<void>();
  refresh$         = this._refresh.asObservable();

  constructor(private http: HttpClient) {}

  /* ------------------- Queries ------------------- */
  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  get(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`);
  }

  /* ------------------- Commands ------------------ */
  create(data: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.url, data).pipe(
      tap(() => this._refresh.next())
    );
  }

  update(id: number, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, data).pipe(
      tap(() => this._refresh.next())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => this._refresh.next())
    );
  }
}