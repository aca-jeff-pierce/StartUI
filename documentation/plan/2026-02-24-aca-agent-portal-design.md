# ACA Internal Agent Portal — Design Document

**Date:** 2026-02-24  
**Project:** American Credit Acceptance (ACA) Internal Agent Portal  
**Status:** Approved  

---

## Table of Contents

1. [Overview](#overview)
2. [Users & Roles](#users--roles)
3. [Architecture Approach](#architecture-approach)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Routing](#routing)
7. [Shell Layout](#shell-layout)
8. [Brand & Visual Design](#brand--visual-design)
9. [Home Dashboard](#home-dashboard)
10. [Individual Section Dashboards](#individual-section-dashboards)
11. [Shared Components](#shared-components)
12. [State Management](#state-management)
13. [Authentication](#authentication)
14. [Testing Strategy](#testing-strategy)

---

## Overview

A greenfield Angular 20 internal portal for ACA agents to manage workflow queues across six operational domains: Impounds, ANT, Reinstatement, Svc Support, Insurance, and Settlements. The portal provides a unified, branded experience with a persistent navigation shell and per-section metrics dashboards.

---

## Users & Roles

The portal serves all internal agent roles:

- **Call center / collections agents** — frontline staff working queues
- **Supervisors / team leads** — managing agent workloads and escalations
- **Back-office specialists** — insurance analysts, legal/settlement staff

Role-based access control will be enforced via route guards. Initial implementation uses mock auth; production will integrate Azure AD / Entra ID SSO.

---

## Architecture Approach

**Feature-Lazy Monorepo Shell (Approach A)**

A single Angular application with a persistent authenticated shell and six lazily loaded feature routes — one per operational section. Each feature owns its own components, services, and mock data. The home dashboard aggregates summary data across all sections.

This approach is chosen for its balance of production-readiness, clean separation of concerns, and scalability without the overhead of a full Nx monorepo setup at this stage.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 20+ | Application framework |
| TypeScript | Latest (strict mode) | Language |
| TailwindCSS | 4 | Utility-first styling |
| Angular Router | Built-in | Lazy-loaded feature routes |
| Angular Signals | Built-in | Reactive state management |
| Jest | Latest | Unit testing |
| Angular Testing Library | Latest | Component DOM testing |
| Cypress | Latest | End-to-end testing |

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/                  # MockAuthService, AuthGuard
│   │   ├── layout/                # ShellComponent (sidebar + header)
│   │   └── services/              # NotificationService, ActivityFeedService
│   ├── shared/
│   │   └── components/            # Reusable UI components
│   ├── features/
│   │   ├── home/                  # Home dashboard (6-tile summary)
│   │   ├── impounds/              # Impounds feature module
│   │   ├── ant/                   # ANT feature module
│   │   ├── reinstatement/         # Reinstatement feature module
│   │   ├── svc-support/           # Svc Support feature module
│   │   ├── insurance/             # Insurance feature module
│   │   └── settlements/           # Settlements feature module
│   ├── app.routes.ts              # Root lazy route definitions
│   └── app.component.ts           # Root shell component
```

---

## Routing

| Path | Feature | Guard |
|---|---|---|
| `/login` | Mock Login Page | None |
| `/` | Home Dashboard | AuthGuard |
| `/impounds` | Impounds Dashboard | AuthGuard |
| `/ant` | ANT Dashboard | AuthGuard |
| `/reinstatement` | Reinstatement Dashboard | AuthGuard |
| `/svc-support` | Svc Support Dashboard | AuthGuard |
| `/insurance` | Insurance Dashboard | AuthGuard |
| `/settlements` | Settlements Dashboard | AuthGuard |

All authenticated routes are nested under the shell layout component. Unauthenticated users are redirected to `/login`.

---

## Shell Layout

### Sidebar (Persistent, Collapsible)

- ACA logo and "Agent Portal" title at the top
- Collapsible to icon-only mode for screen space efficiency
- Logged-in agent name, role, and avatar initials below logo
- Navigation links for all 6 sections plus Home
- Active route indicated by orange left border and subtle background tint
- Bottom section: notifications, settings, sign out

### Top Header Bar

- Section title with breadcrumb navigation
- Global account search bar (search by account number, name, or VIN) with debounce
- Notification bell with unread badge count
- Agent avatar chip with role label

### Responsive Behavior

- Desktop-first (internal tool assumption)
- Sidebar collapses to icon-only on smaller viewports

---

## Brand & Visual Design

| Token | Value | Usage |
|---|---|---|
| `navy-deep` | `#0A1628` | Primary page background |
| `navy-sidebar` | `#0F1F3D` | Sidebar background |
| `navy-surface` | `#162040` | Card and panel surfaces |
| `accent-orange` | `#F5A623` | Active states, CTAs, highlights |
| `text-primary` | `#FFFFFF` | Primary text |
| `text-muted` | `#8B9CB6` | Secondary/label text |
| `success` | `#22C55E` | Resolved, completed, active |
| `warning` | `#F59E0B` | Pending, attention needed |
| `danger` | `#EF4444` | Critical, escalated, lapsed |
| `neutral` | `#6B7280` | Expired, voided, inactive |

---

## Home Dashboard

The home dashboard is the agent's command center, providing at-a-glance status across all six operational sections.

### Layout

- Personalized greeting with current date
- 2-row grid of 3 section tiles each (6 total)
- Recent activity feed below the tile grid

### Section Tiles

Each tile contains:
- Section name and icon
- Two key metric counts (e.g., active queue count and critical/escalated count)
- Color-coded health indicator (green = healthy, amber = attention, red = critical)
- "Open Section" navigation link

### Recent Activity Feed

- Live-style feed of the agent's recent cross-section actions
- Each entry shows: action type, account number (clickable), and relative timestamp
- Powered by a shared `ActivityFeedService` using signals

---

## Individual Section Dashboards

Each of the six feature sections follows a consistent three-zone layout.

### Layout Zones

1. **Metrics Bar** — Row of stat cards showing key counts for that section
2. **Queue Table** — Filterable, sortable data table with pagination
3. **Detail Panel** — Slide-in right panel showing record details and contextual action buttons (opens on row click)

### Filter Chips

Horizontal chip bar above the table: All | My Queue | Escalated | Pending (labels vary per section)

### Section-Specific Configuration

| Section | Key Metrics | Primary Actions |
|---|---|---|
| **Impounds** | Active, Released, Pending Police Hold | Release, Escalate, Add Note |
| **ANT** | Pending, Approved, Denied, Expired | Approve, Deny, Request Docs |
| **Reinstatement** | Open, Pending Approval, Completed | Calculate Quote, Approve, Decline |
| **Svc Support** | Open Tickets, SLA Breaching, Resolved | Create Ticket, Update, Resolve |
| **Insurance** | Active, Lapsed, CPI Applied, Pending | Flag Lapse, Apply CPI, Clear |
| **Settlements** | Offers Out, Counters, Accepted, Expired | Send Offer, Counter, Accept, Void |

### Status Badge System

| Status | Color |
|---|---|
| Active | Blue |
| Pending | Amber |
| Critical / Escalated | Red |
| Completed / Resolved | Green |
| Expired / Voided | Gray |

---

## Shared Components

All reusable UI components live in `src/app/shared/components/`:

| Component | Purpose |
|---|---|
| `StatCardComponent` | Metric card with label, value, and optional trend indicator |
| `DataTableComponent` | Sortable, filterable table with pagination |
| `StatusBadgeComponent` | Color-coded status chip |
| `DetailPanelComponent` | Slide-in right panel for record detail and actions |
| `FilterChipsComponent` | Horizontal chip bar for queue filtering |
| `SearchBarComponent` | Global account search with debounce |
| `NotificationBellComponent` | Bell icon with unread badge count |
| `ConfirmDialogComponent` | Confirmation dialog for destructive actions |

---

## State Management

All state uses Angular Signals with `ChangeDetectionStrategy.OnPush` throughout.

Each feature section owns a dedicated signal-based service:

```ts
// Pattern used in each feature service
readonly items = signal<T[]>(mockData);
readonly filtered = computed(() => this.applyFilters(this.items()));
readonly stats = computed(() => this.calcStats(this.items()));
```

The shared `ActivityFeedService` (provided in root) aggregates recent agent actions across all sections and exposes them as a signal for the home dashboard feed.

---

## Authentication

**Initial Implementation: Mock Auth**

- `MockAuthService` with a `currentUser` signal containing agent name, role, and avatar initials
- `AuthGuard` (functional guard) protecting all feature routes
- `/login` page with a simple credential form — any input authenticates the user
- `currentUser` signal is `null` when unauthenticated, redirecting to `/login`

**Future:** Replace `MockAuthService` with Azure AD / Entra ID MSAL integration without changing the guard or shell contracts.

---

## Testing Strategy

| Layer | Tool | Scope |
|---|---|---|
| Unit | Jest | Services, signal logic, computed values |
| Component | Angular Testing Library | DOM rendering, inputs/outputs, interactions |
| E2E | Cypress | Full agent workflows: login → navigate → act |

**Primary E2E scenario:** Agent logs in → navigates to a section → selects a record from the queue → performs a primary action (e.g., release an impound) → activity feed updates on home dashboard.
