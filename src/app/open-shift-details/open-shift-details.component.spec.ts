import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenShiftDetailsComponent } from './open-shift-details.component';

describe('OpenShiftDetailsComponent', () => {
  let component: OpenShiftDetailsComponent;
  let fixture: ComponentFixture<OpenShiftDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenShiftDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenShiftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
