import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalComponent, FontAwesomeTestingModule],
    });

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the given title', () => {
    fixture.componentRef.setInput('title', 'Modifier le contact');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Modifier le contact');
  });

  it('should emit closed when the backdrop is clicked', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    const backdrop = fixture.debugElement.query((el) => el.attributes['role'] === 'presentation');
    backdrop.nativeElement.click();

    expect(closedSpy).toHaveBeenCalled();
  });

  it('should not emit closed when the dialog panel itself is clicked', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    const dialog = fixture.debugElement.query((el) => el.attributes['role'] === 'dialog');
    dialog.nativeElement.click();

    expect(closedSpy).not.toHaveBeenCalled();
  });

  it('should emit closed when the close button is clicked', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    const closeButton = fixture.debugElement.query((el) => el.attributes['aria-label'] === 'Fermer');
    closeButton.nativeElement.click();

    expect(closedSpy).toHaveBeenCalled();
  });

  it('should emit closed on Escape', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closedSpy).toHaveBeenCalled();
  });
});
