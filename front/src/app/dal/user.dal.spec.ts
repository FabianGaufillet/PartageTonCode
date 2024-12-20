import { TestBed } from '@angular/core/testing';

import { UserDal } from './user.dal';

describe('UserDal', () => {
  let service: UserDal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
