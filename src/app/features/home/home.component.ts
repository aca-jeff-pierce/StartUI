import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';

interface SectionTile {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly metric1Label: string;
  readonly metric1Value: number;
  readonly metric2Label: string;
  readonly metric2Value: number;
  readonly health: 'good' | 'warn' | 'critical';
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly auth = inject(AuthService);
  protected readonly feed = inject(ActivityFeedService);

  protected readonly today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  protected readonly sections: readonly SectionTile[] = [
    {
      label: 'Impounds',
      route: '/impounds',
      icon: '🔒',
      metric1Label: 'Active',
      metric1Value: 47,
      metric2Label: 'Critical',
      metric2Value: 8,
      health: 'critical',
    },
    {
      label: 'ANT',
      route: '/ant',
      icon: '📋',
      metric1Label: 'Pending',
      metric1Value: 12,
      metric2Label: 'Escalated',
      metric2Value: 3,
      health: 'warn',
    },
    {
      label: 'Reinstatement',
      route: '/reinstatement',
      icon: '🔄',
      metric1Label: 'Open',
      metric1Value: 31,
      metric2Label: 'Pend. Appr.',
      metric2Value: 5,
      health: 'warn',
    },
    {
      label: 'Svc Support',
      route: '/svc-support',
      icon: '🛠',
      metric1Label: 'Open Tickets',
      metric1Value: 18,
      metric2Label: 'SLA Breach',
      metric2Value: 4,
      health: 'critical',
    },
    {
      label: 'Insurance',
      route: '/insurance',
      icon: '🛡',
      metric1Label: 'Under Review',
      metric1Value: 24,
      metric2Label: 'Lapsed',
      metric2Value: 6,
      health: 'warn',
    },
    {
      label: 'Settlements',
      route: '/settlements',
      icon: '⚖️',
      metric1Label: 'Offers Out',
      metric1Value: 9,
      metric2Label: 'Counter Off.',
      metric2Value: 2,
      health: 'good',
    },
  ];

  protected healthColor(health: SectionTile['health']): string {
    const colors: Record<SectionTile['health'], string> = {
      good: '#22C55E',
      warn: '#F59E0B',
      critical: '#EF4444',
    };
    return colors[health];
  }

  protected relativeTime(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }
}
