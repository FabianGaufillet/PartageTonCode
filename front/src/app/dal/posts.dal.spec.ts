import { TestBed } from '@angular/core/testing';

import { PostsDal } from './posts.dal';

describe('PostsDal', () => {
  let service: PostsDal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostsDal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
