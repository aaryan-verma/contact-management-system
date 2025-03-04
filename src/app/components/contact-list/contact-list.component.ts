import { Component } from '@angular/core';
import { map, BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { ContactController } from '../../controllers/contact.controller';

type SortField = 'name' | 'email' | 'phone';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-contact-list',
  template: `
    <!-- Hero Section -->
    <div class="bg-blue-50 p-4 md:p-8 rounded-lg mb-8 text-center">
      <h2 class="text-2xl md:text-3xl font-semibold text-blue-800 mb-2 md:mb-4">Manage Your Payment Contacts</h2>
      <p class="text-sm md:text-base font-normal text-gray-600 mb-4 md:mb-6">Securely store and manage your UPI and payment contacts in one place</p>
      <div class="flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4">
        <div class="flex items-center justify-center gap-2">
          <lucide-icon name="Shield" class="text-green-500"></lucide-icon>
          <span>Secure Storage</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <lucide-icon name="Zap" class="text-yellow-500"></lucide-icon>
          <span>Fast Transactions</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <lucide-icon name="Users" class="text-blue-500"></lucide-icon>
          <span>Easy Management</span>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto">
      <!-- Sticky Controls Section -->
      <div class="sticky top-[72px] bg-gray-100 pt-4 pb-2 z-40 space-y-4">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <h1 class="text-xl md:text-2xl font-semibold">Contacts</h1>
          <button (click)="navigateToAdd()" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow">
            <lucide-icon name="UserPlus" [size]="20"></lucide-icon>
            Add Contact
          </button>
        </div>

        <!-- Search and Sort -->
        <div class="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <div class="relative">
            <lucide-icon name="Search" 
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                        [size]="20">
            </lucide-icon>
            <input type="text" 
                  placeholder="Search contacts..." 
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="searchTermChanged($event)" 
                  class="w-full p-3 pl-12 border rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
          </div>

          <!-- Sort Controls -->
          <div class="flex flex-wrap gap-3 items-center">
            <span class="text-gray-600 font-medium">Sort by:</span>
            <div class="flex flex-wrap gap-2">
              <button *ngFor="let field of sortFields" 
                      (click)="updateSort(field)"
                      class="px-4 py-2 rounded-full border transition-all"
                      [class.bg-blue-500]="currentSort.field === field"
                      [class.text-white]="currentSort.field === field"
                      [class.border-blue-500]="currentSort.field === field"
                      [class.hover:bg-blue-50]="currentSort.field !== field">
                {{ field | titlecase }}
                <span *ngIf="currentSort.field === field" class="ml-1">
                  {{ currentSort.direction === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact List Section -->
      <div class="mt-4 space-y-4">
        <app-contact-card 
          *ngFor="let contact of paginatedContacts$ | async" 
          [contact]="contact">
        </app-contact-card>

        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm" 
             *ngIf="(totalPages$ | async) as totalPages">
          <div class="text-gray-600">
            Showing <span class="font-medium">{{ currentPage * pageSize + 1 }}</span> - 
            <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, (totalContacts$ | async) || 0) }}</span>
            of <span class="font-medium">{{ totalContacts$ | async }}</span> contacts
          </div>
          <div class="flex gap-2">
            <button (click)="previousPage()"
                    [disabled]="currentPage === 0"
                    class="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button (click)="nextPage()"
                    [disabled]="currentPage >= totalPages - 1"
                    class="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- No contacts message -->
      <div *ngIf="(filteredContacts$ | async)?.length === 0" 
           class="text-center text-gray-500 mt-4">
        No contacts found
      </div>
    </div>
  `
})
export class ContactListComponent {
  searchTerm = '';
  private searchSubject = new BehaviorSubject<string>('');
  
  // Sorting
  sortFields: SortField[] = ['name', 'email', 'phone'];
  currentSort = { field: 'name' as SortField, direction: 'asc' as SortDirection };
  private sortSubject = new BehaviorSubject(this.currentSort);

  // Pagination
  pageSize = 5;
  private pageSubject = new BehaviorSubject<number>(0);
  currentPage = 0;
  Math = Math; // For template usage

  contacts$ = this.contactController.getAllContacts();
  
  filteredContacts$ = combineLatest([
    this.contacts$,
    this.searchSubject,
    this.sortSubject
  ]).pipe(
    map(([contacts, search, sort]) => {
      let filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(search.toLowerCase()) || 
        contact.phone.includes(search)
      );

      // Apply sorting
      filtered.sort((a, b) => {
        const aValue = a[sort.field].toLowerCase();
        const bValue = b[sort.field].toLowerCase();
        return sort.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

      return filtered;
    })
  );

  totalContacts$ = this.filteredContacts$.pipe(
    map(contacts => contacts.length)
  );

  totalPages$ = this.totalContacts$.pipe(
    map(total => Math.ceil(total / this.pageSize))
  );

  paginatedContacts$ = combineLatest([
    this.filteredContacts$,
    this.pageSubject
  ]).pipe(
    map(([contacts, page]) => 
      contacts.slice(
        page * this.pageSize,
        (page + 1) * this.pageSize
      )
    )
  );

  constructor(
    private contactController: ContactController,
    private router: Router
  ) {}

  searchTermChanged(term: string) {
    this.searchSubject.next(term);
    this.currentPage = 0;
    this.pageSubject.next(0);
  }

  updateSort(field: SortField) {
    if (this.currentSort.field === field) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = { field, direction: 'asc' };
    }
    this.sortSubject.next(this.currentSort);
    this.currentPage = 0;
    this.pageSubject.next(0);
  }

  nextPage() {
    this.currentPage++;
    this.pageSubject.next(this.currentPage);
  }

  previousPage() {
    this.currentPage--;
    this.pageSubject.next(this.currentPage);
  }

  navigateToAdd() {
    this.router.navigate(['/add']);
  }
} 