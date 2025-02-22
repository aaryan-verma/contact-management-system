import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[phoneValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PhoneValidatorDirective,
    multi: true
  }]
})
export class PhoneValidatorDirective implements Validator {
  validate(control: AbstractControl): {[key: string]: any} | null {
    const valid = /^[0-9]{10}$/.test(control.value);
    return valid ? null : { 'invalidPhone': true };
  }
} 