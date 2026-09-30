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
});
