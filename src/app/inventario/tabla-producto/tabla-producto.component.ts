import { Component, ElementRef, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { DataTable } from 'simple-datatables';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tabla-producto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tabla-producto.component.html',
  styleUrl: './tabla-producto.component.css'
})
export class TablaProductoComponent {
  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;
  productList: Producto[] = [];
  
  constructor(private _productoServicio:ProductosServicioService){}

  ngOnInit(): void {
    this._productoServicio.getProductos().subscribe((data: Producto[]) =>{
     // console.log(data);                                                                                                                                                                          console.log(data);
      this.productList = data;
      console.log(this.productList);
      setTimeout(() => {
       this.initDataTable(); // Inicializa la DataTable después de que el DOM se haya actualizado
      }, 0);
    });
  }
  initDataTable() {
    // Asegúrate de que hay datos en la tabla antes de inicializarla
    if (this.datatablesSimple && this.productList.length > 0) {
      // Inicializa la DataTable
      new DataTable(this.datatablesSimple.nativeElement, {
        labels: {
          placeholder: "Buscar...",
          perPage: "registros por página",
          noRows: "No se encontraron registros",
          info: "Mostrando {start} a {end} de {rows} registros",
          noResults: "No se encontraron coincidencias"
      }
      });
    
    }
  }

}
