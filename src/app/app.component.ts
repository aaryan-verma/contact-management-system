import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <!-- Sticky Header -->
    <header class="sticky top-0 z-50 bg-blue-600 text-white shadow-md">
      <div class="max-w-3xl mx-auto flex justify-between items-center p-4">
        <div class="cursor-pointer hover:opacity-80 transition-opacity"
             (click)="navigateHome()">
          <h1 class="text-xl md:text-2xl font-semibold">
            WowPe
          </h1>
          <p class="text-sm font-normal">Secure Contact Management for POS/UPI</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-green-500 px-2 py-1 rounded text-xs">Secure</span>
          <span class="bg-yellow-500 px-2 py-1 rounded text-xs">UPI Enabled</span>
        </div>
      </div>
    </header>

    <div class="min-h-screen bg-gray-100 p-4">
      <router-outlet></router-outlet>
    </div>
    <app-toast></app-toast>
  `
})
export class AppComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
} 