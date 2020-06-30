import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedShiftsComponent } from './completed-shifts.component';

describe('CompletedShiftsComponent', () => {
  let component: CompletedShiftsComponent;
  let fixture: ComponentFixture<CompletedShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
