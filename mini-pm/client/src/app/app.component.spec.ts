import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { authInterceptor } from './core/auth.interceptor';

class StubAuthService {
  isLoggedIn = false;
  role: 'admin' | 'member' | null = null;
  token: string | null = null;
  logout(): void {}
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        { provide: StubAuthService, useClass: StubAuthService },
      ],
    }).compileComponents();
  });

  it('should create the root component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should expose the expected title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('Project Management Tool');
  });

  it('should render the logo inside the toolbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const logo = el.querySelector('.logo')?.textContent?.trim();
    expect(logo).toBe('FOH');
  });
});