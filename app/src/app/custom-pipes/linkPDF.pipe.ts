import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

// Custom Pipe to Transliterate numerals


@Pipe({name: 'linkPDF'})
export class LinkPDFPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string, volume: string, basePdfUrl: string, search: string) {

    value = value.replace(/data-page="(.*?)"/g, 'target="_blank" href="' + basePdfUrl + volume + '&pageNumber=$1"');

    if(search !== undefined) {

    	var re = new RegExp('(' + search + ')', "g");
		value = value.replace(re, "<span class=\"highlight\">$1</span>");

      value = value.replace(/data-page="(.*?)"/g, '');
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
