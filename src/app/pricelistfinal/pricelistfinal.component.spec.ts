import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistfinalComponent } from './pricelistfinal.component';

describe('PricelistfinalComponent', () => {
  let component: PricelistfinalComponent;
  let fixture: ComponentFixture<PricelistfinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricelistfinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricelistfinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
