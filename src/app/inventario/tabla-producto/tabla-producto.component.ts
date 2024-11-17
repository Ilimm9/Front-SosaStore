import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { DataTable } from 'simple-datatables';
import { RouterLink } from '@angular/router';
import { EditarService } from '../../Servicios/editar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../Servicios/categoria.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tabla-producto',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './tabla-producto.component.html',
  styleUrl: './tabla-producto.component.css',
})
export class TablaProductoComponent implements OnInit, AfterViewInit {

  productList: Producto[] = [];
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['codigo', 'producto', 'stock', 'stock-minimo', 'stock-maximo', 'precio-compra', 'precio-venta', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _productoServicio: ProductosServicioService,
    private editarService: EditarService
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerProductos() {
    this._productoServicio.getProductos().subscribe({
      next: (datos) => {
        this.productList = datos;
        this.dataSource.data = this.productList;
        console.log(this.productList);
      }
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
        this.obtenerProductos();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

}
