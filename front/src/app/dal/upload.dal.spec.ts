import { TestBed } from '@angular/core/testing';

import { UploadDal } from './upload.dal';

describe('UploadDal', () => {
  let service: UploadDal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadDal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
