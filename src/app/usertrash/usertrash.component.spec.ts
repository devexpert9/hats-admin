import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertrashComponent } from './usertrash.component';

describe('UsertrashComponent', () => {
  let component: UsertrashComponent;
  let fixture: ComponentFixture<UsertrashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsertrashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
