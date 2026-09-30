import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ContactEditFormComponent } from './contact-edit-form.component';
import { ContactApiModel } from '@models/api/contact.model';
import { environment } from '../../../environments/environment';

describe('ContactEditFormComponent', () => {
  let component: ContactEditFormComponent;
  let fixture: ComponentFixture<ContactEditFormComponent>;
  let httpMock: HttpTestingController;

  const mockContact: ContactApiModel = {
    id: '1',
    site: 'http://example.com',
    email: 'mailto:test@example.com',
    linkedin: 'https://linkedin.com/in/test',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactEditFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContactEditFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('contact', mockContact);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and prefill the form from the contact input', () => {
    expect(component).toBeTruthy();
    expect(component['model']()).toEqual({
      site: mockContact.site,
      email: mockContact.email,
      linkedin: mockContact.linkedin,
    });
  });

  it('should PUT the updated contact and emit saved on success', () => {
    const savedSpy = vi.fn();
    component.saved.subscribe(savedSpy);

    component['onSubmit'](new Event('submit'));

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/contact`).flush({ ok: true });

    expect(savedSpy).toHaveBeenCalled();
    expect(component['saving']()).toBe(false);
  });

  it('should show an error message when the save fails', () => {
    component['onSubmit'](new Event('submit'));

    httpMock
      .expectOne(`${environment.apiBaseUrl}/v1/admin/contact`)
      .flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });

    expect(component['errorMessage']()).toBe("Erreur lors de l'enregistrement.");
  });

  it('should emit cancelled when the cancel button is used', () => {
    const cancelledSpy = vi.fn();
    component.cancelled.subscribe(cancelledSpy);

    component['cancelled'].emit();

    expect(cancelledSpy).toHaveBeenCalled();
  });
});
