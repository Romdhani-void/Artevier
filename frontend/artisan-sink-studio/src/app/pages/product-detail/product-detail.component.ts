import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';
import { Review } from '../../core/models/review.model';
import { getErrorMessage } from '../../core/handlers/global-error.handler';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, DatePipe, ReactiveFormsModule, FormsModule, ProductCardComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  productService = inject(ProductService);
  cartService = inject(CartService);
  reviewService = inject(ReviewService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  product = signal<Product | null>(null);
  related: Product[] = [];
  reviews: Review[] = [];
  selectedImage = signal(0);
  quantity = 1;
  loading = true;
  addingToCart = false;
  message = '';
  error = '';

  reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadProduct(params['slug']);
    });
  }

  loadProduct(slug: string): void {
    this.loading = true;
    this.productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.loading = false;
        this.loadRelated(res.data._id);
        this.loadReviews(res.data._id);
      },
      error: () => { this.loading = false; this.router.navigate(['/404']); },
    });
  }

  loadRelated(id: string): void {
    this.productService.getRelated(id).subscribe({ next: (res) => { this.related = res.data; } });
  }

  loadReviews(productId: string): void {
    this.reviewService.getReviews(productId).subscribe({ next: (res) => { this.reviews = res.data.reviews; } });
  }

  get images(): string[] {
    const p = this.product();
    if (!p?.images?.length) return [''];
    return p.images;
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.addingToCart = true;
    this.cartService.addItem(p._id, this.quantity).subscribe({
      next: () => { this.message = 'Added to cart!'; this.addingToCart = false; },
      error: (err) => { this.error = getErrorMessage(err); this.addingToCart = false; },
    });
  }

  submitReview(): void {
    const p = this.product();
    if (!p || this.reviewForm.invalid) return;
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    const { rating, comment } = this.reviewForm.value;
    this.reviewService.createReview(p._id, rating!, comment!).subscribe({
      next: () => {
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.loadReviews(p._id);
        this.message = 'Review submitted!';
      },
      error: (err) => { this.error = getErrorMessage(err); },
    });
  }
}
