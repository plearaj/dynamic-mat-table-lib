import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableWorkspaceComponent } from './dynamic-table-workspace.component';

describe('DynamicTableWorkspaceComponent', () => {
  let component: DynamicTableWorkspaceComponent;
  let fixture: ComponentFixture<DynamicTableWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTableWorkspaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicTableWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
