import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerPortComponent } from './per-port.component';

describe('PerPortComponent', () => {
  let component: PerPortComponent;
  let fixture: ComponentFixture<PerPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerPortComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
