import { Pipe, PipeTransform } from '@angular/core';

// Custom Pipe to Replace text


@Pipe({name: 'strReplace'})
export class StrReplacePipe implements PipeTransform {
  transform(value: string): any {

    value = value.replace(/\n/g, '<br />');

    return value;
  }
}