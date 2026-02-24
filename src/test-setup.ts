import 'zone.js';
import 'zone.js/testing';
import '@angular/compiler';
import '@testing-library/jest-dom';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, basename } from 'path';

if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.randomUUID === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID: () => `test-${Math.random().toString(36).slice(2)}` },
    writable: true,
  });
}
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

function findFileSync(dir: string, filename: string): string | null {
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        const found = findFileSync(full, filename);
        if (found !== null) return found;
      } else if (entry === filename) {
        return full;
      }
    }
  } catch { /* ignore permission errors */ }
  return null;
}

// Resolve Angular component external resources (templateUrl, styleUrl) for Jest/Node environment
beforeEach(async () => {
  await resolveComponentResources((url: string) => {
    const filename = basename(url);
    const srcDir = resolve(process.cwd(), 'src');
    const filePath = findFileSync(srcDir, filename);
    const content = filePath ? readFileSync(filePath, 'utf-8') : '';
    return Promise.resolve({ text: () => Promise.resolve(content) });
  });
});
