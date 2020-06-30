import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoasterComponent } from './user-roaster.component';

describe('UserRoasterComponent', () => {
  let component: UserRoasterComponent;
  let fixture: ComponentFixture<UserRoasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
