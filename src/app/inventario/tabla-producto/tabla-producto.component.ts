import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { DataTable } from 'simple-datatables';
import { RouterLink } from '@angular/router';
import { EditarService } from '../../Servicios/editar.service';

@Component({
  selector: 'app-tabla-producto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tabla-producto.component.html',
  styleUrl: './tabla-producto.component.css',
})
export class TablaProductoComponent implements OnInit {
  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;
  productList: Array<Producto> = [];

  constructor(private _productoServicio: ProductosServicioService, private editarService: EditarService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this._productoServicio.getProductos2().subscribe((result) => {
      this.productList = Object.values(result);
      // this.imprimirItems();
      setTimeout(() => {
        this.initDataTable(); // Inicializa la DataTable después de que el DOM se haya actualizado
      }, 0);
    });
  }

  imprimirItems() {
    console.log("Imprimimos items");
    this.productList.forEach((item) => {
      console.log('ID:', item.id_producto);
      console.log('Nombre:', item.id_categoria);
      console.log('Rol:', item.codigo);
      console.log('Cuenta:', item.nombre);
      console.log('Teléfono:', item.stock);
      console.log('Fecha de Nacimiento:', item.stock_min);
      console.log('Área:', item.stock_max);
      console.log('Género:', item.precio_venta);
      console.log('Género:', item.precio_compra);
      console.log('---------------------------------');
    });
  }

  initDataTable() {
    // Asegúrate de que hay datos en la tabla antes de inicializarla
    if (this.datatablesSimple && this.productList.length > 0) {
      // Inicializa la DataTable
      new DataTable(this.datatablesSimple.nativeElement, {
        labels: {
          placeholder: 'Buscar...',
          perPage: 'registros por página',
          noRows: 'No se encontraron registros',
          info: 'Mostrando {start} a {end} de {rows} registros',
          noResults: 'No se encontraron coincidencias',
        },
      });
    }
  }

  enviarProducto(event: MouseEvent) {
    let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
    console.log(dataId)
    if (dataId === null) {
      return;
    }
    let id = parseInt(dataId);
    const producto = this.productList.find(p => p.id_producto === id);
    if (producto) {
      console.log(producto)
      this.editarService.seleccionarProducto(producto)
    }
  }
}
