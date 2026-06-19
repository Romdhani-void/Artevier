import { ApplicationRef, Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export type DisplayCurrency = 'EUR' | 'HUF';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly STORAGE_KEY = 'cuisine_currency';
  private appRef = inject(ApplicationRef);

  /** API prices are stored as EUR amounts */
  currency = signal<DisplayCurrency>(this.load());

  private load(): DisplayCurrency {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === 'HUF' || stored === 'EUR' ? stored : environment.defaultCurrency;
  }

  setCurrency(value: DisplayCurrency): void {
    this.currency.set(value);
    localStorage.setItem(this.STORAGE_KEY, value);
    this.appRef.tick();
  }

  toggle(): void {
    this.setCurrency(this.currency() === 'EUR' ? 'HUF' : 'EUR');
  }

  format(amountInEur: number | null | undefined): string {
    if (amountInEur == null || Number.isNaN(amountInEur)) return '';

    if (this.currency() === 'HUF') {
      const huf = Math.round(amountInEur * environment.hufPerEur);
      return new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0,
      }).format(huf);
    }

    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amountInEur);
  }
}
