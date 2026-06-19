import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { getErrorMessage } from '../../../core/handlers/global-error.handler';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-product-form.component.html',
})
export class AdminProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  productId = '';
  loading = false;
  error = '';
  selectedFiles: File[] = [];

  materials = ['Ceramic', 'Copper', 'Stone', 'Stainless Steel', 'Fireclay', 'Granite Composite'];
  shapes = ['Rectangular', 'Round', 'Oval', 'Square', 'Farmhouse', 'Vessel'];

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    material: ['', Validators.required],
    color: ['', Validators.required],
    shape: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    dimensions: ['', Validators.required],
    weight: ['', Validators.required],
    featured: [false],
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.isEdit = !!this.productId;
    if (this.isEdit) {
      this.productService.getProduct(this.productId).subscribe({
        next: (res) => {
          const p = res.data;
          this.form.patchValue({
            name: p.name, description: p.description, price: p.price,
            material: p.material, color: p.color, shape: p.shape,
            stock: p.stock, dimensions: p.dimensions, weight: p.weight, featured: p.featured,
          });
        },
      });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.selectedFiles = Array.from(input.files);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    this.selectedFiles.forEach((file) => formData.append('images', file));

    const req = this.isEdit
      ? this.productService.adminUpdateProduct(this.productId, formData)
      : this.productService.adminCreateProduct(formData);

    req.subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (err) => { this.error = getErrorMessage(err); this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }
}
