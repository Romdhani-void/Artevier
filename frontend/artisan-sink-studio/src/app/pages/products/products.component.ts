import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product, FilterOptions } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products: Product[] = [];
  filterOptions: FilterOptions = { materials: [], shapes: [], colors: [] };
  loading = true;
  total = 0;
  pages = 1;
  page = 1;

  search = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  material = '';
  color = '';
  shape = '';
  sort = 'newest';

  private demoProducts: Product[] = [
    {
      _id: 'demo-1',
      slug: 'copper-farmhouse-sink',
      name: 'Copper Farmhouse Sink',
      description: 'A warm copper sink with hand-hammered detail and timeless farmhouse style.',
      price: 299.99,
      material: 'Copper',
      color: 'Antique Copper',
      shape: 'Farmhouse',
      stock: 12,
      dimensions: '33" L x 22" W x 10" D',
      weight: '24 lbs',
      featured: true,
      images: ['https://placehold.co/600x600/7c3aed/ffffff?text=Copper+Sink'],
      avgRating: 4.8,
      reviewCount: 18,
    },
    {
      _id: 'demo-2',
      slug: 'stone-round-vessel-sink',
      name: 'Stone Round Vessel Sink',
      description: 'A sleek stone vessel sink with a soft round profile for contemporary kitchens.',
      price: 239.99,
      material: 'Stone',
      color: 'Slate Gray',
      shape: 'Round',
      stock: 7,
      dimensions: '16" D x 6" H',
      weight: '30 lbs',
      featured: true,
      images: ['https://placehold.co/600x600/0f172a/ffffff?text=Stone+Sink'],
      avgRating: 4.7,
      reviewCount: 12,
    },
    {
      _id: 'demo-3',
      slug: 'fireclay-undermount-sink',
      name: 'Fireclay Undermount Sink',
      description: 'A refined fireclay sink with durable glaze and a luxurious matte finish.',
      price: 259.99,
      material: 'Fireclay',
      color: 'Ivory',
      shape: 'Rectangular',
      stock: 9,
      dimensions: '30" L x 18" W x 10" D',
      weight: '28 lbs',
      featured: false,
      images: ['https://placehold.co/600x600/f8fafc/0f172a?text=Fireclay+Sink'],
      avgRating: 4.9,
      reviewCount: 21,
    },
  ];

  ngOnInit(): void {
    this.productService.getFilterOptions().subscribe({
      next: (res) => { this.filterOptions = res.data; },
    });

    this.route.queryParams.subscribe((params) => {
      this.search = params['search'] || '';
      this.material = params['material'] || '';
      this.color = params['color'] || '';
      this.shape = params['shape'] || '';
      this.sort = params['sort'] || 'newest';
      this.page = parseInt(params['page'], 10) || 1;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({
      page: this.page, search: this.search, material: this.material,
      color: this.color, shape: this.shape, sort: this.sort as 'newest',
      minPrice: this.minPrice ?? undefined, maxPrice: this.maxPrice ?? undefined,
    }).subscribe({
      next: (res) => {
        if (
          res.data.products.length === 0 &&
          !this.search &&
          !this.material &&
          !this.color &&
          !this.shape &&
          this.minPrice == null &&
          this.maxPrice == null
        ) {
          this.products = this.demoProducts;
          this.total = this.demoProducts.length;
          this.pages = 1;
        } else {
          this.products = res.data.products;
          this.total = res.data.total;
          this.pages = res.data.pages;
        }
        this.loading = false;
      },
      error: () => {
        if (
          !this.search &&
          !this.material &&
          !this.color &&
          !this.shape &&
          this.minPrice == null &&
          this.maxPrice == null
        ) {
          this.products = this.demoProducts;
          this.total = this.demoProducts.length;
          this.pages = 1;
        }
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.router.navigate([], {
      queryParams: {
        search: this.search || null, material: this.material || null,
        color: this.color || null, shape: this.shape || null,
        sort: this.sort, page: 1,
      },
    });
  }

  clearFilters(): void {
    this.search = ''; this.material = ''; this.color = ''; this.shape = '';
    this.minPrice = null; this.maxPrice = null; this.sort = 'newest';
    this.applyFilters();
  }

  goToPage(p: number): void {
    this.router.navigate([], { queryParams: { page: p }, queryParamsHandling: 'merge' });
  }
}
