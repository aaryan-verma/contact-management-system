import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneValidatorDirective } from './phone-validator.directive';
import { EmailValidatorDirective } from './email-validator.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    PhoneValidatorDirective,
    EmailValidatorDirective
  ],
  exports: [
    PhoneValidatorDirective,
    EmailValidatorDirective
  ]
})
export class DirectivesModule { } 