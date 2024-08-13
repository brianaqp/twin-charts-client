import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenInterceptorComponent } from './token-interceptor.component';

describe('TokenInterceptorComponent', () => {
  let component: TokenInterceptorComponent;
  let fixture: ComponentFixture<TokenInterceptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenInterceptorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
