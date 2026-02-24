import 'zone.js';
import 'zone.js/testing';
import '@angular/compiler';
import '@testing-library/jest-dom';

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
