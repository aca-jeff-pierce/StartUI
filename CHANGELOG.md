# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Angular 21 standalone application scaffolded with strict TypeScript, TailwindCSS 4 (PostCSS), Jest 29, and Cypress 15
- Lazy-loaded application routing with authenticated shell guard protecting all feature routes
- Mock authentication service and functional auth guard using Angular signals; designed for future Azure AD / Entra ID SSO integration
- Login page with ACA brand styling (deep navy, orange accent), accessible form fields, and signal-based state
- Persistent shell layout with collapsible sidebar navigation, user avatar, and notification bell; keyboard-accessible with `focus-visible` styles and `prefers-reduced-motion` media query
- Home dashboard displaying 6 section summary tiles with key metrics, health indicators, and a cross-section recent activity feed
- `StatCardComponent` — reusable metric display card with configurable accent color
- `StatusBadgeComponent` — color-coded inline status chip supporting 12 status variants
- `ActivityFeedService` — signal-based cross-section activity feed with 50-entry cap and mock seed data
- **Impounds** feature section: queue table, stat cards, filter chips (All, My Queue, Critical, Pending), slide-in detail panel with Release and Escalate actions
- **ANT** feature section: queue table with request type, filter chips (All, My Queue, Pending, Expired), Approve and Deny actions
- **Reinstatement** feature section: queue table with currency-formatted quote amounts, filter chips (All, My Queue, Pending, Open), Approve and Decline actions
- **Svc Support** feature section: queue table with SLA breach indicator column, filter chips (All, My Queue, SLA Breach, Escalated), Resolve and Escalate actions
- **Insurance** feature section: queue table with CPI applied indicator, filter chips (All, My Queue, Lapsed, CPI Applied), Apply CPI and Flag Lapse actions
- **Settlements** feature section: queue table with offer and balance amounts, filter chips (All, My Queue, Counter Offers, Accepted), Accept Offer, Counter, and Void actions
- Cypress E2E test suite covering login, home dashboard, section navigation, impound release workflow, and sidebar collapse/expand
- 70 Jest unit tests across 21 test suites covering all services, components, auth guard, and routing

### Technical Notes

- All state management via Angular signals (`signal()`, `computed()`) — no RxJS
- `ChangeDetectionStrategy.OnPush` applied to every component
- `inject()` function API used throughout — no constructor injection
- `input()` function API used for component inputs — no `@Input()` decorator
- TailwindCSS 4 configured via `@tailwindcss/postcss` (PostCSS approach for Angular's esbuild builder)
- Jest configured with `jest-preset-angular` transformer for Angular 21 ESM package compatibility
- All accessible: semantic HTML (`<nav>`, `<aside>`, `<main>`, `<dl>/<dt>/<dd>`), ARIA labels, `focus-visible` outlines, `aria-hidden` on decorative elements
