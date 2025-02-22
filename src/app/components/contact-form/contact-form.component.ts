import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactController } from '../../controllers/contact.controller';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contact-form',
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <div class="max-w-md mx-auto bg-white rounded p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{isEditMode ? 'Edit' : 'Add'}} Contact</h2>
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
                  [disabled]="!contactForm.valid"
                  class="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50">
            {{isEditMode ? 'Update' : 'Add'}} Contact
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

  constructor(
    private fb: FormBuilder,
    private contactController: ContactController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit() {
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

  onSubmit() {
    if (this.contactForm.valid) {
      (async () => {
        try {
          if (this.isEditMode && this.contactId) {
            await this.contactController.updateContact(this.contactId, this.contactForm.value);
          } else {
            await this.contactController.createContact(this.contactForm.value);
          }
          this.navigateBack();
        } catch (error: any) {
          if (error.message.includes('Email already exists')) {
            this.emailError = 'Email already exists';
            this.phoneError = null;
          } else if (error.message.includes('Phone number already exists')) {
            this.phoneError = 'Phone number already exists';
            this.emailError = null;
          }
        }
      })();
    }
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
} 