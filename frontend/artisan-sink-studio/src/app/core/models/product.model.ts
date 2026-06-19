export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  material: string;
  color: string;
  shape: string;
  stock: number;
  dimensions: string;
  weight: string;
  featured: boolean;
  images: string[];
  salesCount?: number;
  avgRating?: number;
  reviewCount?: number;
  createdAt?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  color?: string;
  shape?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popularity';
}

export interface FilterOptions {
  materials: string[];
  shapes: string[];
  colors: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}
