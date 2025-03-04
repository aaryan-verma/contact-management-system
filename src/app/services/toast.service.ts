import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();

  show(message: string, type: 'success' | 'error') {
    const id = Date.now();
    const toast = { message, type, id };
    this.toasts.next([...this.toasts.value, toast]);

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  private remove(id: number) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
} 