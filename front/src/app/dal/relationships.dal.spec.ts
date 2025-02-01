import { TestBed } from '@angular/core/testing';

import { RelationshipsDal } from './relationships.dal';

describe('RelationshipsDal', () => {
  let service: RelationshipsDal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationshipsDal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
