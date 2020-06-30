import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentNotificationsComponent } from './sent-notifications.component';

describe('SentNotificationsComponent', () => {
  let component: SentNotificationsComponent;
  let fixture: ComponentFixture<SentNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
