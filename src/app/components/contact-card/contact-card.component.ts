import { Component, Input } from '@angular/core';
import { Contact } from '../../models/contact.interface';
import { ContactController } from '../../controllers/contact.controller';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-card',
  template: `
    <div class="bg-white p-6 rounded shadow mb-4">
      <div class="flex justify-between">
        <div>
          <h3 class="font-medium text-lg mb-2">{{contact.name}}</h3>
          <div class="text-gray-600 space-y-2">
            <div class="flex items-center gap-3">
              <lucide-icon name="Mail" [size]="16"></lucide-icon>
              {{contact.email}}
            </div>
            <div class="flex items-center gap-3">
              <lucide-icon name="Phone" [size]="16"></lucide-icon>
              {{contact.phone}}
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button (click)="navigateToEdit()" class="p-2 hover:text-blue-500">
            <lucide-icon name="Pencil" [size]="20"></lucide-icon>
          </button>
          <button (click)="showDeleteConfirm = true" class="p-2 hover:text-red-500">
            <lucide-icon name="Trash2" [size]="20"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="showDeleteConfirm" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-medium mb-4">Delete Contact</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete {{contact.name}}? This action cannot be undone.
        </p>
        <div class="flex gap-4">
          <button (click)="showDeleteConfirm = false" 
                  class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button (click)="deleteContact()" 
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  `
})
export class ContactCardComponent {
  @Input() contact!: Contact;
  showDeleteConfirm = false;

  constructor(
    private contactController: ContactController,
    private router: Router
  ) {}

  navigateToEdit() {
    this.router.navigate(['/edit', this.contact.id]);
  }

  deleteContact(): void {
    this.contactController.deleteContact(this.contact.id);
    this.showDeleteConfirm = false;
  }
} 