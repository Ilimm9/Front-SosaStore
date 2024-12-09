import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { of } from 'rxjs';
import { Venta } from '../../models/venta';
import { VentaService } from '../../Servicios/venta.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { ProductoVentaService } from '../../Servicios/producto-venta.service';
import { ProductoVenta } from '../../models/producto-venta';

@Component({

  selector: 'app-venta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})


export class VentaComponent implements OnInit {

  productList: Producto[] = [];
  productTable: Producto[] = [];

  venta: Venta = new Venta();
  ventaRegistrada = false;

  displayedColumns: string[] = [
    'cantidad',
    'restante',
    'producto',
    'precioUnitario',
    'precioTotal',
    'acciones',
  ];
  // dataSource = new MatTableDataSource<Producto>();
  dataSource = new MatTableDataSource<{ producto: Producto; cantidad: number; restante: number; precioTotal: number }>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  productoSeleccionado: Producto | null = null

  fechaActual: Date;
  fechaHoraActual: Date;
  sumaTotalProductos: number = 0;
  totalCompra: number = 0;

  constructor(
    private _productoServicio: ProductosServicioService,
    private router: Router,
    private _ventaServicio: VentaService,
    private _productoVentaService: ProductoVentaService
  ) { }

  ngOnInit(): void {
    this.fechaActual = new Date();
    this.fechaHoraActual = new Date();
    this.obtenerProductos();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productList.map(producto => producto.nombre).filter(option => option.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = [...this.dataSource.data]; // actualiza la dataSource 
    this.dataSource.connect().subscribe(data => {
      this.calcularTotales();
    });
  }

  obtenerProductos() {
    this._productoServicio.getProductos().subscribe({
      next: (datos) => {
        console.log(datos)
        this.productList = datos;
      }
    });
  }

  productoAgregado(event: any) {
    const nombreProducto = event.option.value;
    this.productoSeleccionado = this.productList.find(p => p.nombre === nombreProducto) || null;
  }

  agregarProducto() {
    if (this.productoSeleccionado) {
      const productoenTabla = this.dataSource.data.find(p => p.producto.nombre === this.productoSeleccionado!.nombre);
      if (productoenTabla) {
        if (this.limiteAgotadoProducto(this.productoSeleccionado)) return;
        productoenTabla.cantidad++;
        productoenTabla.restante--;
        this.productoSeleccionado.stock--;
        console.log(this.productoSeleccionado.stock);
        productoenTabla.precioTotal += this.productoSeleccionado.precioVenta;
        this.productTable.push(productoenTabla.producto);
        console.log(this.productTable);

      } else {
        this.productoSeleccionado.stock--;
        const nuevoProducto = {
          producto: this.productoSeleccionado,
          cantidad: 1,
          precioTotal: this.productoSeleccionado.precioVenta,
          restante: this.productoSeleccionado.stock
        };
        console.log(this.productoSeleccionado.stock);
        this.dataSource.data = [...this.dataSource.data, nuevoProducto];
        this.productTable.push(nuevoProducto.producto);
        console.log(this.productTable);
      }
      this.calcularTotales();
    }
    this.dataSource._updateChangeSubscription();
    this.myControl.setValue('');
    this.productoSeleccionado = null;
  }

  eliminarProducto(productoAEliminar: { producto: Producto; cantidad: number; precioTotal: number }) {
    const index = this.productTable.findIndex(producto => producto.codigoProducto === productoAEliminar.producto.codigoProducto);
    if (index !== -1) {
      this.productTable.splice(index, 1);
    } else {
      Swal.fire({
        title: 'Producto no disponible!',
        text: 'No hay productos disponibles para la venta.',
        icon: 'warning',
      });
      console.log(this.productTable);
    }
    this.obtenerProductos();
    this.dataSource.data = this.dataSource.data.filter(producto => producto !== productoAEliminar);
    this.calcularTotales();
  }

  limiteAgotadoProducto(producto: Producto) {
    if (producto.stock === 0) {
      Swal.fire({
        icon: "error",
        title: "Se agoto el stock del producto",
        text: "No hay mas elementos para vender"
      });
      return true;
    }
    return false;
  }

  incrementar(product: { producto: Producto; cantidad: number; precioTotal: number; restante: number }) {
    const productoenTabla = this.dataSource.data.find(p => p.producto.nombre === product.producto!.nombre);

    if (productoenTabla === null || productoenTabla === undefined) return;
    if (this.limiteAgotadoProducto(product.producto)) return;
    productoenTabla.cantidad++;
    product.producto.stock--;
    productoenTabla.restante = product.producto.stock;

    productoenTabla.precioTotal += product.producto.precioVenta;
    this.productTable.push(productoenTabla.producto);

    this.dataSource._updateChangeSubscription();
    this.calcularTotales();

  }

  decrementar(product: { producto: Producto; cantidad: number; precioTotal: number; restante: number }) {
    if (product === null) return;
    product.cantidad--;

    if (product.cantidad === 0) {
      Swal.fire({
        title: "¿Estas seguro de Eliminar el producto?",
        text: "Se eliminara el producto de la compra",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, de acuerdo!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.eliminarProducto(product);
        } else {
          product.cantidad++;
        }
      });
    } else {
      product.producto.stock++;
      product.restante = product.producto.stock;
      this.calcularTotales();
    }

  }

  calcularTotales() {
    this.sumaTotalProductos = this.dataSource.data.reduce((acc, producto) => acc + producto.cantidad, 0);
    this.totalCompra = this.dataSource.data.reduce((acc, producto) => acc + producto.precioTotal, 0);
    this.venta.total = this.totalCompra;
  }

  cobrar() {
    this._ventaServicio.insertarVenta(this.venta).subscribe({
      next: (result: any) => {
        console.log(result);
        Swal.fire({
          title: 'Venta Registrada!',
          text: 'Registro Exitoso!',
          icon: 'success',
        });
        this.insertarProductos(result.idVenta);
        this.confirmarVenta();
      },
      error: (errores) => {
        console.log(errores);
        Swal.fire({
          title: 'Venta No Registrada!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });
  }

  insertarProductos(idVenta: number) {
    this.dataSource.data.forEach(product => {
      let productoVenta: ProductoVenta = new ProductoVenta();
      productoVenta.idProducto = product.producto.codigoProducto,
        productoVenta.idVenta = idVenta,
        productoVenta.total = product.precioTotal,
        productoVenta.cantidad = product.cantidad,
        productoVenta.precio = product.producto.precioVenta,

        console.log(productoVenta);
      this._productoVentaService.insertarProductoVenta(productoVenta).subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (errores) => {
          console.log(errores);
        },
      })
    });
  }
  cancelar() {
    this.myControl.reset();
    this.productoSeleccionado = null;
  }

  cancelarVenta() {
    this.dataSource.data.forEach(item => {
      item.producto.stock += item.cantidad;
    });

    this.dataSource.data = [];
    this.productTable = [];
    this.calcularTotales();
    this.myControl.reset();
    this.productoSeleccionado = null;
  }

  confirmarVenta() {
    this.dataSource.data.forEach(item => {
      item.producto.stock += item.cantidad;
    });
    this.dataSource.data = [];
    this.calcularTotales();
    this.myControl.reset();
    this.productoSeleccionado = null;
  }

}

