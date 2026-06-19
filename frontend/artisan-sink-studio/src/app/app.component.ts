import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col relative">
      <div class="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl"></div>
        <div class="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-accent/10 blur-3xl"></div>
      </div>
      <app-header />
      <main class="flex-1 relative z-0">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class AppComponent {}
