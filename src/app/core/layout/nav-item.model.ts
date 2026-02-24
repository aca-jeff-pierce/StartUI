export interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home',          route: '/',              icon: '🏠' },
  { label: 'Impounds',      route: '/impounds',      icon: '🔒' },
  { label: 'ANT',           route: '/ant',           icon: '📋' },
  { label: 'Reinstatement', route: '/reinstatement', icon: '🔄' },
  { label: 'Svc Support',   route: '/svc-support',   icon: '🛠' },
  { label: 'Insurance',     route: '/insurance',     icon: '🛡' },
  { label: 'Settlements',   route: '/settlements',   icon: '⚖️' },
];
