import { TestBed } from '@angular/core/testing';

import { DynamicTableWorkspaceService } from './dynamic-table-workspace.service';

describe('DynamicTableWorkspaceService', () => {
  let service: DynamicTableWorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicTableWorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
