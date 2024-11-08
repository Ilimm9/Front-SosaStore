import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCategoriaComponent } from './tabla-categoria.component';

describe('TablaCategoriaComponent', () => {
  let component: TablaCategoriaComponent;
  let fixture: ComponentFixture<TablaCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
