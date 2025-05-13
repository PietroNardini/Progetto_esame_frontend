import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignHoursComponent } from './assign-hours.component';

describe('AssignHoursComponent', () => {
  let component: AssignHoursComponent;
  let fixture: ComponentFixture<AssignHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignHoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
