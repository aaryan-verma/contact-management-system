import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactController {
  constructor(private contactService: ContactService) {}

  getAllContacts(): Observable<Contact[]> {
    return this.contactService.getContacts();
  }

  async createContact(contact: Omit<Contact, 'id'>): Promise<void> {
    const existingContacts = await firstValueFrom(this.contactService.getContacts());
    const emailExists = existingContacts.some((c: Contact) => c.email === contact.email);
    const phoneExists = existingContacts.some((c: Contact) => c.phone === contact.phone);

    if (emailExists) {
      throw new Error('Email already exists');
    }
    if (phoneExists) {
      throw new Error('Phone number already exists');
    }

    this.contactService.addContact(contact);
  }

  async updateContact(id: string, contact: Omit<Contact, 'id'>): Promise<void> {
    const existingContacts = await firstValueFrom(this.contactService.getContacts());
    const emailExists = existingContacts.some((c: Contact) => c.email === contact.email && c.id !== id);
    const phoneExists = existingContacts.some((c: Contact) => c.phone === contact.phone && c.id !== id);

    if (emailExists) {
      throw new Error('Email already exists');
    }
    if (phoneExists) {
      throw new Error('Phone number already exists');
    }

    this.contactService.updateContact(id, contact);
  }

  deleteContact(id: string): void {
    this.contactService.deleteContact(id);
  }
} 