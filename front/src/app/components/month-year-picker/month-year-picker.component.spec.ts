import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthYearPickerComponent } from './month-year-picker.component';

describe('MonthYearPickerComponent', () => {
  let component: MonthYearPickerComponent;
  let fixture: ComponentFixture<MonthYearPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonthYearPickerComponent],
    });

    fixture = TestBed.createComponent(MonthYearPickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should parse an initial ISO value into month and year selects', () => {
    fixture.componentRef.setInput('value', '2020-10-01');
    fixture.detectChanges();

    const [monthSelect, yearSelect] = fixture.nativeElement.querySelectorAll('select');
    expect(monthSelect.value).toBe('10');
    expect(yearSelect.value).toBe('2020');
  });

  it('should update the value when the month changes', () => {
    fixture.componentRef.setInput('value', '2020-10-01');
    fixture.detectChanges();

    const [monthSelect] = fixture.nativeElement.querySelectorAll('select');
    monthSelect.value = '3';
    monthSelect.dispatchEvent(new Event('change'));

    expect(component.value()).toBe('2020-03-01');
  });

  it('should update the value when the year changes', () => {
    fixture.componentRef.setInput('value', '2020-10-01');
    fixture.detectChanges();

    const [, yearSelect] = fixture.nativeElement.querySelectorAll('select');
    yearSelect.value = '2021';
    yearSelect.dispatchEvent(new Event('change'));

    expect(component.value()).toBe('2021-10-01');
  });

  it('should not show an ongoing checkbox unless allowOngoing is set', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[type="checkbox"]')).toBeNull();
  });

  it('should clear the value to null when ongoing is checked', () => {
    fixture.componentRef.setInput('allowOngoing', true);
    fixture.componentRef.setInput('value', '2020-10-01');
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(component.value()).toBeNull();
  });

  it('should disable the selects while ongoing', () => {
    fixture.componentRef.setInput('allowOngoing', true);
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();

    const [monthSelect, yearSelect] = fixture.nativeElement.querySelectorAll('select');
    expect(monthSelect.disabled).toBe(true);
    expect(yearSelect.disabled).toBe(true);
  });
});
