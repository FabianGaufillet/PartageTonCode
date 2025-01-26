import { TestBed } from '@angular/core/testing';

import { FrenchPaginatorIntlService } from './french-paginator-intl.service';

describe('FrenchPaginatorIntlService', () => {
  let service: FrenchPaginatorIntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrenchPaginatorIntlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
