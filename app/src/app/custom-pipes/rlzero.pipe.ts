import { Pipe, PipeTransform } from '@angular/core';

// Custom Pipe to Remove Leading Zeros
// Handles both 01 case and 01-01 case 

@Pipe({name: 'rlzero'})
export class RlzeroPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) return value;

    return value.replace(/^0+/g, '');
  }
}