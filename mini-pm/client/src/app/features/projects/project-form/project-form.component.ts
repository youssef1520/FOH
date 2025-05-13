import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProjectService, Project } from '../../../core/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  

  constructor(
    private fb: FormBuilder,
    private svc: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['Planned', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      this.svc.get(this.id).subscribe(p => {
        this.form.patchValue({
          ...p,
          start_date: this.formatDateInput(p.start_date),
          end_date: this.formatDateInput(p.end_date)
        });
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.snack.open('Please complete all required fields', 'Close', { duration: 3000 });
      return;
    }

    const raw = this.form.value;
    const data: Partial<Project> = {
      name: raw.name,
      description: raw.description,
      start_date: this.formatDate(raw.start_date),
      end_date: this.formatDate(raw.end_date),
      status: raw.status
    };

    const action = this.id
      ? this.svc.update(this.id, data)
      : this.svc.create(data);

    action.subscribe({
      next: () => {
        const msg = this.id ? 'Project updated successfully!' : 'Project created successfully!';
        this.snack.open(msg, 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard/projects']);
      },
      error: err => this.handleError(err)
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/projects']);
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  formatDateInput(date: string): string {
    return date ? date.split('T')[0] : '';
  }

  private handleError(err: any) {
    console.error('Project operation failed:', err);
    if (err?.status === 422 && err.error?.errors) {
      const messages = Object.values(err.error.errors).flat().join(' ');
      this.snack.open(`Validation error: ${messages}`, 'Close', { duration: 5000 });
    } else if (err?.status === 401 || err?.status === 403) {
      this.snack.open('Unauthorized. Please log in again.', 'Close', { duration: 5000 });
    } else {
      this.snack.open('Operation failed. Please try again.', 'Close', { duration: 3000 });
    }
  }
}
