import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type StatusColor = { bg: string; color: string };

const STATUS_COLORS: Record<string, StatusColor> = {
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

const DEFAULT_COLOR: StatusColor = { bg: 'rgba(107,114,128,0.15)', color: '#9CA3AF' };

@Component({
  selector: 'app-status-badge',
  template: `
    <span
      class="status-badge"
      data-testid="status-badge"
      [attr.data-status]="status()"
      [style.background-color]="colors().bg"
      [style.color]="colors().color"
    >{{ status() }}</span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  protected readonly colors = computed(() => STATUS_COLORS[this.status()] ?? DEFAULT_COLOR);
}
