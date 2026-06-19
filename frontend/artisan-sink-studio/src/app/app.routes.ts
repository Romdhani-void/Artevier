import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:slug', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'orders/:id', canActivate: [authGuard], loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./pages/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'products/new', loadComponent: () => import('./pages/admin/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./pages/admin/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent) },
      { path: 'orders', loadComponent: () => import('./pages/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
      { path: 'inventory', loadComponent: () => import('./pages/admin/admin-inventory/admin-inventory.component').then(m => m.AdminInventoryComponent) },
      { path: 'customers', loadComponent: () => import('./pages/admin/admin-customers/admin-customers.component').then(m => m.AdminCustomersComponent) },
    ],
  },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: '404' },
];
