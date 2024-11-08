import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { DataTable } from 'simple-datatables';
import { RouterLink } from '@angular/router';
import { EditarService } from '../../Servicios/editar.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../Servicios/categoria.service';

@Component({
  selector: 'app-tabla-producto',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  templateUrl: './tabla-producto.component.html',
  styleUrl: './tabla-producto.component.css',
})
export class TablaProductoComponent implements OnInit {
  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;

  dataTable: DataTable | null = null;

  productList: Array<Producto> = [];
  productListFiltrada: Array<Producto> = [];
  categorias: Array<Categoria> = [];
  categoriaSeleccionada: string = '';

  constructor(
    private _productoServicio: ProductosServicioService,
    private _categoriaService: CategoriaService,
    private editarService: EditarService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategorias();
  }

  loadProducts() {
    this._productoServicio.getProductos().subscribe((result) => {
      this.productList = Object.values(result);
      this.productListFiltrada = [...this.productList]; // Asegura que la lista filtrada esté sincronizada
      console.log(this.productListFiltrada);

      // Inicializa la DataTable después de que los productos se carguen
      setTimeout(() => {
        this.initDataTable();
      }, 0);
    });
  }

  loadCategorias() {
    this._categoriaService.getCategorias().subscribe((result) => {
      this.categorias = Object.values(result);
    });
  }

  initDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
      this.datatablesSimple.nativeElement.innerHTML = ''; // Limpiar el contenido de la tabla
      this.dataTable = null;
    }

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

  filtrarPorCategoria(event: Event) {
    this._productoServicio.getProductos().subscribe((result) => {
      this.productList = Object.values(result);
      console.log('Filtrando por categoría');
      console.log(this.productList);
      const categoriaId = (event.target as HTMLSelectElement).value;
      
      if (categoriaId) {
        this.productListFiltrada = this.productList.filter(
          (producto) => producto.id_categoria === parseInt(categoriaId)
        );
      } else {
        this.productListFiltrada = [...this.productList];
      }
      console.log(this.productListFiltrada);
      // this.imprimirItems();
      setTimeout(() => {
        this.initDataTable();
      }, 0);
    });
  }

  enviarProducto(event: MouseEvent) {
    let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
    console.log('enviamos producto');
    console.log(dataId);
    if (dataId === null) {
      return;
    }
    let id = parseInt(dataId);
    const producto = this.productList.find((p) => p.id_producto === id);
    if (producto) {
      console.log(producto);
      this.editarService.seleccionarProducto(producto);
    }
  }

  deleteProduct(id_producto: number) {
    const datos = {
      id_producto: id_producto,
    };
    this._productoServicio.deleteProduct({ datos }).subscribe({
      next: (result) => {
        // Mensaje de éxito
        Swal.fire({
          title: 'Producto eliminado!',
          text: 'El producto se ha eliminado con éxito.',
          icon: 'success',
        });
        this.loadProducts();
      },
      error: (error) => {
        // Manejo del error
        Swal.fire({
          title: 'Error al eliminar el producto',
          text: 'Hubo un problema al intentar eliminar el producto. Por favor, inténtalo nuevamente.',
          icon: 'error',
        });
        console.error('Error al eliminar el producto:', error); // O puedes registrar el error para depuración
      },
    });
  }

  trackById(index: number, item: Producto): number {
    return item.id_producto;
  }

   imprimirItems() {
    console.log("Imprimimos items");
    this.productListFiltrada.forEach((item) => {
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
}
