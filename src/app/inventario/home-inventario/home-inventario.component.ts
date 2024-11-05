import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-inventario',
  standalone: true,
  imports: [],
  templateUrl: './home-inventario.component.html',
  styleUrl: './home-inventario.component.css'
})
export class HomeInventarioComponent implements OnInit{

  ngOnInit(): void {
    const carouselElement = document.getElementById('carouselExample');

    if (carouselElement) {
      // Accedemos a la instancia del carrusel directamente usando la API de Bootstrap
      const carousel = new (window as any).bootstrap.Carousel(carouselElement, {
        interval: 800,
        ride: 'carousel'
      });
      carousel.cycle();
    }
  }
}
