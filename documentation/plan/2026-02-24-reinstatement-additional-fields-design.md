# Design: Reinstatement Section — Additional Detail Panel Fields

**Date:** 2026-02-24  
**Branch:** feature/jp-test  
**Status:** Approved

---

## Summary

Add four new fields to the Reinstatement feature's detail panel. The queue table remains unchanged. The detail panel will be restructured into two labeled groups with a visual divider to improve organization and accommodate future field expansion.

---

## Scope

| File | Change |
|---|---|
| `reinstatement.model.ts` | Add 4 new readonly fields to the `Reinstatement` interface |
| `reinstatement.service.ts` | Populate all 6 mock records with values for the 4 new fields |
| `reinstatement.component.html` | Restructure the `<dl>` in the detail panel into 2 labeled groups |
| `reinstatement.component.css` | Add styles for group heading and divider |
| `reinstatement.component.spec.ts` | Update tests to reflect new model fields |
| `reinstatement.service.spec.ts` | Update mock data references if needed |

No changes to the queue table, filter chips, stat cards, or service logic.

---

## New Model Fields

Four fields added to the `Reinstatement` interface in `reinstatement.model.ts`:

```typescript
readonly policyType: string;    // e.g., 'Auto', 'Home', 'Life'
readonly lapseDate: string;     // ISO date string, e.g., '2026-01-15'
readonly requestDate: string;   // ISO date string, e.g., '2026-02-01'
readonly agentName: string;     // e.g., 'Susan B.'
```

---

## Detail Panel Layout — Grouped Sections

### Group 1: Policy Information

| Field | Source |
|---|---|
| Account Number | existing |
| Customer | existing |
| Policy Type | **new** |
| Agent Name | **new** |

### Group 2: Reinstatement Details

| Field | Source |
|---|---|
| Status | existing |
| Quote Amount | existing |
| Request Date | **new** |
| Lapse Date | **new** |
| Due Date | existing |
| Assigned To | existing |

Each group has a `<h3>` sub-heading with a bottom border divider line, consistent with the existing panel header styling.

---

## Mock Data

All 6 existing mock records in `reinstatement.service.ts` will be updated with realistic field values:

| Account | Policy Type | Lapse Date | Request Date | Agent Name |
|---|---|---|---|---|
| ACA-771001 | Auto | 2025-12-15 | 2026-01-10 | Susan B. |
| ACA-772002 | Home | 2026-01-05 | 2026-01-20 | Carlos R. |
| ACA-773003 | Life | 2025-11-30 | 2025-12-20 | Maria S. |
| ACA-774004 | Auto | 2026-01-20 | 2026-02-01 | Jeff P. |
| ACA-775005 | Home | 2025-10-01 | 2025-10-15 | Susan B. |
| ACA-776006 | Life | 2026-01-10 | 2026-01-25 | Carlos R. |

---

## Out of Scope

- No new table columns
- No changes to filter chips or status logic
- No changes to stat cards
- No new API calls or service methods
- No routing changes

---

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Where to add fields | Detail panel only | Keeps the queue table scannable; avoids 10-column layout |
| Panel layout | Grouped sections (Option B) | Better organization for future field additions |
| Group labels | "Policy Information" / "Reinstatement Details" | Natural domain groupings for insurance agents |
