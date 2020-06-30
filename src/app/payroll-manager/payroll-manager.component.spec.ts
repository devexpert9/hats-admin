import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollManagerComponent } from './payroll-manager.component';

describe('PayrollManagerComponent', () => {
  let component: PayrollManagerComponent;
  let fixture: ComponentFixture<PayrollManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
