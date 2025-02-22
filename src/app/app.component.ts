import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {} 