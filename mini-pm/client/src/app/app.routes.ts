// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { roleGuard } from './core/role.guard';

import { ProjectsListComponent } from './features/projects/projects-list/projects-list.component';
import { ProjectFormComponent  } from './features/projects/project-form/project-form.component';

import { TasksListComponent } from './features/tasks/tasks-list/tasks-list.component';
import { TaskFormComponent  } from './features/tasks/task-form/task-form.component';

import { ActivityLogComponent     } from './features/activity-log/activity-log.component';
import { UserManagementComponent } from './features/user/user-management.component';

export const routes: Routes = [
  { path: '',       component: WelcomeComponent },
  { path: 'login',  component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ roleGuard('admin','member') ],
    children: [
      { path: 'projects',        component: ProjectsListComponent, canActivate: [roleGuard('admin')] },
      { path: 'projects/new',    component: ProjectFormComponent,  canActivate: [roleGuard('admin')] },
      { path: 'projects/:id/edit', component: ProjectFormComponent, canActivate: [roleGuard('admin')] },
      { path: 'tasks',           component: TasksListComponent,    canActivate: [roleGuard('admin','member')] },
      { path: 'tasks/new',       component: TaskFormComponent,     canActivate: [roleGuard('admin')] },
      { path: 'tasks/:id/edit',  component: TaskFormComponent,     canActivate: [roleGuard('admin','member')] },
      { path: 'activity-log',    component: ActivityLogComponent,  canActivate: [roleGuard('admin','member')] },
      { path: 'user',            component: UserManagementComponent, canActivate: [roleGuard('admin')] }
    ]
  },
  { path: '**', redirectTo: '' }
];