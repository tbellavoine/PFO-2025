import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  imports: [
    ClickOutsideDirective
  ],
  template: `
    <div clickOutside (clickOutside)="onClickOutside()" [excludeElements]="excludeElements">
      Inside Content
    </div>
    <div class="outside">Outside Content</div>
    <div class="excluded">Excluded Content</div>
  `
})
class TestComponent {
  excludeElements: string[] = ['.excluded'];
  onClickOutside(): void {}
}

describe('ClickOutsideDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let onClickOutsideSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    onClickOutsideSpy = spyOn(component, 'onClickOutside');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when clicking outside', () => {
    const outsideElement = fixture.debugElement.nativeElement.querySelector('.outside');
    outsideElement.click();

    expect(onClickOutsideSpy).toHaveBeenCalled();
  });

  it('should not emit when clicking inside', () => {
    const insideElement = fixture.debugElement.nativeElement.querySelector('[clickOutside]');
    insideElement.click();

    expect(onClickOutsideSpy).not.toHaveBeenCalled();
  });

  it('should not emit when clicking excluded elements', () => {
    const excludedElement = fixture.debugElement.nativeElement.querySelector('.excluded');
    excludedElement.click();

    expect(onClickOutsideSpy).not.toHaveBeenCalled();
  });
});
