import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerLitoralComponent } from './per-litoral.component';

describe('PerLitoralComponent', () => {
  let component: PerLitoralComponent;
  let fixture: ComponentFixture<PerLitoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerLitoralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerLitoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
