import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser }                      from '@angular/common';
import { HttpClient }                             from '@angular/common/http';
import { Router }                                 from '@angular/router';
import { tap }                                    from 'rxjs/operators';

import { environment }                            from '../../environments/environment';

interface LoginResp {
  token: string;
  role : 'admin' | 'member';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _token = signal<string | null>(null);
  private _role  = signal<'admin' | 'member' | null>(null);

  private readonly isBrowser: boolean;

  constructor(
    private http   : HttpClient,
    private router : Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const t = localStorage.getItem('token');
      const r = localStorage.getItem('role') as 'admin' | 'member' | null;

      if (t && (r === 'admin' || r === 'member')) {
        this._token.set(t);
        this._role.set(r);
      }
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResp>(
        `${environment.apiUrl}/login`,
        { email, password }
      )
      .pipe(
        tap(({ token, role }) => {
          // store in signals
          this._token.set(token);
          this._role.set(role);

          // persist in localStorage (browser only)
          if (this.isBrowser) {
            localStorage.setItem('token', token);
            localStorage.setItem('role',  role);
          }

          // redirect based on role
          const defaultPath =
            role === 'admin' ? '/dashboard/projects' : '/dashboard/tasks';
          this.router.navigate([defaultPath]);
        })
      );
  }

  logout(): void {
    this._token.set(null);
    this._role.set(null);

    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    this.router.navigate(['/']);
  }

  /* --------------------------------------------------------------- */
  /*  Convenience getters                                            */
  /* --------------------------------------------------------------- */
  /** Raw JWT access token (or null) */
  get token(): string | null {
    return this._token();
  }

  /** Current role ('admin', 'member', or null when logged-out) */
  get role(): 'admin' | 'member' | null {
    return this._role();
  }

  /** Quick flag for templates / guards */
  get isLoggedIn(): boolean {
    return !!this._token();
  }

  /**
   * Decoded **user id** (the `sub` claim from the JWT) or `null`
   *
   * — Uses safe JSON parsing.<br>
   * — Computed lazily each time it’s requested (no extra state).
   */
  get userId(): string | null {
    if (!this._token()) return null;

    try {
      const payloadPart = this._token()!.split('.')[1];
      const decoded     = JSON.parse(atob(payloadPart));
      return decoded.sub ? String(decoded.sub) : null;
    } catch {
      return null;
    }
  }
}