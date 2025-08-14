import { TestBed } from '@angular/core/testing';

import { LastPagesService } from './last-pages.service';

describe('LastPagesService', () => {
  let service: LastPagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastPagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
