import { Component, inject } from '@angular/core';
import { CurrencyService, DisplayCurrency } from '../../../core/services/currency.service';

@Component({
  selector: 'app-currency-toggle',
  standalone: true,
  template: `
    <div class="glass-chip flex items-center p-0.5 gap-0.5" role="group" aria-label="Display currency">
      @for (option of options; track option) {
        <button
          type="button"
          (click)="setCurrency(option)"
          [class]="currencyService.currency() === option
            ? 'bg-primary-600/90 text-white shadow-sm'
            : 'text-dark-400 hover:text-dark-100 hover:bg-white/5'"
          class="px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide transition-all">
          {{ option }}
        </button>
      }
    </div>
  `,
})
export class CurrencyToggleComponent {
  currencyService = inject(CurrencyService);
  options: DisplayCurrency[] = ['EUR', 'HUF'];

  setCurrency(value: DisplayCurrency): void {
    this.currencyService.setCurrency(value);
  }
}
