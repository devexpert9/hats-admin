import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledShiftsComponent } from './cancelled-shifts.component';

describe('CancelledShiftsComponent', () => {
  let component: CancelledShiftsComponent;
  let fixture: ComponentFixture<CancelledShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
