import { Injectable, signal, computed } from '@angular/core';
import { AgentUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AgentUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  login(username: string, _password: string): void {
    const name = username.trim() || 'Agent';
    const parts = name.split(' ');
    const initials = parts.map(p => p[0]?.toUpperCase() ?? '').join('').slice(0, 2);
    this._currentUser.set({
      id: crypto.randomUUID(),
      name,
      role: 'Collections Agent',
      initials,
    });
  }

  logout(): void {
    this._currentUser.set(null);
  }
}
