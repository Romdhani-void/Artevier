import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  languageService = inject(LanguageService);
  featured: Product[] = [];
  bestSellers: Product[] = [];
  loading = true;

  testimonials = [
    { name: 'Sarah M.', text: 'The copper farmhouse sink exceeded all expectations. True artisan quality!', rating: 5 },
    { name: 'James L.', text: 'Beautiful fireclay vessel sink. Installation was easy and it looks stunning.', rating: 5 },
    { name: 'Emily R.', text: 'Outstanding customer service and the granite composite sink is perfect for our kitchen.', rating: 5 },
  ];

  categories = [
    { name: 'Copper', icon: '🟤', material: 'Copper' },
    { name: 'Fireclay', icon: '⚪', material: 'Fireclay' },
    { name: 'Stone', icon: '🪨', material: 'Stone' },
    { name: 'Ceramic', icon: '🔵', material: 'Ceramic' },
    { name: 'Stainless Steel', icon: '⚙️', material: 'Stainless Steel' },
    { name: 'Granite', icon: '⬛', material: 'Granite Composite' },
  ];

  ngOnInit(): void {
    forkJoin([
      this.productService.getFeatured(),
      this.productService.getBestSellers(),
    ]).subscribe({
      next: ([featured, bestSellers]) => {
        this.featured = featured.data;
        this.bestSellers = bestSellers.data;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
