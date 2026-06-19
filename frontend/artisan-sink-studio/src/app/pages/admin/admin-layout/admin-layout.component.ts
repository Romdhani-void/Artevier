import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="lg:w-56 shrink-0">
          <div class="card p-4 sticky top-24 glass-panel">
            <h2 class="font-display font-bold text-dark-50 mb-4 px-2">Admin Panel</h2>
            <nav class="space-y-1">
              @for (link of links; track link.path) {
                <a [routerLink]="link.path"
                  routerLinkActive="bg-primary-600/20 text-primary-400"
                  [routerLinkActiveOptions]="link.exact ? { exact: true } : { exact: false }"
                  class="block px-3 py-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-dark-50 transition text-sm">
                  {{ link.label }}
                </a>
              }
            </nav>
            <a routerLink="/" class="block mt-4 px-3 py-2 text-dark-500 hover:text-dark-300 text-sm">← Back to Store</a>
          </div>
        </aside>
        <div class="flex-1 min-w-0">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  links = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/products', label: 'Products', exact: false },
    { path: '/admin/products/new', label: 'Add Product', exact: false },
    { path: '/admin/inventory', label: 'Inventory', exact: false },
    { path: '/admin/orders', label: 'Orders', exact: false },
    { path: '/admin/customers', label: 'Customers', exact: false },
  ];
}
