import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../core/user.service';
import { User } from '../../core/models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['name', 'email', 'role', 'actions'];
  showForm = false;
  form!: FormGroup;
  isSaving = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['member', Validators.required]
    });

    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(
      u => this.users = u,
      err => {
        console.error('Failed to load users', err);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    );
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    this.userService.delete(id).subscribe(
      () => {
        this.loadUsers();
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
      },
      (err: HttpErrorResponse) => {
        console.error('Delete user error', err);
        const msg = this.extractErrorMessage(err);
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      }
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.form.reset({ role: 'member' });
  }

  save() {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }
    const value = this.form.getRawValue();
    this.isSaving = true;

    this.userService.create(value).subscribe({
      next: (newUser: User) => {
        this.loadUsers();
        this.toggleForm();
        this.snackBar.open('User added successfully', 'Close', { duration: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Add user error', err);
        const msg = this.extractErrorMessage(err);
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      }
    }).add(() => this.isSaving = false);
  }

  private extractErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 422 && err.error?.errors) {
      const msgs = Object.values(err.error.errors).flat();
      return msgs.join(', ');
    }
    if (err.error?.message) {
      return err.error.message;
    }
    if (typeof err.error === 'string') {
      return err.error.replace(/<[^>]+>/g, '').slice(0, 200) || 'Failed to add user';
    }
    return 'Failed to add user';
  }
}
