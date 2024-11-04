import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent implements OnInit {

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

