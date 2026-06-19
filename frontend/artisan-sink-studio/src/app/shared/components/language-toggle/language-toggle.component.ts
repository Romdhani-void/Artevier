import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  template: `
    <div class="glass-chip flex items-center p-0.5 gap-0.5" role="group" aria-label="Switch language">
      @for (option of options; track option) {
        <button
          type="button"
          (click)="setLanguage(option)"
          [class]="languageService.language() === option
            ? 'bg-accent text-dark-950 shadow-sm'
            : 'text-dark-400 hover:text-dark-100 hover:bg-white/5'"
          class="px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide transition-all">
          {{ languageService.t('language.' + option) }}
        </button>
      }
    </div>
  `,
})
export class LanguageToggleComponent {
  languageService = inject(LanguageService);
  options: Array<'fr' | 'hu'> = ['fr', 'hu'];

  setLanguage(value: 'fr' | 'hu'): void {
    this.languageService.setLanguage(value);
  }
}
