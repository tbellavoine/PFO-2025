import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonCardComponent } from './json-card.component';

describe('JsonCardComponent', () => {
  let component: JsonCardComponent;
  let fixture: ComponentFixture<JsonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
