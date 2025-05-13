import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatSelectModule }    from '@angular/material/select';
import { MatButtonModule }    from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar }        from '@angular/material/snack-bar';

import { TaskService, Task }  from '../../../core/task.service';
import { ProjectService }     from '../../../core/project.service';
import { AuthService }        from '../../../core/auth.service';


interface UserOption { id: string; name: string; }
const STATIC_USERS: UserOption[] = [
  { id: '1', name: 'Alice Admin' },
  { id: '4', name: 'Bob Member' }
];

@Component({
  selector:    'app-task-form',
  standalone:  true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls:   ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  
  private fb    = inject(FormBuilder);
  private svc   = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router= inject(Router);
  private snack = inject(MatSnackBar);
  public  auth  = inject(AuthService);

 
  id?: number;
  users = STATIC_USERS;

  public projects = inject(ProjectService).getAll();

 
  form = this.fb.nonNullable.group({
    title:            ['', Validators.required],
    description:      [''],
    project_id:       0,
    assigned_user_id: '',
    status:           'To Do' as 'To Do' | 'In Progress' | 'Done',
    due_date:         ''
  });

  ngOnInit(): void {
    const tid = this.route.snapshot.paramMap.get('id');
    if (tid) {
      this.id = +tid;
      this.svc.get(this.id).subscribe(t => {
        this.form.patchValue({
          title:            t.title,
          description:      t.description ?? '',
          project_id:       t.project_id,
          assigned_user_id: t.assigned_user_id,
          status:           t.status,
          due_date:         t.due_date ? t.due_date.slice(0, 10) : ''
        });

        if (this.auth.role === 'member') {
          ['title','description','project_id','assigned_user_id','due_date']
            .forEach(ctrl => this.form.get(ctrl)?.disable());
        }
      });
    }
  }

  save(): void {
    const raw = this.form.getRawValue();

    const data: Partial<Task> = this.auth.role === 'member'
      ? { status: raw.status }
      : {
          title:            raw.title,
          description:      raw.description || undefined,
          project_id:       Number(raw.project_id),
          assigned_user_id: raw.assigned_user_id,
          status:           raw.status,
          due_date:         raw.due_date || undefined
        };

    const op$ = this.id
      ? this.svc.update(this.id, data)
      : this.svc.create(data);

    op$.subscribe({
      next: () => {
        this.snack.open(
          this.id ? 'Task updated ✔︎' : 'Task created ✔︎',
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/dashboard/tasks']);
      },
      error: err => {
        console.error('Task save error', err);
        const msg = err?.error?.message || 'Failed to save task';
        this.snack.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/tasks']);
  }
}