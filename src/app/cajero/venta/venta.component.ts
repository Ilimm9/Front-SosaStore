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

  
  export class VentaComponent  implements OnInit {

    productList : Producto[]=[];
    productTable: Producto[]=[];

    venta:Venta = new Venta();
    ventaRegistrada = false;

    displayedColumns: string[] = [
      'cantidad',
      'producto',
      'precioUnitario',
      'precioTotal',
      'acciones',
    ];
    // dataSource = new MatTableDataSource<Producto>();
    dataSource = new MatTableDataSource<{ producto: Producto; cantidad: number; precioTotal:number }>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    myControl = new FormControl(); 
    filteredOptions: Observable<string[]>;
    productoSeleccionado: Producto | null = null

    fechaActual: Date;
    fechaHoraActual:Date;
    sumaTotalProductos: number = 0; 
    totalCompra: number = 0;

    constructor(
      private _productoServicio: ProductosServicioService,
      private router: Router,
      private _ventaServicio: VentaService,
      private _productoVentaService: ProductoVentaService
    ) {}

    ngOnInit(): void {
      this.fechaActual = new Date();
      this.fechaHoraActual = new Date();
      this.obtenerProductos();
      this.filteredOptions = this.myControl.valueChanges.pipe( 
        startWith(''), 
        map(value => this._filter(value)) );
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
          // this.dataSource.data = this.productList;
          // console.log(this.productList);
        }
      });
    }

    productoAgregado(event:any){
      const nombreProducto = event.option.value;
      this.productoSeleccionado = this.productList.find(p=>p.nombre===nombreProducto)||null;
      // this.filteredOptions = of(this.productList.map(p => p.nombre)); // Actualiza  opciones después de seleccionars
    //   this.filteredOptions.subscribe(); // Forzar actualización
    }

    agregarProducto(){
      if(this.productoSeleccionado){
        const productoenTabla = this.dataSource.data.find (p =>p.producto.nombre === this.productoSeleccionado!.nombre);
        if(productoenTabla){
          productoenTabla.cantidad++;
          this.productoSeleccionado.stock--;
          console.log(this.productoSeleccionado.stock);
          productoenTabla.precioTotal += this.productoSeleccionado.precioVenta;
          this.productTable.push (productoenTabla.producto);
          console.log(this.productTable);

        }else{
          const nuevoProducto ={
            producto: this.productoSeleccionado,
            cantidad:1,
            precioTotal: this.productoSeleccionado.precioVenta
          };
          this.productoSeleccionado.stock--;
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
        // this.dataSource.data = this.dataSource.data.filter(producto => producto !== productoAEliminar); 
        // this.calcularTotales(); 
        //Eliminar
      const index = this.productTable.findIndex(producto => producto.codigoProducto === productoAEliminar.producto.codigoProducto);
      if (index !== -1) {
      this.productTable.splice(index, 1);
      // this._ventaServicio.actualizarStock(productoAEliminar.producto).subscribe({ next: (result) => { 
      //   console.log('Stock actualizado', result); 
      // }, error: (errores) => { console.log('Error actualizando stock', errores);

      //  }, 
      // });
      } else { 
        Swal.fire({
           title: 'Producto no disponible!', 
           text: 'No hay productos disponibles para la venta.',
            icon: 'warning',
        });
      console.log(this.productTable);
    }
    this.dataSource.data = this.dataSource.data.filter(producto => producto !==productoAEliminar);
      this.calcularTotales();
  }
      
      calcularTotales() { 
        this.sumaTotalProductos = this.dataSource.data.reduce((acc, producto) => acc + producto.cantidad, 0);
        this.totalCompra = this.dataSource.data.reduce((acc, producto) => acc + producto.precioTotal, 0); 
        this.venta.total = this.totalCompra;
      }

      cobrar(){
        // const ventaData = {
        //    total: this.venta.total, 
        //    fecha: this.fechaActual
        //    };
        this._ventaServicio.insertarVenta(this.venta).subscribe({
          next: (result:any) => {
            console.log(result);
            Swal.fire({
              title: 'Venta Registrada!',
              text: 'Registro Exitoso!',
              icon: 'success',
            });
            this.insertarProductos(result.idVenta);
             this.confirmarVenta();
             const modalElement = document.getElementById('ventaModal');
             if (modalElement) {
               const modalInstance = bootstrap.Modal.getInstance(modalElement);
               if (modalInstance) {
                 modalInstance.hide(); // Cierra el modal sin oscurecer la pantalla
               }
             }
            //  const modalElement = document.getElementById('ventaModal');
            //  if (modalElement) {
            //    const modalInstance = bootstrap.Modal.getInstance(modalElement);
            //    if (modalInstance) {
            //      modalInstance.hide(); // Solo cierra el modal
            //    }
            //  }

            // this.cancelarVenta();

            // this.productTable.forEach(element => {
            //   this._productoServicio.updateProduct(element).subscribe({
            //     next: (datos)=>{
            //       console.log(datos);
            //     }
            //   })
            // });


            // const modalElement = document.getElementById('ventaModal'); 
            // if (modalElement) { 
            //   const modal = new bootstrap.Modal(modalElement); 
            //   modal.show();
            //  }
            // this.ventaRegistrada = true; 
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
         productoVenta = {
          idProducto: product.producto.codigoProducto,
          idVenta: idVenta,
          total: product.precioTotal,
          cantidad: product.cantidad,
          precio: product.producto.precioVenta,
        }; 
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
    cancelar(){
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
          this.productoSeleccionado = null; }
  
  }
  
