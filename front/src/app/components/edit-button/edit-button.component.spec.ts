import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { EditButtonComponent } from './edit-button.component';

describe('EditButtonComponent', () => {
  let component: EditButtonComponent;
  let fixture: ComponentFixture<EditButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditButtonComponent, FontAwesomeTestingModule],
    });

    fixture = TestBed.createComponent(EditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit when clicked', () => {
    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);

    fixture.debugElement.query((el) => el.name === 'button').nativeElement.click();

    expect(editSpy).toHaveBeenCalled();
  });
});
