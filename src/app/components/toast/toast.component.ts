import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toastService.toasts$ | async"
           [@slideIn]
           class="p-4 rounded-lg shadow-lg text-white min-w-[200px] flex items-center gap-2"
           [class.bg-green-500]="toast.type === 'success'"
           [class.bg-red-500]="toast.type === 'error'">
        <lucide-icon [name]="toast.type === 'success' ? 'Check' : 'X'" 
                     [size]="20">
        </lucide-icon>
        {{ toast.message }}
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('150ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
} 