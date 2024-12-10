import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Producto } from '../../models/producto';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Venta } from '../../models/venta';
import { VentaService } from '../../Servicios/venta.service';
import Swal from 'sweetalert2';
import { ProductoVentaService } from '../../Servicios/producto-venta.service';
import { ProductoVenta } from '../../models/producto-venta';
import { ModeloTablaVenta } from '../../models/modelo-tabla-venta';

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
  productTable: any[] = [];

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
  
  dataSource = new MatTableDataSource<ModeloTablaVenta>();

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
      let datosTabla: ModeloTablaVenta | undefined = this.dataSource.data.find(p => p.producto.nombre === this.productoSeleccionado!.nombre);

      if (datosTabla) {
        if (this.limiteAgotadoProducto(this.productoSeleccionado)) return;
        this.productTable = this.productTable.filter(producto => producto.codigoProducto !== datosTabla.producto.codigoProducto);
        datosTabla.cantidad++;
        datosTabla.restante--;
        datosTabla.producto.stock--;
        datosTabla.precioTotal += this.productoSeleccionado.precioVenta;
        this.productTable.push(datosTabla.producto);

      } else {
        console.log('es producto nuevo')
        this.productoSeleccionado.stock--;

        let nuevoProducto: ModeloTablaVenta = new ModeloTablaVenta()
        nuevoProducto.producto = this.productoSeleccionado;
        nuevoProducto.cantidad = 1;
        nuevoProducto.precioTotal = this.productoSeleccionado.precioVenta;
        nuevoProducto.restante = this.productoSeleccionado.stock

        this.dataSource.data = [...this.dataSource.data, nuevoProducto];
        this.productTable.push(nuevoProducto.producto);
        //console.log(this.productTable);
      }
      this.calcularTotales();
    }
    // this.dataSource._updateChangeSubscription();
    this.myControl.setValue('');
    this.productoSeleccionado = null;
    console.log(this.productTable);
    console.log(this.productList);
  }

  eliminarProducto(modelo: ModeloTablaVenta) {
    const index = this.productTable.findIndex(producto => producto.codigoProducto === modelo.producto.codigoProducto);
    if (index !== -1) {
      this.productTable.splice(index, 1);
    } else {
      Swal.fire({
        title: 'Producto no disponible!',
        text: 'No hay productos disponibles para la venta.',
        icon: 'warning',
      });
      //console.log(this.productTable);
    }
    // this.obtenerProductos();
    this.dataSource.data = this.dataSource.data.filter(producto => producto !== modelo);
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



  incrementar(product: ModeloTablaVenta) {
    if (product === null) return;
    if (this.limiteAgotadoProducto(product.producto)) return;
    product.cantidad++;
    product.producto.stock--;
    product.restante = product.producto.stock;
    product.precioTotal += product.producto.precioVenta;

    this.productTable = this.productTable.filter(producto => producto.codigoProducto !== product.producto.codigoProducto);


    this.productTable.push(product.producto);
    this.dataSource._updateChangeSubscription();
    this.calcularTotales();
    // console.log(this.productTable)

  }

  decrementar(product: ModeloTablaVenta) {
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
      product.precioTotal -= product.producto.precioVenta;
      this.productTable = this.productTable.filter(producto => producto.codigoProducto !== product.producto.codigoProducto);
      this.productTable.push(product.producto);
      this.dataSource._updateChangeSubscription();
      this.calcularTotales();
      console.log(this.productTable)
    }

  }

  calcularTotales() {
    this.sumaTotalProductos = this.dataSource.data.reduce((acc, producto) => acc + producto.cantidad, 0);
    this.totalCompra = this.dataSource.data.reduce((acc, producto) => acc + producto.precioTotal, 0);
    this.venta.total = this.totalCompra;
  }

  cobrar() {
    console.log("entramos a cobrar")
    console.log(this.productTable)
    this._ventaServicio.insertarVenta(this.venta).subscribe({
      next: (result: any) => {
        //console.log(result);
        Swal.fire({
          title: 'Venta Registrada!',
          text: 'Registro Exitoso!',
          icon: 'success',
        });
        this.insertarProductos(result.idVenta);
        this.confirmarVenta();

        this.productTable.forEach(element => {
          //console.log(element)
          this._productoServicio.updateProduct(element).subscribe({
            next: (datos) => {
              console.log(datos);
            },
            error: (errores) => console.log(errores)
          })
        });
      },
      error: (errores) => {
        //console.log(errores);
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
      productoVenta.idProducto = product.producto.codigoProducto;
        productoVenta.idVenta = idVenta;
        productoVenta.total = product.precioTotal;
        productoVenta.cantidad = product.cantidad;
        productoVenta.precio = product.producto.precioVenta;

        //console.log(productoVenta);
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

