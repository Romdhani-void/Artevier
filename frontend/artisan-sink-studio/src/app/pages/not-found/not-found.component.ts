import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 class="font-display text-8xl font-bold text-dark-800">404</h1>
      <p class="text-xl text-dark-300 mb-6">Page not found</p>
      <p class="text-dark-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <a routerLink="/" class="btn-primary">Back to Home</a>
    </div>
  `,
})
export class NotFoundComponent {}
