import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactController } from '../../controllers/contact.controller';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contact-form',
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <div class="max-w-md mx-auto bg-white rounded p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg md:text-xl font-semibold">{{isEditMode ? 'Edit' : 'Add'}} Contact</h2>
          <button (click)="navigateBack()" class="text-gray-500">
            <lucide-icon name="X" [size]="24"></lucide-icon>
          </button>
        </div>

        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <input type="text" 
                   formControlName="name"
                   placeholder="Name"
                   class="w-full p-2 border rounded">
          </div>
          <div>
            <input type="email" 
                   formControlName="email"
                   placeholder="Email"
                   class="w-full p-2 border rounded">
            <div *ngIf="emailError" class="text-red-500 text-sm mt-1">
              {{ emailError }}
            </div>
          </div>
          <div>
            <input type="tel" 
                   formControlName="phone"
                   placeholder="Phone (10 digits)"
                   maxlength="10"
                   class="w-full p-2 border rounded">
            <div *ngIf="phoneError" class="text-red-500 text-sm mt-1">
              {{ phoneError }}
            </div>
          </div>
          <button type="submit" 
                  [disabled]="!contactForm.valid || isLoading"
                  class="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50 relative">
            <span [class.invisible]="isLoading">
              {{isEditMode ? 'Update' : 'Add'}} Contact
            </span>
            <div *ngIf="isLoading" 
                 class="absolute inset-0 flex items-center justify-center">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </button>
        </form>
      </div>
    </div>
  `
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  private contactId?: string;
  emailError: string | null = null;
  phoneError: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private contactController: ContactController,
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private toastService: ToastService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contactId = params['id'];
        // Load contact data
        this.contactController.getAllContacts().pipe(
          map(contacts => contacts.find(c => c.id === this.contactId))
        ).subscribe(contact => {
          if (contact) {
            this.contactForm.patchValue(contact);
          }
        });
      }
    });
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      try {
        if (this.isEditMode && this.contactId) {
          await this.contactController.updateContact(this.contactId, this.contactForm.value);
          this.toastService.show('Contact updated successfully', 'success');
        } else {
          await this.contactController.createContact(this.contactForm.value);
          this.toastService.show('Contact created successfully', 'success');
        }
        this.navigateBack();
      } catch (error: any) {
        if (error.message.includes('Email already exists')) {
          this.emailError = 'Email already exists';
          this.toastService.show('Email already exists', 'error');
        } else if (error.message.includes('Phone number already exists')) {
          this.phoneError = 'Phone number already exists';
          this.toastService.show('Phone number already exists', 'error');
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
} 