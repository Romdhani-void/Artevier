import { Order } from './order.model';

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  pages: number;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  statusCounts: Record<string, number>;
  recentOrders: Order[];
  totalProducts?: number;
  totalUsers?: number;
}
