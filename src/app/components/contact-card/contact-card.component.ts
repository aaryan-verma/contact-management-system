import { Component, Input } from '@angular/core';
import { Contact } from '../../models/contact.interface';
import { ContactController } from '../../controllers/contact.controller';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contact-card',
  template: `
    <div class="bg-white p-6 rounded shadow mb-4 hover:shadow-lg transition-all duration-200 border border-transparent hover:border-blue-100">
      <div class="flex justify-between">
        <div>
          <h3 class="font-semibold text-lg mb-2 text-blue-900">{{contact.name}}</h3>
          <div class="text-gray-600 space-y-2.5">
            <div class="flex items-center gap-3 hover:text-blue-600 transition-colors">
              <lucide-icon name="Mail" [size]="16"></lucide-icon>
              {{contact.email}}
            </div>
            <div class="flex items-center gap-3 hover:text-blue-600 transition-colors">
              <lucide-icon name="Phone" [size]="16"></lucide-icon>
              {{contact.phone}}
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">UPI Enabled</span>
              <span class="text-gray-500">ID: {{contact.phone}}&#64;upi</span>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button (click)="navigateToEdit()" 
                  class="p-2 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
            <lucide-icon name="Pencil" [size]="20"></lucide-icon>
          </button>
          <button (click)="showDeleteConfirm = true" 
                  class="p-2 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
            <lucide-icon name="Trash2" [size]="20"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="showDeleteConfirm" 
         class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h3 class="text-lg font-medium mb-4">Delete Contact</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete {{contact.name}}? This action cannot be undone.
        </p>
        <div class="flex gap-4">
          <button (click)="showDeleteConfirm = false" 
                  class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button (click)="deleteContact()" 
                  [disabled]="isDeleting"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors relative">
            <span [class.invisible]="isDeleting">Delete</span>
            <div *ngIf="isDeleting" 
                 class="absolute inset-0 flex items-center justify-center">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ContactCardComponent {
  @Input() contact!: Contact;
  showDeleteConfirm = false;
  isDeleting = false;

  constructor(
    private contactController: ContactController,
    private router: Router,
    private toastService: ToastService
  ) {}

  navigateToEdit() {
    this.router.navigate(['/edit', this.contact.id]);
  }

  async deleteContact(): Promise<void> {
    this.isDeleting = true;
    try {
      await this.contactController.deleteContact(this.contact.id);
      this.toastService.show('Contact deleted successfully', 'success');
    } catch (error) {
      this.toastService.show('Failed to delete contact', 'error');
    } finally {
      this.isDeleting = false;
      this.showDeleteConfirm = false;
    }
  }
} 