# Implementation Plan: Reinstatement Additional Detail Panel Fields

**Date:** 2026-02-24  
**Branch:** feature/jp-test  
**Design Doc:** `documentation/plan/2026-02-24-reinstatement-additional-fields-design.md`  
**Ticket:** AOS-0001

---

## Overview

Add four new fields (Policy Type, Lapse Date, Request Date, Agent Name) to the Reinstatement feature's detail panel. Restructure the panel `<dl>` into two labeled groups: "Policy Information" and "Reinstatement Details". No table changes.

---

## Implementation Steps

### Step 1 — Update the Model

**File:** `src/app/features/reinstatement/reinstatement.model.ts`

Add four new `readonly` fields to the `Reinstatement` interface:

```typescript
readonly policyType: string;
readonly lapseDate: string;
readonly requestDate: string;
readonly agentName: string;
```

---

### Step 2 — Update Mock Data in Service

**File:** `src/app/features/reinstatement/reinstatement.service.ts`

Populate all 6 existing mock records with values for the new fields:

| Account | policyType | lapseDate | requestDate | agentName |
|---|---|---|---|---|
| ACA-771001 | Auto | 2025-12-15 | 2026-01-10 | Susan B. |
| ACA-772002 | Home | 2026-01-05 | 2026-01-20 | Carlos R. |
| ACA-773003 | Life | 2025-11-30 | 2025-12-20 | Maria S. |
| ACA-774004 | Auto | 2026-01-20 | 2026-02-01 | Jeff P. |
| ACA-775005 | Home | 2025-10-01 | 2025-10-15 | Susan B. |
| ACA-776006 | Life | 2026-01-10 | 2026-01-25 | Carlos R. |

---

### Step 3 — Update the Detail Panel Template

**File:** `src/app/features/reinstatement/reinstatement.component.html`

Replace the single flat `<dl class="panel-fields">` with two grouped sections, each preceded by a `<h3>` group label:

**Structure:**

```html
<!-- Group 1: Policy Information -->
<h3 class="panel-group-label">Policy Information</h3>
<dl class="panel-fields">
  <!-- Account Number -->
  <!-- Customer -->
  <!-- Policy Type (new) -->
  <!-- Agent Name (new) -->
</dl>

<!-- Group 2: Reinstatement Details -->
<h3 class="panel-group-label">Reinstatement Details</h3>
<dl class="panel-fields">
  <!-- Status -->
  <!-- Quote Amount -->
  <!-- Request Date (new) -->
  <!-- Lapse Date (new) -->
  <!-- Due Date -->
  <!-- Assigned To -->
</dl>
```

---

### Step 4 — Update Panel CSS

**File:** `src/app/features/reinstatement/reinstatement.component.css`

Add styles for the group label:

```css
.panel-group-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, #6b7280);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  margin: 1rem 0 0.5rem;
}

.panel-group-label:first-of-type {
  margin-top: 0;
}
```

---

### Step 5 — Update Unit Tests

**File:** `src/app/features/reinstatement/reinstatement.component.spec.ts`

- Update any mock `Reinstatement` objects to include the 4 new fields
- Add assertions that the detail panel renders `policyType`, `lapseDate`, `requestDate`, and `agentName` when a record is selected
- Add assertion that group labels "Policy Information" and "Reinstatement Details" appear in the panel

**File:** `src/app/features/reinstatement/reinstatement.service.spec.ts`

- Update mock record references to include the 4 new fields

---

## Acceptance Criteria

- [ ] Detail panel displays two labeled groups: "Policy Information" and "Reinstatement Details"
- [ ] "Policy Information" group shows: Account Number, Customer, Policy Type, Agent Name
- [ ] "Reinstatement Details" group shows: Status, Quote Amount, Request Date, Lapse Date, Due Date, Assigned To
- [ ] Queue table is unchanged (6 columns only)
- [ ] All 6 mock records render without TypeScript errors
- [ ] Unit tests pass with no regressions
- [ ] ESLint passes with no new errors

---

## Files Changed

| File | Type of Change |
|---|---|
| `src/app/features/reinstatement/reinstatement.model.ts` | Add 4 fields to interface |
| `src/app/features/reinstatement/reinstatement.service.ts` | Add field values to 6 mock records |
| `src/app/features/reinstatement/reinstatement.component.html` | Restructure `<dl>` into 2 grouped sections |
| `src/app/features/reinstatement/reinstatement.component.css` | Add `.panel-group-label` styles |
| `src/app/features/reinstatement/reinstatement.component.spec.ts` | Update mocks and add group assertions |
| `src/app/features/reinstatement/reinstatement.service.spec.ts` | Update mock record objects |

---

## Estimated Effort

Small — all changes are isolated to the reinstatement feature. No routing, no service logic, no shared components affected. Estimated 1–2 hours.
