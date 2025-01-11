import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlDecode',
})
export class HtmlDecodePipe implements PipeTransform {
  transform(value: string): string {
    const parser = new DOMParser();
    const decodedString =
      parser.parseFromString(value, 'text/html').body.textContent || '';
    return decodedString;
  }
}
