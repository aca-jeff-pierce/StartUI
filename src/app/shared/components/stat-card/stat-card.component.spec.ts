import { render, screen } from '@testing-library/angular';
import { Component } from '@angular/core';
import { StatCardComponent } from './stat-card.component';

@Component({
  template: `<app-stat-card label="Active" [value]="47"></app-stat-card>`,
  imports: [StatCardComponent],
})
class HostLabelValue {}

@Component({
  template: `<app-stat-card label="Critical" [value]="8" sublabel="Needs immediate action"></app-stat-card>`,
  imports: [StatCardComponent],
})
class HostWithSublabel {}

@Component({
  template: `<app-stat-card label="Active" [value]="47"></app-stat-card>`,
  imports: [StatCardComponent],
})
class HostNoSublabel {}

describe('StatCardComponent', () => {
  it('should display label and value', async () => {
    await render(HostLabelValue);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('should display sublabel when provided', async () => {
    await render(HostWithSublabel);
    expect(screen.getByText('Needs immediate action')).toBeInTheDocument();
  });

  it('should not render sublabel when not provided', async () => {
    await render(HostNoSublabel);
    expect(screen.queryByText('Needs immediate action')).not.toBeInTheDocument();
  });
});
