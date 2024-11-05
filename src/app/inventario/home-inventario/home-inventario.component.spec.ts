import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInventarioComponent } from './home-inventario.component';

describe('HomeInventarioComponent', () => {
  let component: HomeInventarioComponent;
  let fixture: ComponentFixture<HomeInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeInventarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
