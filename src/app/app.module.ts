import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UserPlus, Search, Mail, Phone, Pencil, Trash2, X, Shield, Zap, Users, Check } from 'lucide-angular';

import { AppComponent } from './app.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { SharedModule } from './components/shared.module';
import { ToastComponent } from './components/toast/toast.component';

const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'add', component: ContactFormComponent },
  { path: 'edit/:id', component: ContactFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent, ToastComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    LucideAngularModule.pick({ 
      UserPlus, Search, Mail, Phone, Pencil, Trash2, X,
      Shield, Zap, Users, Check
    }),
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 