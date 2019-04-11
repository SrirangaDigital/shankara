import { Pipe, PipeTransform } from '@angular/core';

// Custom Pipe to Transliterate numerals


@Pipe({name: 'monthToDevanagari'})
export class MonthToDevanagariPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) return value;

    value = value.replace(/(\d{4})-(.*)-(\d{2})/g, '$2');

    value = value.replace(/01/g, 'जनवरी');
    value = value.replace(/02/g, 'फरवरी');
    value = value.replace(/03/g, 'मार्च');
    value = value.replace(/04/g, 'अप्रैल');
    value = value.replace(/05/g, 'मई');
    value = value.replace(/06/g, 'जून');
    value = value.replace(/07/g, 'जुलाई');
    value = value.replace(/08/g, 'अगस्त');
    value = value.replace(/09/g, 'सितम्बर');
    value = value.replace(/10/g, 'अक्तूबर');
    value = value.replace(/11/g, 'नवम्बर');
    value = value.replace(/12/g, 'दिसम्बर');

    return value;
  }
}