# ACA Agent Portal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an Angular 20 internal agent portal for American Credit Acceptance with a persistent shell layout and six lazily loaded feature sections (Impounds, ANT, Reinstatement, Svc Support, Insurance, Settlements).

**Architecture:** Feature-lazy monorepo shell — a single Angular app with a persistent authenticated shell (sidebar + header) and each of the six sections as lazily loaded standalone feature routes. Each feature owns its own components, services, and mock data. Signals manage all reactive state with `ChangeDetectionStrategy.OnPush` throughout.

**Tech Stack:** Angular 20, TypeScript (strict), TailwindCSS 4, Angular Router, Angular Signals, Jest, Angular Testing Library, Cypress

---

## Task 1: Scaffold Angular Project

**Files:**
- Create: `package.json`, `angular.json`, `tsconfig.json`, `tailwind.config.js`, `src/styles.css`

**Step 1: Create the Angular app**

```bash
cd c:\ReposGitHub\StartUI
npx @angular/cli@latest new aca-agent-portal --routing --style=css --strict --standalone --skip-tests
cd aca-agent-portal
```

**Step 2: Install TailwindCSS 4**

```bash
npm install tailwindcss @tailwindcss/vite
```

Add to `src/styles.css`:
```css
@import "tailwindcss";
```

**Step 3: Install testing dependencies**

```bash
npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/angular @testing-library/jest-dom @testing-library/user-event ts-jest
```

**Step 4: Configure Jest** — create `jest.config.ts` at project root:

```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

Update `package.json` scripts:
```json
"test": "jest",
"test:watch": "jest --watch"
```

**Step 5: Install Cypress**

```bash
npm install --save-dev cypress
```

Add to `package.json`:
```json
"e2e": "cypress open"
```

**Step 6: Verify scaffold compiles**

```bash
npm start
```
Expected: Angular dev server starts on http://localhost:4200 with no errors.

**Step 7: Commit**

```bash
git init
git add .
git commit -m "AOS-0001 Initialize Angular 20 project with TailwindCSS and test tooling"
```

---

## Task 2: Define App Routes and Shell Structure

**Files:**
- Modify: `src/app/app.routes.ts`
- Modify: `src/app/app.component.ts`
- Modify: `src/app/app.component.html`

**Step 1: Write failing test for app routes** — create `src/app/app.routes.spec.ts`:

```ts
import { APP_ROUTES } from './app.routes';

