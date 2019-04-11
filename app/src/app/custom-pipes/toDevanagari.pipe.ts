import { Pipe, PipeTransform } from '@angular/core';

// Custom Pipe to Transliterate numerals


@Pipe({name: 'toDevanagari'})
export class ToDevanagariPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) return value;

    value = value.replace(/0/g, '०');
    value = value.replace(/1/g, '१'); 
    value = value.replace(/2/g, '२'); 
    value = value.replace(/3/g, '३'); 
    value = value.replace(/4/g, '४'); 
    value = value.replace(/5/g, '५'); 
    value = value.replace(/6/g, '६'); 
    value = value.replace(/7/g, '७'); 
    value = value.replace(/8/g, '८'); 
    value = value.replace(/9/g, '९'); 

    return value;
  }
}