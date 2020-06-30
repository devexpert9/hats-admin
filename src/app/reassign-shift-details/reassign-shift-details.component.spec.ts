import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignShiftDetailsComponent } from './reassign-shift-details.component';

describe('ReassignShiftDetailsComponent', () => {
  let component: ReassignShiftDetailsComponent;
  let fixture: ComponentFixture<ReassignShiftDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignShiftDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignShiftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
