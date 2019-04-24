import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

// Custom Pipe to Transliterate numerals


@Pipe({name: 'linkPDF'})
export class LinkPDFPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string, volume: string, basePdfUrl: string) {

    value = value.replace(/data-page="(.*?)"/g, 'target="_blank" href="' + basePdfUrl + volume + '.pdf#page=$1"');

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}