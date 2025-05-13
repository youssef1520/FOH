import { Component, OnInit, OnDestroy }       from '@angular/core';
import { CommonModule }                        from '@angular/common';
import { Router, RouterLink, NavigationEnd }   from '@angular/router';
import { MatTableModule }                      from '@angular/material/table';
import { MatButtonModule }                     from '@angular/material/button';
import { Subscription, forkJoin }              from 'rxjs';
import { filter }                              from 'rxjs/operators';
import { TaskService, Task }                   from '../../../core/task.service';
import { ProjectService }                      from '../../../core/project.service';
import { AuthService }                         from '../../../core/auth.service';


interface TaskView extends Task {
  projectName?: string;
}

@Component({
  selector:    'app-tasks-list',
  standalone:  true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './tasks-list.component.html',
  styleUrls:   ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {
  tasks:            TaskView[] = [];
  displayedColumns: string[]   = [];

  private sub = new Subscription();

  constructor(
    private taskSvc:    TaskService,
    private projectSvc: ProjectService,
    private router:     Router,
    public  auth:       AuthService
  ) {}


  ngOnInit(): void {
    this.displayedColumns = this.auth.role === 'admin'
      ? ['title','project','assigned_user_id','status','due_date','actions']
      : ['title','project','status','due_date','actions'];

    this.loadTasks();

    this.sub.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.loadTasks())
    );

    this.sub.add(
      this.taskSvc.refresh$.subscribe(() => this.loadTasks())
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private loadTasks(): void {
    forkJoin({
      tasks:    this.taskSvc.getAll(),
      projects: this.projectSvc.getAll()
    }).subscribe(({ tasks, projects }) => {
      const projName = new Map(projects.map(p => [p.id, p.name]));

      let list: TaskView[] = tasks.map(t => ({
        ...t,
        projectName: projName.get(t.project_id) ?? '—'
      }));

      if (this.auth.role === 'member' && this.auth.userId) {
        list = list.filter(t => t.assigned_user_id === this.auth.userId);
      }

      this.tasks = list;
    });
  }


  edit(id: number): void {
    this.router.navigate(['/dashboard/tasks', id, 'edit']);
  }
}