import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenShiftComponent } from './open-shift.component';

describe('OpenShiftComponent', () => {
  let component: OpenShiftComponent;
  let fixture: ComponentFixture<OpenShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