describe('app routes', () => {
  it('should define a login route', () => {
    const loginRoute = APP_ROUTES.find(r => r.path === 'login');
    expect(loginRoute).toBeDefined();
  });

  it('should define an authenticated shell route with all 6 sections', () => {
    const shellRoute = APP_ROUTES.find(r => r.path === '');
    expect(shellRoute).toBeDefined();
    expect(shellRoute?.children).toHaveLength(7); // home + 6 sections
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx jest src/app/app.routes.spec.ts --no-coverage
```
Expected: FAIL — `APP_ROUTES` not exported.

**Step 3: Implement routes** — replace `src/app/app.routes.ts`:

```ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { ShellComponent } from './core/layout/shell.component';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'impounds',
        loadComponent: () =>
          import('./features/impounds/impounds.component').then(m => m.ImpoundsComponent),
      },
      {
        path: 'ant',
        loadComponent: () =>
          import('./features/ant/ant.component').then(m => m.AntComponent),
      },
      {
        path: 'reinstatement',
        loadComponent: () =>
          import('./features/reinstatement/reinstatement.component').then(m => m.ReinstatementComponent),
      },
      {
        path: 'svc-support',
        loadComponent: () =>
          import('./features/svc-support/svc-support.component').then(m => m.SvcSupportComponent),
      },
      {
        path: 'insurance',
        loadComponent: () =>
          import('./features/insurance/insurance.component').then(m => m.InsuranceComponent),
      },
      {
        path: 'settlements',
        loadComponent: () =>
          import('./features/settlements/settlements.component').then(m => m.SettlementsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

Update `src/app/app.component.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
```

Update `src/app/app.config.ts` to use `APP_ROUTES`:
```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(APP_ROUTES)],
};
```

**Step 4: Run test to verify it passes**

```bash
npx jest src/app/app.routes.spec.ts --no-coverage
```
Expected: PASS

**Step 5: Commit**

```bash
git add .
git commit -m "AOS-0001 Add lazy-loaded app routes and shell structure"
```

---

## Task 3: Mock Auth Service and Guard

**Files:**
- Create: `src/app/core/auth/auth.service.ts`
- Create: `src/app/core/auth/auth.service.spec.ts`
- Create: `src/app/core/auth/auth.guard.ts`
- Create: `src/app/core/auth/auth.guard.spec.ts`
- Create: `src/app/core/auth/user.model.ts`

**Step 1: Define user model** — create `src/app/core/auth/user.model.ts`:

```ts
export interface AgentUser {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly initials: string;
}
```

**Step 2: Write failing tests** — create `src/app/core/auth/auth.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should start unauthenticated', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should authenticate any non-empty credentials', () => {
    service.login('jeff', 'any');
    expect(service.currentUser()).not.toBeNull();
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear user on logout', () => {
    service.login('jeff', 'any');
    service.logout();
    expect(service.currentUser()).toBeNull();
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npx jest src/app/core/auth/auth.service.spec.ts --no-coverage
```
Expected: FAIL

**Step 4: Implement AuthService** — create `src/app/core/auth/auth.service.ts`:

```ts
import { Injectable, signal, computed } from '@angular/core';
import { AgentUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AgentUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  login(username: string, _password: string): void {
    const name = username || 'Agent';
    const parts = name.trim().split(' ');
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
```

**Step 5: Run test to verify it passes**

```bash
npx jest src/app/core/auth/auth.service.spec.ts --no-coverage
```
Expected: PASS

**Step 6: Write and implement AuthGuard** — create `src/app/core/auth/auth.guard.ts`:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
```

**Step 7: Commit**

```bash
git add .
git commit -m "AOS-0001 Add MockAuthService with signals and AuthGuard"
```

---

## Task 4: Login Page Component

**Files:**
- Create: `src/app/features/login/login.component.ts`
- Create: `src/app/features/login/login.component.html`
- Create: `src/app/features/login/login.component.css`
- Create: `src/app/features/login/login.component.spec.ts`

**Step 1: Write failing test** — create `src/app/features/login/login.component.spec.ts`:

```ts
import { render, screen, fireEvent } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  it('should render the login form', async () => {
    await render(LoginComponent, { providers: [provideRouter([])] });
    expect(screen.getByLabelText(/username/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx jest src/app/features/login/login.component.spec.ts --no-coverage
```
Expected: FAIL

**Step 3: Implement login component**

`src/app/features/login/login.component.ts`:
```ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly username = signal('');
  protected readonly password = signal('');

  protected signIn(): void {
    if (this.username().trim()) {
      this.auth.login(this.username(), this.password());
      this.router.navigate(['/']);
    }
  }
}
```

`src/app/features/login/login.component.html`:
```html
<div class="min-h-screen flex items-center justify-center" style="background-color: #0A1628;">
  <div class="w-full max-w-md rounded-2xl p-8 shadow-2xl" style="background-color: #0F1F3D;">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-white">Agent Portal</h1>
      <p class="mt-1 text-sm" style="color: #8B9CB6;">American Credit Acceptance</p>
    </div>

    <form (ngSubmit)="signIn()" class="space-y-5">
      <div>
        <label for="username" class="block text-sm font-medium mb-1" style="color: #8B9CB6;">Username</label>
        <input
          id="username"
          type="text"
          [ngModel]="username()"
          (ngModelChange)="username.set($event)"
          name="username"
          class="w-full rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2"
          style="background-color: #162040; border: 1px solid #1e3060; --tw-ring-color: #F5A623;"
          placeholder="Enter your username"
          autocomplete="username"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium mb-1" style="color: #8B9CB6;">Password</label>
        <input
          id="password"
          type="password"
          [ngModel]="password()"
          (ngModelChange)="password.set($event)"
          name="password"
          class="w-full rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2"
          style="background-color: #162040; border: 1px solid #1e3060; --tw-ring-color: #F5A623;"
          placeholder="Enter your password"
          autocomplete="current-password"
        />
      </div>

      <button
        type="submit"
        class="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style="background-color: #F5A623; color: #0A1628;"
      >
        Sign In
      </button>
    </form>
  </div>
</div>
```

**Step 4: Run test to verify it passes**

```bash
npx jest src/app/features/login/login.component.spec.ts --no-coverage
```
Expected: PASS

**Step 5: Commit**

```bash
git add .
git commit -m "AOS-0001 Add Login page with ACA brand styling"
```

---

## Task 5: Shell Layout Component (Sidebar + Header)

**Files:**
- Create: `src/app/core/layout/shell.component.ts`
- Create: `src/app/core/layout/shell.component.html`
- Create: `src/app/core/layout/shell.component.css`
- Create: `src/app/core/layout/nav-item.model.ts`

**Step 1: Define nav item model** — create `src/app/core/layout/nav-item.model.ts`:

```ts
export interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: '/', icon: 'home' },
  { label: 'Impounds', route: '/impounds', icon: 'lock' },
  { label: 'ANT', route: '/ant', icon: 'clipboard-list' },
  { label: 'Reinstatement', route: '/reinstatement', icon: 'refresh' },
  { label: 'Svc Support', route: '/svc-support', icon: 'tool' },
  { label: 'Insurance', route: '/insurance', icon: 'shield' },
  { label: 'Settlements', route: '/settlements', icon: 'scale' },
];
```

**Step 2: Implement shell component**

`src/app/core/layout/shell.component.ts`:
```ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NAV_ITEMS } from './nav-item.model';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navItems = NAV_ITEMS;
  protected readonly currentUser = this.auth.currentUser;
  protected readonly sidebarCollapsed = signal(false);

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  protected signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
```

`src/app/core/layout/shell.component.html`:
```html
<div class="flex h-screen overflow-hidden" style="background-color: #0A1628;">

  <!-- Sidebar -->
  <aside
    class="flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden"
    [style.width]="sidebarCollapsed() ? '64px' : '240px'"
    style="background-color: #0F1F3D; border-right: 1px solid #1e3060;"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-4 py-5 border-b" style="border-color: #1e3060;">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
           style="background-color: #F5A623; color: #0A1628;">ACA</div>
      @if (!sidebarCollapsed()) {
        <span class="text-white font-semibold text-sm truncate">Agent Portal</span>
      }
      <button class="ml-auto text-gray-400 hover:text-white transition-colors" (click)="toggleSidebar()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            [attr.d]="sidebarCollapsed() ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'" />
        </svg>
      </button>
    </div>

    <!-- User info -->
    @if (currentUser(); as user) {
      <div class="flex items-center gap-3 px-4 py-4 border-b" style="border-color: #1e3060;">
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
             style="background-color: #F5A623; color: #0A1628;">{{ user.initials }}</div>
        @if (!sidebarCollapsed()) {
          <div class="min-w-0">
            <p class="text-white text-xs font-medium truncate">{{ user.name }}</p>
            <p class="text-xs truncate" style="color: #8B9CB6;">{{ user.role }}</p>
          </div>
        }
      </div>
    }

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
      @for (item of navItems; track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="sidebar-active"
          [routerLinkActiveOptions]="{ exact: item.route === '/' }"
          class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          [title]="sidebarCollapsed() ? item.label : ''"
        >
          <span class="w-5 h-5 flex-shrink-0 text-base leading-none">{{ getIcon(item.icon) }}</span>
          @if (!sidebarCollapsed()) {
            <span class="text-sm truncate">{{ item.label }}</span>
          }
        </a>
      }
    </nav>

    <!-- Bottom actions -->
    <div class="border-t py-3 px-2 space-y-0.5" style="border-color: #1e3060;">
      <button
        class="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
        (click)="signOut()"
        [title]="sidebarCollapsed() ? 'Sign Out' : ''"
      >
        <span class="w-5 h-5 flex-shrink-0">🚪</span>
        @if (!sidebarCollapsed()) {
          <span class="text-sm">Sign Out</span>
        }
      </button>
    </div>
  </aside>

  <!-- Main content -->
  <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
    <!-- Header -->
    <header class="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
            style="background-color: #0F1F3D; border-color: #1e3060;">
      <h2 class="text-white font-semibold text-base flex-1 truncate">American Credit Acceptance</h2>
      <div class="flex items-center gap-3">
        <button class="relative text-gray-400 hover:text-white transition-colors p-1">
          <span>🔔</span>
          <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style="background-color: #F5A623; color: #0A1628;">3</span>
        </button>
        @if (currentUser(); as user) {
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
               style="background-color: #F5A623; color: #0A1628;">{{ user.initials }}</div>
        }
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-auto">
      <router-outlet />
    </main>
  </div>
</div>
```

`src/app/core/layout/shell.component.css`:
```css
.sidebar-link {
  color: #8B9CB6;
}
.sidebar-link:hover {
  background-color: rgba(245, 166, 35, 0.08);
  color: #ffffff;
}
.sidebar-active {
  background-color: rgba(245, 166, 35, 0.12) !important;
  color: #F5A623 !important;
  border-left: 3px solid #F5A623;
}
```

Add `getIcon` helper to `shell.component.ts`:
```ts
protected getIcon(name: string): string {
  const icons: Record<string, string> = {
    home: '🏠', lock: '🔒', 'clipboard-list': '📋',
    refresh: '🔄', tool: '🛠', shield: '🛡', scale: '⚖️',
  };
  return icons[name] ?? '•';
}
```

**Step 3: Verify shell renders**

```bash
npm start
```
Navigate to http://localhost:4200 — should redirect to `/login`, log in, then see sidebar + header.

**Step 4: Commit**

```bash
git add .
git commit -m "AOS-0001 Add Shell layout with collapsible sidebar and header"
```

---

## Task 6: Shared StatCard Component

**Files:**
- Create: `src/app/shared/components/stat-card/stat-card.component.ts`
- Create: `src/app/shared/components/stat-card/stat-card.component.html`
- Create: `src/app/shared/components/stat-card/stat-card.component.spec.ts`

**Step 1: Write failing test** — create `src/app/shared/components/stat-card/stat-card.component.spec.ts`:

```ts
import { render, screen } from '@testing-library/angular';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  it('should display label and value', async () => {
    await render(StatCardComponent, {
      inputs: { label: 'Active', value: 47 },
    });
    expect(screen.getByText('Active')).toBeTruthy();
    expect(screen.getByText('47')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx jest src/app/shared/components/stat-card/stat-card.component.spec.ts --no-coverage
```
Expected: FAIL

**Step 3: Implement StatCard**

`src/app/shared/components/stat-card/stat-card.component.ts`:
```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly sublabel = input<string>('');
  readonly accentColor = input<string>('#F5A623');
}
```

`src/app/shared/components/stat-card/stat-card.component.html`:
```html
<div class="rounded-xl p-5 flex flex-col gap-1" style="background-color: #162040; border: 1px solid #1e3060;">
  <span class="text-xs font-medium uppercase tracking-wider" style="color: #8B9CB6;">{{ label() }}</span>
  <span class="text-3xl font-bold text-white">{{ value() }}</span>
  @if (sublabel()) {
    <span class="text-xs" style="color: #8B9CB6;">{{ sublabel() }}</span>
  }
  <div class="mt-2 h-0.5 rounded-full w-8" [style.background-color]="accentColor()"></div>
</div>
```

**Step 4: Run test to verify it passes**

```bash
npx jest src/app/shared/components/stat-card/stat-card.component.spec.ts --no-coverage
```
Expected: PASS

**Step 5: Commit**

```bash
git add .
git commit -m "AOS-0001 Add StatCard shared component"
```

---

## Task 7: Shared StatusBadge Component

**Files:**
- Create: `src/app/shared/components/status-badge/status-badge.component.ts`
- Create: `src/app/shared/components/status-badge/status-badge.component.html`
- Create: `src/app/shared/components/status-badge/status-badge.component.spec.ts`

**Step 1: Write failing test**

```ts
import { render, screen } from '@testing-library/angular';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  it('should render status text', async () => {
    await render(StatusBadgeComponent, { inputs: { status: 'Active' } });
    expect(screen.getByText('Active')).toBeTruthy();
  });
});
```

**Step 2: Implement StatusBadge**

`src/app/shared/components/status-badge/status-badge.component.ts`:
```ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeStatus = 'Active' | 'Pending' | 'Critical' | 'Escalated' | 'Completed' | 'Resolved' | 'Expired' | 'Voided' | 'Approved' | 'Denied' | 'Lapsed' | 'Open';

@Component({
  selector: 'app-status-badge',
  template: `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" [style]="badgeStyle()">{{ status() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();

  protected readonly badgeStyle = computed(() => {
    const colorMap: Record<string, { bg: string; color: string }> = {
      Active:    { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA' },
      Open:      { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA' },
      Approved:  { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
      Completed: { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
      Resolved:  { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
      Pending:   { bg: 'rgba(245,158,11,0.15)',  color: '#FCD34D' },
      Critical:  { bg: 'rgba(239,68,68,0.15)',   color: '#F87171' },
      Escalated: { bg: 'rgba(239,68,68,0.15)',   color: '#F87171' },
      Denied:    { bg: 'rgba(239,68,68,0.15)',   color: '#F87171' },
      Lapsed:    { bg: 'rgba(239,68,68,0.15)',   color: '#F87171' },
      Expired:   { bg: 'rgba(107,114,128,0.15)', color: '#9CA3AF' },
      Voided:    { bg: 'rgba(107,114,128,0.15)', color: '#9CA3AF' },
    };
    const colors = colorMap[this.status()] ?? { bg: 'rgba(107,114,128,0.15)', color: '#9CA3AF' };
    return `background-color: ${colors.bg}; color: ${colors.color};`;
  });
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "AOS-0001 Add StatusBadge shared component"
```

---

## Task 8: Activity Feed Service

**Files:**
- Create: `src/app/core/services/activity-feed.service.ts`
- Create: `src/app/core/services/activity-feed.service.spec.ts`
- Create: `src/app/core/services/activity.model.ts`

**Step 1: Define model** — create `src/app/core/services/activity.model.ts`:

```ts
export interface ActivityEntry {
  readonly id: string;
  readonly section: string;
  readonly action: string;
  readonly accountNumber: string;
  readonly timestamp: Date;
}
```

**Step 2: Write failing test**

```ts
import { TestBed } from '@angular/core/testing';
import { ActivityFeedService } from './activity-feed.service';

describe('ActivityFeedService', () => {
  let service: ActivityFeedService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(ActivityFeedService); });

  it('should start with mock activity entries', () => {
    expect(service.entries().length).toBeGreaterThan(0);
  });

  it('should prepend new entries on addEntry', () => {
    const initial = service.entries().length;
    service.addEntry({ section: 'Impounds', action: 'Released', accountNumber: 'ACA-001' });
    expect(service.entries().length).toBe(initial + 1);
    expect(service.entries()[0].action).toBe('Released');
  });
});
```

**Step 3: Implement ActivityFeedService**

```ts
import { Injectable, signal } from '@angular/core';
import { ActivityEntry } from './activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityFeedService {
  private readonly _entries = signal<ActivityEntry[]>([
    { id: '1', section: 'Impounds', action: 'Impound released', accountNumber: 'ACA-889231', timestamp: new Date(Date.now() - 2 * 60000) },
    { id: '2', section: 'Settlements', action: 'Settlement offer accepted', accountNumber: 'ACA-77102', timestamp: new Date(Date.now() - 14 * 60000) },
    { id: '3', section: 'Insurance', action: 'Insurance lapse flagged', accountNumber: 'ACA-44218', timestamp: new Date(Date.now() - 60 * 60000) },
  ]);

  readonly entries = this._entries.asReadonly();

  addEntry(partial: Pick<ActivityEntry, 'section' | 'action' | 'accountNumber'>): void {
    this._entries.update(prev => [{
      id: crypto.randomUUID(),
      ...partial,
      timestamp: new Date(),
    }, ...prev].slice(0, 50));
  }
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "AOS-0001 Add ActivityFeedService with signal-based feed"
```

---

## Task 9: Home Dashboard

**Files:**
- Create: `src/app/features/home/home.component.ts`
- Create: `src/app/features/home/home.component.html`
- Create: `src/app/features/home/home.component.spec.ts`

**Step 1: Write failing test**

```ts
import { render, screen } from '@testing-library/angular';
import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  it('should render all 6 section tiles', async () => {
    await render(HomeComponent, { providers: [provideRouter([])] });
    expect(screen.getByText('Impounds')).toBeTruthy();
    expect(screen.getByText('ANT')).toBeTruthy();
    expect(screen.getByText('Reinstatement')).toBeTruthy();
    expect(screen.getByText('Svc Support')).toBeTruthy();
    expect(screen.getByText('Insurance')).toBeTruthy();
    expect(screen.getByText('Settlements')).toBeTruthy();
  });
});
```

**Step 2: Implement HomeComponent**

`src/app/features/home/home.component.ts`:
```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

interface SectionTile {
  label: string;
  route: string;
  icon: string;
  metric1Label: string;
  metric1Value: number;
  metric2Label: string;
  metric2Value: number;
  health: 'good' | 'warn' | 'critical';
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, StatCardComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly auth = inject(AuthService);
  protected readonly feed = inject(ActivityFeedService);

  protected readonly today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  protected readonly sections: SectionTile[] = [
    { label: 'Impounds',      route: '/impounds',      icon: '🔒', metric1Label: 'Active',        metric1Value: 47, metric2Label: 'Critical',    metric2Value: 8,  health: 'critical' },
    { label: 'ANT',           route: '/ant',           icon: '📋', metric1Label: 'Pending',       metric1Value: 12, metric2Label: 'Escalated',   metric2Value: 3,  health: 'warn' },
    { label: 'Reinstatement', route: '/reinstatement', icon: '🔄', metric1Label: 'Open',          metric1Value: 31, metric2Label: 'Pend. Appr.', metric2Value: 5,  health: 'warn' },
    { label: 'Svc Support',   route: '/svc-support',   icon: '🛠', metric1Label: 'Open Tickets',  metric1Value: 18, metric2Label: 'SLA Breach',  metric2Value: 4,  health: 'critical' },
    { label: 'Insurance',     route: '/insurance',     icon: '🛡', metric1Label: 'Under Review',  metric1Value: 24, metric2Label: 'Lapsed',      metric2Value: 6,  health: 'warn' },
    { label: 'Settlements',   route: '/settlements',   icon: '⚖️', metric1Label: 'Offers Out',    metric1Value: 9,  metric2Label: 'Counter Off.', metric2Value: 2, health: 'good' },
  ];

  protected healthColor(health: SectionTile['health']): string {
    return health === 'good' ? '#22C55E' : health === 'warn' ? '#F59E0B' : '#EF4444';
  }

  protected relativeTime(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }
}
```

`src/app/features/home/home.component.html`:
```html
<div class="p-6 space-y-6">
  <!-- Greeting -->
  <div>
    <h1 class="text-xl font-semibold text-white">
      Good morning, {{ auth.currentUser()?.name }}
    </h1>
    <p class="text-sm mt-0.5" style="color: #8B9CB6;">{{ today }} — Your active queues across all sections</p>
  </div>

  <!-- Section Tiles Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    @for (section of sections; track section.route) {
      <div class="rounded-xl p-5 flex flex-col gap-4" style="background-color: #162040; border: 1px solid #1e3060;">
        <!-- Title row -->
        <div class="flex items-center gap-2">
          <span class="text-xl">{{ section.icon }}</span>
          <span class="text-white font-semibold text-sm">{{ section.label }}</span>
          <span class="ml-auto w-2 h-2 rounded-full" [style.background-color]="healthColor(section.health)"></span>
        </div>

        <!-- Metrics -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-2xl font-bold text-white">{{ section.metric1Value }}</p>
            <p class="text-xs mt-0.5" style="color: #8B9CB6;">{{ section.metric1Label }}</p>
          </div>
          <div>
            <p class="text-2xl font-bold" [style.color]="healthColor(section.health)">{{ section.metric2Value }}</p>
            <p class="text-xs mt-0.5" style="color: #8B9CB6;">{{ section.metric2Label }}</p>
          </div>
        </div>

        <!-- Link -->
        <a [routerLink]="section.route"
           class="text-xs font-medium transition-opacity hover:opacity-80"
           style="color: #F5A623;">
          Open Section →
        </a>
      </div>
    }
  </div>

  <!-- Activity Feed -->
  <div class="rounded-xl p-5" style="background-color: #162040; border: 1px solid #1e3060;">
    <h2 class="text-sm font-semibold text-white mb-4">Recent Activity</h2>
    <div class="space-y-3">
      @for (entry of feed.entries(); track entry.id) {
        <div class="flex items-start gap-3 text-sm">
          <span class="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style="background-color: #F5A623;"></span>
          <div class="flex-1 min-w-0">
            <span style="color: #8B9CB6;">{{ entry.action }} — </span>
            <span class="text-white font-medium">{{ entry.accountNumber }}</span>
          </div>
          <span class="text-xs flex-shrink-0" style="color: #8B9CB6;">{{ relativeTime(entry.timestamp) }}</span>
        </div>
      }
    </div>
  </div>
</div>
```

**Step 3: Commit**

```bash
git add .
git commit -m "AOS-0001 Add Home dashboard with section tiles and activity feed"
```

---

## Task 10: Impounds Feature Section

**Files:**
- Create: `src/app/features/impounds/impounds.component.ts`
- Create: `src/app/features/impounds/impounds.component.html`
- Create: `src/app/features/impounds/impounds.service.ts`
- Create: `src/app/features/impounds/impound.model.ts`
- Create: `src/app/features/impounds/impounds.service.spec.ts`

**Step 1: Define model** — create `src/app/features/impounds/impound.model.ts`:

```ts
export type ImpoundStatus = 'Active' | 'Released' | 'Pending' | 'Critical' | 'Escalated';

export interface Impound {
  readonly id: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly status: ImpoundStatus;
  readonly location: string;
  readonly daysInImpound: number;
  readonly assignedTo: string;
}
```

**Step 2: Write failing service test**

```ts
import { TestBed } from '@angular/core/testing';
import { ImpoundsService } from './impounds.service';

describe('ImpoundsService', () => {
  let service: ImpoundsService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(ImpoundsService); });

  it('should have mock impound data', () => {
    expect(service.impounds().length).toBeGreaterThan(0);
  });

  it('should compute stats correctly', () => {
    const stats = service.stats();
    expect(stats.active).toBeGreaterThanOrEqual(0);
    expect(stats.critical).toBeGreaterThanOrEqual(0);
  });
});
```

**Step 3: Implement ImpoundsService**

`src/app/features/impounds/impounds.service.ts`:
```ts
import { Injectable, signal, computed } from '@angular/core';
import { Impound, ImpoundStatus } from './impound.model';

@Injectable({ providedIn: 'root' })
export class ImpoundsService {
  private readonly _impounds = signal<Impound[]>([
    { id: '1', accountNumber: 'ACA-889231', customerName: 'Marcus Johnson',   status: 'Active',    location: 'Atlanta, GA',     daysInImpound: 5,  assignedTo: 'Jeff P.' },
    { id: '2', accountNumber: 'ACA-774102', customerName: 'Sarah Williams',   status: 'Critical',  location: 'Charlotte, NC',   daysInImpound: 18, assignedTo: 'Jeff P.' },
    { id: '3', accountNumber: 'ACA-554812', customerName: 'David Chen',       status: 'Pending',   location: 'Dallas, TX',      daysInImpound: 2,  assignedTo: 'Maria S.' },
    { id: '4', accountNumber: 'ACA-321004', customerName: 'Lisa Martinez',    status: 'Released',  location: 'Tampa, FL',       daysInImpound: 0,  assignedTo: 'Maria S.' },
    { id: '5', accountNumber: 'ACA-998127', customerName: 'James Thompson',   status: 'Escalated', location: 'Memphis, TN',     daysInImpound: 22, assignedTo: 'Jeff P.' },
    { id: '6', accountNumber: 'ACA-410055', customerName: 'Angela Davis',     status: 'Active',    location: 'Birmingham, AL',  daysInImpound: 7,  assignedTo: 'Carlos R.' },
  ]);

  readonly impounds = this._impounds.asReadonly();

  readonly stats = computed(() => {
    const all = this._impounds();
    return {
      active:    all.filter(i => i.status === 'Active').length,
      released:  all.filter(i => i.status === 'Released').length,
      pending:   all.filter(i => i.status === 'Pending').length,
      critical:  all.filter(i => i.status === 'Critical' || i.status === 'Escalated').length,
    };
  });

  updateStatus(id: string, status: ImpoundStatus): void {
    this._impounds.update(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }
}
```

**Step 4: Implement ImpoundsComponent**

`src/app/features/impounds/impounds.component.ts`:
```ts
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ImpoundsService } from './impounds.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { Impound } from './impound.model';

type FilterChip = 'All' | 'My Queue' | 'Critical' | 'Pending';

@Component({
  selector: 'app-impounds',
  imports: [StatCardComponent, StatusBadgeComponent],
  templateUrl: './impounds.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpoundsComponent {
  private readonly svc = inject(ImpoundsService);
  private readonly feedSvc = inject(ActivityFeedService);

  protected readonly stats = this.svc.stats;
  protected readonly activeFilter = signal<FilterChip>('All');
  protected readonly selectedRecord = signal<Impound | null>(null);

  protected readonly chips: FilterChip[] = ['All', 'My Queue', 'Critical', 'Pending'];

  protected readonly filteredImpounds = computed(() => {
    const filter = this.activeFilter();
    return this.svc.impounds().filter(i => {
      if (filter === 'All') return true;
      if (filter === 'My Queue') return i.assignedTo === 'Jeff P.';
      if (filter === 'Critical') return i.status === 'Critical' || i.status === 'Escalated';
      if (filter === 'Pending') return i.status === 'Pending';
      return true;
    });
  });

  protected selectRecord(record: Impound): void {
    this.selectedRecord.set(record);
  }

  protected closePanel(): void {
    this.selectedRecord.set(null);
  }

  protected release(record: Impound): void {
    this.svc.updateStatus(record.id, 'Released');
    this.feedSvc.addEntry({ section: 'Impounds', action: 'Impound released', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected escalate(record: Impound): void {
    this.svc.updateStatus(record.id, 'Escalated');
    this.feedSvc.addEntry({ section: 'Impounds', action: 'Impound escalated', accountNumber: record.accountNumber });
    this.closePanel();
  }
}
```

`src/app/features/impounds/impounds.component.html`:
```html
<div class="flex h-full">
  <!-- Main area -->
  <div class="flex-1 p-6 space-y-6 overflow-auto min-w-0">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-white">🔒 Impounds</h1>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <app-stat-card label="Active" [value]="stats().active" />
      <app-stat-card label="Released" [value]="stats().released" accentColor="#22C55E" />
      <app-stat-card label="Pending" [value]="stats().pending" accentColor="#F59E0B" />
      <app-stat-card label="Critical" [value]="stats().critical" accentColor="#EF4444" />
    </div>

    <!-- Filter chips -->
    <div class="flex gap-2 flex-wrap">
      @for (chip of chips; track chip) {
        <button
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          [style]="activeFilter() === chip
            ? 'background-color: #F5A623; color: #0A1628;'
            : 'background-color: #162040; color: #8B9CB6; border: 1px solid #1e3060;'"
          (click)="activeFilter.set(chip)"
        >{{ chip }}</button>
      }
    </div>

    <!-- Data table -->
    <div class="rounded-xl overflow-hidden" style="border: 1px solid #1e3060;">
      <table class="w-full text-sm">
        <thead style="background-color: #0F1F3D;">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style="color: #8B9CB6;">Account #</th>
            <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style="color: #8B9CB6;">Customer</th>
            <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style="color: #8B9CB6;">Status</th>
            <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style="color: #8B9CB6;">Location</th>
            <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style="color: #8B9CB6;">Days</th>
            <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style="color: #8B9CB6;">Assigned</th>
          </tr>
        </thead>
        <tbody>
          @for (item of filteredImpounds(); track item.id) {
            <tr
              class="border-t cursor-pointer transition-colors hover:bg-white/5"
              style="border-color: #1e3060;"
              [style.background-color]="selectedRecord()?.id === item.id ? 'rgba(245,166,35,0.06)' : ''"
              (click)="selectRecord(item)"
            >
              <td class="px-4 py-3 text-white font-mono text-xs">{{ item.accountNumber }}</td>
              <td class="px-4 py-3 text-white">{{ item.customerName }}</td>
              <td class="px-4 py-3"><app-status-badge [status]="item.status" /></td>
              <td class="px-4 py-3" style="color: #8B9CB6;">{{ item.location }}</td>
              <td class="px-4 py-3 text-white">{{ item.daysInImpound }}</td>
              <td class="px-4 py-3" style="color: #8B9CB6;">{{ item.assignedTo }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>

  <!-- Detail panel -->
  @if (selectedRecord(); as record) {
    <div class="w-80 flex-shrink-0 border-l p-6 flex flex-col gap-5 overflow-auto"
         style="background-color: #0F1F3D; border-color: #1e3060;">
      <div class="flex items-center justify-between">
        <h2 class="text-white font-semibold text-sm">Record Detail</h2>
        <button class="text-gray-400 hover:text-white text-lg leading-none" (click)="closePanel()">×</button>
      </div>

      <div class="space-y-3">
        <div>
          <p class="text-xs" style="color: #8B9CB6;">Account Number</p>
          <p class="text-white font-mono text-sm mt-0.5">{{ record.accountNumber }}</p>
        </div>
        <div>
          <p class="text-xs" style="color: #8B9CB6;">Customer</p>
          <p class="text-white text-sm mt-0.5">{{ record.customerName }}</p>
        </div>
        <div>
          <p class="text-xs" style="color: #8B9CB6;">Status</p>
          <div class="mt-1"><app-status-badge [status]="record.status" /></div>
        </div>
        <div>
          <p class="text-xs" style="color: #8B9CB6;">Location</p>
          <p class="text-white text-sm mt-0.5">{{ record.location }}</p>
        </div>
        <div>
          <p class="text-xs" style="color: #8B9CB6;">Days in Impound</p>
          <p class="text-white text-sm mt-0.5">{{ record.daysInImpound }} days</p>
        </div>
        <div>
          <p class="text-xs" style="color: #8B9CB6;">Assigned To</p>
          <p class="text-white text-sm mt-0.5">{{ record.assignedTo }}</p>
        </div>
      </div>

      <div class="space-y-2 mt-auto pt-4 border-t" style="border-color: #1e3060;">
        <button
          class="w-full py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style="background-color: #22C55E; color: white;"
          (click)="release(record)"
        >Release Impound</button>
        <button
          class="w-full py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style="background-color: #EF4444; color: white;"
          (click)="escalate(record)"
        >Escalate</button>
        <button
          class="w-full py-2 rounded-lg text-sm font-medium"
          style="background-color: #162040; color: #8B9CB6; border: 1px solid #1e3060;"
        >Add Note</button>
      </div>
    </div>
  }
</div>
```

**Step 5: Commit**

```bash
git add .
git commit -m "AOS-0001 Add Impounds feature section with queue table and detail panel"
```

---

## Tasks 11–15: Remaining Feature Sections (ANT, Reinstatement, Svc Support, Insurance, Settlements)

Each remaining section follows the exact same pattern as Impounds (Task 10). For each:

1. Create `<feature>.model.ts` with domain-specific status types and interface
2. Create `<feature>.service.ts` with `signal<T[]>(mockData)` and `computed()` stats
3. Create `<feature>.component.ts` with filter chips, detail panel, and primary actions
4. Create `<feature>.component.html` using the consistent 3-zone layout

**Section-specific details:**

### ANT (`src/app/features/ant/`)
- Model fields: `accountNumber`, `customerName`, `status: 'Pending' | 'Approved' | 'Denied' | 'Expired'`, `requestDate`, `requestType`, `assignedTo`
- Stats: `pending`, `approved`, `denied`, `expired`
- Chips: All | My Queue | Pending | Expired
- Actions: Approve, Deny, Request Docs

### Reinstatement (`src/app/features/reinstatement/`)
- Model fields: `accountNumber`, `customerName`, `status: 'Open' | 'Pending' | 'Completed' | 'Declined'`, `quoteAmount`, `dueDate`, `assignedTo`
- Stats: `open`, `pendingApproval`, `completed`, `declined`
- Chips: All | My Queue | Pending Approval | Open
- Actions: Calculate Quote, Approve, Decline

### Svc Support (`src/app/features/svc-support/`)
- Model fields: `ticketNumber`, `accountNumber`, `customerName`, `status: 'Open' | 'Pending' | 'Resolved' | 'Escalated'`, `category`, `slaBreach: boolean`, `assignedTo`
- Stats: `open`, `slaBreach`, `resolved`, `escalated`
- Chips: All | My Queue | SLA Breaching | Escalated
- Actions: Update Ticket, Resolve, Escalate

### Insurance (`src/app/features/insurance/`)
- Model fields: `accountNumber`, `customerName`, `status: 'Active' | 'Lapsed' | 'Pending' | 'CPI Applied'`, `insuranceProvider`, `expirationDate`, `cpiApplied: boolean`, `assignedTo`
- Stats: `active`, `lapsed`, `cpiApplied`, `pending`
- Chips: All | My Queue | Lapsed | CPI Applied
- Actions: Flag Lapse, Apply CPI, Clear

### Settlements (`src/app/features/settlements/`)
- Model fields: `accountNumber`, `customerName`, `status: 'Offer Out' | 'Counter Offer' | 'Accepted' | 'Expired' | 'Voided'`, `offerAmount`, `balanceOwed`, `expirationDate`, `assignedTo`
- Stats: `offersOut`, `counterOffers`, `accepted`, `expired`
- Chips: All | My Queue | Counter Offers | Accepted
- Actions: Send Offer, Counter, Accept, Void

**Commit after each section:**

```bash
git add . && git commit -m "AOS-0001 Add [Section] feature section"
```

---

## Task 16: Cypress E2E Test

**Files:**
- Create: `cypress/e2e/agent-workflow.cy.ts`

**Step 1: Configure Cypress** — create `cypress.config.ts`:

```ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
});
```

**Step 2: Write E2E test**

```ts
describe('ACA Agent Portal — Primary Workflow', () => {
  it('should allow an agent to log in, navigate to Impounds, release a record, and see activity update', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('Jeff Pierce');
    cy.get('input[name="password"]').type('password');
    cy.contains('button', 'Sign In').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Impounds').should('exist');
    cy.contains('Settlements').should('exist');

    cy.contains('a', 'Open Section').first().click();
    cy.url().should('include', '/impounds');

    cy.contains('td', 'ACA-889231').click();
    cy.contains('button', 'Release Impound').click();

    cy.visit('/');
    cy.contains('Impound released').should('exist');
  });
});
```

**Step 3: Run E2E test**

Start dev server in one terminal:
```bash
npm start
```
Run Cypress:
```bash
npx cypress run --spec cypress/e2e/agent-workflow.cy.ts
```
Expected: PASS

**Step 4: Final commit**

```bash
git add .
git commit -m "AOS-0001 Add Cypress E2E test for primary agent workflow"
```

---

## Task 17: CHANGELOG and Documentation

**Files:**
- Create: `CHANGELOG.md`
- Update: `documentation/plan/2026-02-24-aca-agent-portal-design.md` (mark as implemented)

**Step 1: Create CHANGELOG.md at project root**

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Angular 20 standalone application scaffold with TailwindCSS 4
- Mock authentication service and guard with signal-based state
- Login page with ACA brand styling
- Persistent shell layout with collapsible sidebar and header
- Home dashboard with 6 section summary tiles and activity feed
- Impounds feature section with queue table, stat cards, and detail panel
- ANT feature section
- Reinstatement feature section
- Svc Support feature section
- Insurance feature section
- Settlements feature section
- Shared StatCard and StatusBadge components
- Signal-based ActivityFeedService aggregating cross-section activity
- Jest unit tests for all services and components
- Cypress E2E test for primary agent workflow
```

**Step 2: Commit**

```bash
git add .
git commit -m "AOS-0001 Add CHANGELOG and mark design doc as implemented"
```

---

## Execution Options

Plan saved. Two execution options:

**1. Subagent-Driven (this session)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Parallel Session (separate)** — Open a new session with the executing-plans skill, batch execution with checkpoints.

Which approach would you prefer?
