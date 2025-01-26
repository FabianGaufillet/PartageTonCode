import { HtmlDecodeAndSanitizePipe } from './html-decode-and-sanitize.pipe';

describe('HtmlDecodeAndSanitizePipe', () => {
  it('create an instance', () => {
    const pipe = new HtmlDecodeAndSanitizePipe();
    expect(pipe).toBeTruthy();
  });
});
