import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoasterShiftsComponent } from './roaster-shifts.component';

describe('RoasterShiftsComponent', () => {
  let component: RoasterShiftsComponent;
  let fixture: ComponentFixture<RoasterShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoasterShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoasterShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
