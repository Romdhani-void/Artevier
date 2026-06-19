import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../../core/services/currency.service';

@Pipe({ name: 'price', standalone: true, pure: false })
export class PricePipe implements PipeTransform {
  private currencyService = inject(CurrencyService);

  transform(value: number | null | undefined): string {
    return this.currencyService.format(value);
  }
}
