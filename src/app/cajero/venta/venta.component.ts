import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { UsuarioLoggedService } from '../../Servicios/usuario-logged.service';
import { Usuario } from '../../models/usuario';

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
  cantidadProducto = 1;

  cliente = {
    ingresado: 0,
    cambio: 0,
  }
  msgError: string = '';
  ticket: boolean = false;
  usuario: Usuario = new Usuario();

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
    private _productoVentaService: ProductoVentaService,
    private usuarioLogged: UsuarioLoggedService
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioLogged.getUsuario();
    this.fechaActual = new Date();
    this.fechaHoraActual = new Date();
    this.obtenerProductos();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value =>{
        const filtered = this._filter(value)
        if (filtered.length === 0 && value !== '') {
          this.showErrorMessage(); 
        }
        return filtered;
      }));
  }

  showErrorMessage() {
    Swal.fire({
      icon: "error",
      title: "No se encontraron Coincidencias",
      text: "El producto no esta registrado",
      footer: 'Notifica al jefe de inventario'
    });
    this.myControl.setValue('');
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

  calcularCambio(): void {
    this.msgError = '';
    if (this.cliente.ingresado >= this.totalCompra) {
      this.cliente.cambio = this.cliente.ingresado - this.totalCompra;
    } else if (this.cliente.ingresado < 0) {
      this.msgError = "No se aceptan numeros negativos";
      this.cliente.cambio = 0;
    } else if (this.cliente.ingresado < this.totalCompra) {
      this.msgError = "El monto es menor a la compra";
      this.cliente.cambio = 0;
    }
  }

  actualizarIngresado() {
    this.cliente.ingresado = this.totalCompra;
  }

  validar(){
    if (this.productoSeleccionado) {
      if(this.cantidadProducto> 0 && this.cantidadProducto<=this.productoSeleccionado?.stock){
        return true;
      }
      if(this.cantidadProducto<1){
        Swal.fire({
          icon: "error",
          title: "Verifíca la cantidad",
          text: "Debes ingresar al menos 1 producto",
          footer: 'Notifica al jefe de inventario'
        });    
      }else {
        Swal.fire({
          icon: "error",
          title: "Verifíca la cantidad",
          text: "Excedes el stock disponible",
          footer: 'Aumenta la cantidad'
        });
      }
    }
    return false;
  }


  agregarProducto() {
    if(!this.validar()){
      return;
    }
    if (this.productoSeleccionado) {

      if(this.productoSeleccionado.stock == 0){
        Swal.fire({
          icon: "error",
          title: "Producto Agotado",
          text: "Por el momento el producto esta agotado",
          footer: 'Notifica al jefe de inventario'
        });
        return;
      }
      let datosTabla: ModeloTablaVenta | undefined = this.dataSource.data.find(p => p.producto.nombre === this.productoSeleccionado!.nombre);
      
      if (datosTabla) {
        if (this.limiteAgotadoProducto(this.productoSeleccionado)) return;
        this.productTable = this.productTable.filter(producto => producto.codigoProducto !== datosTabla.producto.codigoProducto);
        datosTabla.cantidad = datosTabla.cantidad+this.cantidadProducto;
        datosTabla.restante = this.productoSeleccionado.stock-this.cantidadProducto;
        datosTabla.producto.stock = this.productoSeleccionado.stock-this.cantidadProducto;
        datosTabla.precioTotal = this.productoSeleccionado.precioVenta * datosTabla.cantidad;
        this.productTable.push(datosTabla.producto);

      } else {
        console.log('es producto nuevo')
        this.productoSeleccionado.stock = this.productoSeleccionado.stock - this.cantidadProducto;

        let nuevoProducto: ModeloTablaVenta = new ModeloTablaVenta()
        nuevoProducto.producto = this.productoSeleccionado;
        nuevoProducto.cantidad = this.cantidadProducto;
        nuevoProducto.precioTotal = this.productoSeleccionado.precioVenta*this.cantidadProducto;
        nuevoProducto.restante = this.productoSeleccionado.stock;

        this.dataSource.data = [...this.dataSource.data, nuevoProducto];
        this.productTable.push(nuevoProducto.producto);
      }
      this.calcularTotales();
    }
    
    this.myControl.setValue('');
    this.productoSeleccionado = null;
    console.log(this.productTable);
    console.log(this.productList);
    this.cantidadProducto = 1;
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

  terminarVenta() {
    this.ticket = false;
    this.confirmarVenta();
  }

  cobrar() {
    console.log("entramos a cobrar")
    console.log(this.productTable)
    this.venta.cambio = this.cliente.cambio;
    this.venta.efectivo = this.cliente.ingresado;
    this.venta.rfc = this.usuario.rfc;
    console.log(this.venta);
    this._ventaServicio.insertarVenta(this.venta).subscribe({
      next: (result: any) => {
        //console.log(result);
        Swal.fire({
          title: 'Venta Registrada!',
          text: 'Registro Exitoso!',
          icon: 'success',
        }).then(() => {
          this.ticket = true;
          this.insertarProductoVenta(result.idVenta);
          this.actualizarStockProductos();
        });
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

  insertarProductoVenta(idVenta: number) {
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

  actualizarStockProductos(){
    console.log(this.productTable);
    //actualizar productos en base de datos stock
        this.productTable.forEach(element => {
          console.log(element)
          this._productoServicio.updateProduct(element).subscribe({
            next: (datos) => {
              console.log(datos);
            },
            error: (errores) => console.log(errores)
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
    this.obtenerProductos();
    this.dataSource.data.forEach(item => {
      item.producto.stock += item.cantidad;
    });
    this.dataSource.data = [];
    this.calcularTotales();
    this.myControl.reset();
    this.productoSeleccionado = null;
    this.cliente = {
      ingresado: 0,
      cambio: 0
    }
  }

}

