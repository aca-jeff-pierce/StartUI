import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<p>Home stub</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
