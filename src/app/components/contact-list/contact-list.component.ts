import { Component } from '@angular/core';
import { map, BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { ContactController } from '../../controllers/contact.controller';

type SortField = 'name' | 'email' | 'phone';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-contact-list',
  template: `
    <div class="max-w-3xl mx-auto space-y-4">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Contacts</h1>
        <button (click)="navigateToAdd()" 
                class="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <lucide-icon name="UserPlus" [size]="20"></lucide-icon>
          Add Contact
        </button>
      </div>

      <!-- Search and Sort -->
      <div class="space-y-4">
        <div class="relative">
          <lucide-icon name="Search" 
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                      [size]="20">
          </lucide-icon>
          <input type="text" 
                placeholder="Search contacts..." 
                [(ngModel)]="searchTerm"
                (ngModelChange)="searchTermChanged($event)" 
                class="w-full p-2 pl-12 border rounded">
        </div>

        <!-- Sort Controls -->
        <div class="flex gap-4 items-center">
          <span class="text-gray-600">Sort by:</span>
          <button *ngFor="let field of sortFields" 
                  (click)="updateSort(field)"
                  class="px-3 py-1 rounded border"
                  [class.bg-blue-50]="currentSort.field === field">
            {{ field | titlecase }}
            <span *ngIf="currentSort.field === field">
              {{ currentSort.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Contact List with Pagination -->
      <div class="space-y-4">
        <app-contact-card 
          *ngFor="let contact of paginatedContacts$ | async" 
          [contact]="contact">
        </app-contact-card>

        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-4" 
             *ngIf="(totalPages$ | async) as totalPages">
          <div class="text-gray-600">
            Showing {{ currentPage * pageSize + 1 }} - 
            {{ Math.min((currentPage + 1) * pageSize, (totalContacts$ | async) || 0) }}
            of {{ totalContacts$ | async }} contacts
          </div>
          <div class="flex gap-2">
            <button (click)="previousPage()"
                    [disabled]="currentPage === 0"
                    class="px-3 py-1 border rounded disabled:opacity-50">
              Previous
            </button>
            <button (click)="nextPage()"
                    [disabled]="currentPage >= totalPages - 1"
                    class="px-3 py-1 border rounded disabled:opacity-50">
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