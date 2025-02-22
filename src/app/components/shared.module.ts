import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DirectivesModule } from '../directives/directives.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    DirectivesModule
  ],
  declarations: [
    ContactListComponent,
    ContactCardComponent,
    ContactFormComponent
  ],
  exports: [
    ContactListComponent,
    ContactCardComponent,
    ContactFormComponent
  ]
})
export class SharedModule { } 