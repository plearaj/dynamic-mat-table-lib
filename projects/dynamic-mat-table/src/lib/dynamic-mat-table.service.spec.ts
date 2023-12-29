import { TestBed } from '@angular/core/testing';

import { DynamicMatTableService } from './dynamic-mat-table.service';

describe('DynamicMatTableService', () => {
  let service: DynamicMatTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicMatTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
