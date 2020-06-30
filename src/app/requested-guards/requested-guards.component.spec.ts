import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedGuardsComponent } from './requested-guards.component';

describe('RequestedGuardsComponent', () => {
  let component: RequestedGuardsComponent;
  let fixture: ComponentFixture<RequestedGuardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedGuardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedGuardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
