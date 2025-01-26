import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'htmlDecodeAndSanitize',
})
export class HtmlDecodeAndSanitizePipe implements PipeTransform {
  private readonly sanitazier = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    const parser = new DOMParser();
    const decodedString =
      parser.parseFromString(value, 'text/html').body.textContent || '';
    return this.sanitazier.bypassSecurityTrustHtml(decodedString);
  }
}
