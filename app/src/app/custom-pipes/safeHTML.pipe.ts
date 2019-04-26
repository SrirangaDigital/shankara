import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

// Custom Pipe to Transliterate numerals


@Pipe({name: 'safeHTML'})
export class SafeHTMLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}