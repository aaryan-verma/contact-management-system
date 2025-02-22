import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../models/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts = new BehaviorSubject<Contact[]>(this.generateDemoContacts());

  private generateDemoContacts(): Contact[] {
    return [
      { id: '1', name: 'Aaryan Verma', email: 'aryanverma.av2000@gmail.com', phone: '7905138910' },
      { id: '2', name: 'Emma Wilson', email: 'emma.w@example.com', phone: '2345678901' },
      { id: '3', name: 'Michael Brown', email: 'michael.b@example.com', phone: '3456789012' },
      { id: '4', name: 'Sarah Davis', email: 'sarah.d@example.com', phone: '4567890123' },
      { id: '5', name: 'James Johnson', email: 'james.j@example.com', phone: '5678901234' },
      { id: '6', name: 'Emily Taylor', email: 'emily.t@example.com', phone: '6789012345' },
      { id: '7', name: 'William Lee', email: 'william.l@example.com', phone: '7890123456' },
      { id: '8', name: 'Olivia Martin', email: 'olivia.m@example.com', phone: '8901234567' },
      { id: '9', name: 'Daniel White', email: 'daniel.w@example.com', phone: '9012345678' },
      { id: '10', name: 'Sophia Clark', email: 'sophia.c@example.com', phone: '0123456789' },
    ];
  }

  getContacts(): Observable<Contact[]> {
    return this.contacts.asObservable();
  }

  addContact(contact: Omit<Contact, 'id'>): void {
    const currentContacts = this.contacts.getValue();
    const newContact = {
      ...contact,
      id: Date.now().toString()
    };
    this.contacts.next([newContact, ...currentContacts]);
  }

  updateContact(id: string, contact: Omit<Contact, 'id'>): void {
    const currentContacts = this.contacts.getValue();
    const updatedContacts = currentContacts.map(c => 
      c.id === id ? { ...contact, id } : c
    );
    this.contacts.next(updatedContacts);
  }

  deleteContact(id: string): void {
    const currentContacts = this.contacts.getValue();
    this.contacts.next(currentContacts.filter(contact => contact.id !== id));
  }
} 