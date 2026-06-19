import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/review.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './admin-customers.component.html',
})
export class AdminCustomersComponent implements OnInit {
  private adminService = inject(AdminService);
  users: User[] = [];
  search = '';
  loading = true;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getUsers(1, this.search).subscribe({
      next: (res) => { this.users = res.data.users; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  updateRole(userId: string, role: string): void {
    this.adminService.updateUserRole(userId, role).subscribe({ next: () => this.load() });
  }

  deleteUser(userId: string): void {
    if (!confirm('Delete this user?')) return;
    this.adminService.deleteUser(userId).subscribe({ next: () => this.load() });
  }
}
