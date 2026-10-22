import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { RichTextEditorComponent } from './rich-text-editor.component';

describe('RichTextEditorComponent', () => {
  let component: RichTextEditorComponent;
  let fixture: ComponentFixture<RichTextEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RichTextEditorComponent, FontAwesomeTestingModule],
    });

    fixture = TestBed.createComponent(RichTextEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should reflect an initial value into the editable area', () => {
    fixture.componentRef.setInput('value', '<strong>Hello</strong>');
    fixture.detectChanges();

    const editable = fixture.nativeElement.querySelector('[contenteditable]');
    expect(editable.innerHTML).toBe('<strong>Hello</strong>');
  });

  it('should update the value signal when the editable content changes', () => {
    fixture.detectChanges();

    const editable = fixture.nativeElement.querySelector('[contenteditable]');
    editable.innerHTML = '<em>World</em>';
    editable.dispatchEvent(new Event('input'));

    expect(component.value()).toBe('<em>World</em>');
  });

  it('should refresh activeFormats without throwing when the selection changes', () => {
    fixture.detectChanges();
    const editable = fixture.nativeElement.querySelector('[contenteditable]');
    Object.defineProperty(document, 'activeElement', { value: editable, configurable: true });

    expect(() => component['updateActiveFormats']()).not.toThrow();
    expect(component['activeFormats']()).toEqual(
      expect.objectContaining({ bold: expect.any(Boolean), italic: expect.any(Boolean) }),
    );
  });

  it('should not update activeFormats when the editor is not focused', () => {
    fixture.detectChanges();
    Object.defineProperty(document, 'activeElement', { value: document.body, configurable: true });

    component['activeFormats'].set({ bold: true, italic: true, underline: true, insertUnorderedList: true });
    component['updateActiveFormats']();

    expect(component['activeFormats']()).toEqual({ bold: true, italic: true, underline: true, insertUnorderedList: true });
  });
});
