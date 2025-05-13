import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProjectService, Project } from '../../../core/project.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  displayedColumns = ['name', 'status', 'start_date', 'end_date', 'actions'];
  private sub!: Subscription;

  constructor(private svc: ProjectService, private router: Router) {}

  ngOnInit() {
    this.loadProjects();
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadProjects());
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  loadProjects() {
    this.svc.getAll().subscribe(p => this.projects = p);
  }

  delete(id: number) {
    if (!confirm('Delete this project?')) return;
    this.svc.delete(id).subscribe(() => {
      this.projects = this.projects.filter(x => x.id !== id);
    });
  }
}