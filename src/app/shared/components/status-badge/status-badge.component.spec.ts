import { render, screen } from '@testing-library/angular';
import { Component } from '@angular/core';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  template: `<app-status-badge status="Active"></app-status-badge>`,
  imports: [StatusBadgeComponent],
})
class HostActive {}

@Component({
  template: `<app-status-badge status="Pending"></app-status-badge>`,
  imports: [StatusBadgeComponent],
})
class HostPending {}

@Component({
  template: `<app-status-badge status="Critical"></app-status-badge>`,
  imports: [StatusBadgeComponent],
})
class HostCritical {}

describe('StatusBadgeComponent', () => {
  it('should render the status text', async () => {
    await render(HostActive);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render Pending with correct data-status attribute', async () => {
    const { fixture } = await render(HostPending);
    const el = fixture.nativeElement.querySelector('[data-testid="status-badge"]');
    expect(el.getAttribute('data-status')).toBe('Pending');
  });

  it('should render Critical with correct data-status attribute', async () => {
    const { fixture } = await render(HostCritical);
    const el = fixture.nativeElement.querySelector('[data-testid="status-badge"]');
    expect(el.getAttribute('data-status')).toBe('Critical');
  });
});
