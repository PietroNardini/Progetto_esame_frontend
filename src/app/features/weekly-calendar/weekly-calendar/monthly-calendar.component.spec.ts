import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthlyCalendarComponent }   from './monthly-calendar.component';

describe('MonthlyCalendarComponent', () => {
  let component: MonthlyCalendarComponent;
  let fixture: ComponentFixture<MonthlyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyCalendarComponent]
    })
    .compileComponents();

    fixture   = TestBed.createComponent(MonthlyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the monthly calendar component', () => {
    expect(component).toBeTruthy();
  });
});