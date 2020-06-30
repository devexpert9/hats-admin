import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignedShiftsComponent } from './reassigned-shifts.component';

describe('ReassignedShiftsComponent', () => {
  let component: ReassignedShiftsComponent;
  let fixture: ComponentFixture<ReassignedShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignedShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignedShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
