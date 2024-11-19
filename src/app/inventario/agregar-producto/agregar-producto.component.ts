import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { EditarService } from '../../Servicios/editar.service';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoriaService } from '../../Servicios/categoria.service';
import { Categoria } from '../../models/categoria';
import { CommonModule } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css',
})
export class AgregarProductoComponent implements OnInit {

  @ViewChild('productoForm') productoForm: NgForm;
  @ViewChild('categoriaForm') categoriaForm: NgForm;

  categoriaControl = new FormControl();
  filteredCategorias: Observable<any[]>;
  producto: Producto = new Producto();
  categorias: Categoria[] = [];
  // productList: Producto[] = [];
  modoEdicion: boolean = false;
  visibleModal: boolean = false;
  nuevaCategoria: Categoria;

  nombreCategoria: string = ""

  mensajeErrorNombreProducto: string = ''; 
  mensajeErrorStock: string = ''; 
  mensajeErrorStockMin: string = ''; 
  mensajeErrorStockMax: string = '';
  mensajeErrorPrecioCompra: string = '';
  mensajeErrorPrecioVenta: string = '';
  mensajeErrorCategoria: string = '';

  mensajeErrorNombreCategoria: string = ''; 
  mensajeErrorDescripcionCategoria: string = ''; 

  cantProductos: number;

  constructor(
    private editarService: EditarService,
    private productoService: ProductosServicioService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.iniciarCategorias();
    this.contarProductos();
  }

  ngOnDestroy() {
    this.editarService.seleccionarProducto(null);
  }

  contarProductos(){
    this.productoService.countProducts().subscribe({
      next: (result) => {
        this.cantProductos = Number(result.cantProductos);
      }
    });
  }

  iniciarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (datos) => {
        this.categorias = datos;

        this.filteredCategorias = this.categoriaControl.valueChanges.pipe(
          startWith(''),
          map((value) => {
            const nombre =
              typeof value === 'string' ? value : value?.nombre || '';
            return nombre ? this._filter(nombre) : this.categorias.slice();
          })
        );

        this.editarService.productSeleccionado$.subscribe({
          next: (producto) => {
            if (producto) {
              this.producto = producto;
              this.modoEdicion = true;
              for(let cat of this.categorias){
                if(cat.codigoCategoria === this.producto.codigoCategoria){
                  this.nombreCategoria = cat.nombre;
                  console.log(this.nombreCategoria)
                  break;
                }
              }
              const categoriaSeleccionada = this.categorias.find(
                (cat) => cat.codigoCategoria === producto.codigoCategoria
              );
              this.categoriaControl.setValue(categoriaSeleccionada);
            }
            //Aqui
            // if (!this.modoEdicion) {
            //   this.productoService.getProductos().subscribe((result) => {
            //     this.productList = Object.values(result);
            //     //Aqui
            //     // this.producto.codigoProducto = `PRO${this.productList.length + 1}`;
            //   });
            // }
          }
        });
      }
    });
    //Aqui
    // this.productoService.getProductos().subscribe((result) => {
    //   this.productList = result;
    //   if (!this.modoEdicion) {//Aqui
    //     // this.producto.codigoProducto = `PRO${this.productList.length + 1}`;
    //   }
    // });
  }

  abrirCategorias() {
    this.router.navigate(['/gestor/inventario/formularioCategoria']);
    // setTimeout(() => {
    //   this.categoriaForm?.resetForm();
    // });
    // this.visibleModal = true;
    // this.nuevaCategoria = new Categoria(); // Reinicia el formulario
  }

  // cerrarModal() {
  //   this.visibleModal = false;
  // }

  // guardarNuevaCategoria() {
  //   if (this.categoriaForm.invalid) {
  //     this.categoriaForm.form.markAllAsTouched();
  //     return;
  //   }

  //   this.categoriaService.insertarCategoria(this.nuevaCategoria).subscribe({
  //     next: (result) => {
  //       console.log(result);
  //       this.iniciarCategorias();
  //       Swal.fire({
  //         title: 'Categoria Insertada!',
  //         text: 'Registro Exitoso!',
  //         icon: 'success',
  //       });

  //       // Cierra el modal y reinicia el formulario
  //       this.cerrarModal();
  //     },
  //     error: (errores) => {
  //       Swal.fire({
  //         title: 'Categoria No Insertado!',
  //         text: errores.toString(),
  //         icon: 'error',
  //       });
  //     },
  //   });
  // }

  validarNombreProducto(): void {
    const nombre = this.producto.nombre;   
    this.productoForm.controls['nombre'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorNombreProducto = '';
    
    // Validaciones
    if (!nombre || nombre.trim() === '') {
      
      this.mensajeErrorNombreProducto = 'Campo Requerido';
    } else if (nombre.length < 3) {
      this.mensajeErrorNombreProducto = 'Longitud mínima: 3 caracteres';
    } else if (/^\d/.test(nombre)) {
      this.mensajeErrorNombreProducto = 'No puede comenzar con un número';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
      this.mensajeErrorNombreProducto = 'Solo se permiten letras y espacios';
    }else{
      this.productoForm.controls['nombre'].setErrors(null)
    } 
  }

  validarStock(): void {
    const stock = this.producto.stock;   
    const stockMin = this.producto.stockMin;   
    const stockMax = this.producto.stockMax;   
    this.productoForm.controls['stock'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorStock = '';
    
    // Validaciones
    if (!stock) {
      this.mensajeErrorStock = 'Campo requerido';
    } else if(stock < stockMin || stock> stockMax){
      this.mensajeErrorStock = 'Solo se permite un numero dentro del rango del stock mínimo y máximo';
    }else{
      this.productoForm.controls['stock'].setErrors(null)
    } 
  }

  validarStockMin(): void {
    const stockMin = this.producto.stockMin;   
    this.productoForm.controls['stockMin'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorStockMin = '';
    
    // Validaciones
    if (!stockMin){
      this.mensajeErrorStockMin = 'Campo requerido';
    }else if(stockMin < 1) {
      this.mensajeErrorStockMin = 'Solo se permite un numero mayor a 1';
    } else{
      this.productoForm.controls['stockMin'].setErrors(null)
    } 
  }

  validarStockMax(): void {
    const stockMax = this.producto.stockMax;   
    const stockMin = this.producto.stockMin;   
    this.productoForm.controls['stockMax'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorStockMax = '';
    
    // Validaciones
    if(!stockMax){
      this.mensajeErrorStockMax = 'Campo requerido';
    } else if (stockMax < 2) {
      this.mensajeErrorStockMax = 'Solo se permite un numero mayor a 2';
    } else if(stockMax<=stockMin){
      this.mensajeErrorStockMax = 'No puede ser igual o mayor al stock mínimo';
    }else{
      this.productoForm.controls['stockMax'].setErrors(null)
    } 
  }

  validarPrecioCompra(): void {
    const precioCompra = this.producto.precioCompra;   
    this.productoForm.controls['precioCompra'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorPrecioCompra = '';
    
    // Validaciones
    if(!precioCompra){
      this.mensajeErrorPrecioCompra = 'Campo requerido';
    } else if (precioCompra < 0) {
      this.mensajeErrorPrecioCompra = 'Solo se permite un numero mayor 0';
    } else{
      this.productoForm.controls['precioCompra'].setErrors(null)
    } 
  }

  validarPrecioVenta(): void {
    const precioVenta = this.producto.precioVenta;   
    const precioCompra = this.producto.precioCompra;   
    this.productoForm.controls['precioVenta'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorPrecioVenta = '';
    
    // Validaciones
    if(!precioVenta){
      this.mensajeErrorPrecioVenta = 'Campo requerido';
    } else if (precioVenta <= precioCompra) {
      this.mensajeErrorPrecioVenta = 'El precio de venta no puede ser menor o igual al precio de compra';
    } else{
      this.productoForm.controls['precioVenta'].setErrors(null)
    } 
  }

  validarNombreCategoria(): void {
    const nombre = this.nuevaCategoria.nombre;
    this.categoriaForm?.controls['nombre']?.setErrors({ Error: true });
  
    this.mensajeErrorNombreCategoria = '';
  
    if (!nombre || nombre.trim() === '') {
      this.mensajeErrorNombreCategoria = 'Campo Requerido';
    } else if (nombre.length < 2) {
      this.mensajeErrorNombreCategoria = 'Longitud mínima: 2 caracteres';
    } else if (/^\d/.test(nombre)) {
      this.mensajeErrorNombreCategoria = 'No puede comenzar con un número';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
      this.mensajeErrorNombreCategoria = 'Solo se permiten letras y espacios';
    } else {
      this.categoriaForm?.controls['nombre']?.setErrors(null);
    }
    console.log(nombre);
    console.log(this.mensajeErrorNombreCategoria);
    console.log(this.categoriaForm);
  }
  

  validarDescripcionCategoria(): void {
    const descripcion = this.nuevaCategoria.descripcion;   
    this.categoriaForm?.controls['descripcion']?.setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorDescripcionCategoria = '';
    
    // Validaciones
    if (!descripcion || descripcion.trim() === '') {
      this.mensajeErrorDescripcionCategoria = 'Campo Requerido';
    } else if (descripcion.length < 10) {
      this.mensajeErrorDescripcionCategoria = 'Longitud mínima: 10 caracteres';
    } else if (/^\d/.test(descripcion)) {
      this.mensajeErrorDescripcionCategoria = 'No puede comenzar con un número';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(descripcion)) {
      this.mensajeErrorDescripcionCategoria = 'Solo se permiten letras y espacios';
    }else{
      this.categoriaForm?.controls['descripcion']?.setErrors(null)
    }
    console.log(descripcion);
    console.log(this.mensajeErrorDescripcionCategoria);
    console.log(this.categoriaForm);
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(filterValue)
    );
  }

  displayCategoryName(categoria: Categoria): string {
    return categoria ? categoria.nombre : '';
  }

  onCategorySelected(categoria: any): void {
    this.producto.codigoCategoria = categoria.codigoCategoria;
  }

  guardar() {

    console.log(this.producto);
    if (this.productoForm.invalid) {
      this.productoForm.form.markAllAsTouched();
      return;
    }

    const codCategoria = this.producto.codigoCategoria;

    //sacamos el nombre de la categoria para concatenar los 3 primeros caracteres al codigo del producto
    this.filteredCategorias.pipe(
      map(categorias =>
        categorias.find(categoria => categoria.codigoCategoria == codCategoria))
      ).subscribe(filteredCategorias => {
        if(filteredCategorias){
          console.log('Elemento encontrado: ',filteredCategorias);
          this.producto.nombreCategoria=filteredCategorias.nombre;
        }else{
          console.log('Elemento no encontrado');
        }
      });

    this.producto.codigoProducto = `${this.producto.nombre.slice(0,3).toUpperCase()}-${this.producto.nombreCategoria.slice(0,3).toUpperCase()}-${this.cantProductos+1}`;
    console.log('esto se va a guardar ',this.producto);

    this.productoService.insertarProducto(this.producto).subscribe({
      next: (result) => {
        console.log(result);
        this.productoForm.resetForm();
        this.categoriaControl.setValue('');
        Swal.fire({
          title: 'Producto Insertado!',
          text: 'Registro Exitoso!',
          icon: 'success',
        });
        this.router.navigate(['/gestor/inventario/tablaProducto']);
      },
      error: (errores) => {
        Swal.fire({
          title: 'Producto No Insertado!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });
  }

  actualizarProducto() {
    console.log('editar producto');
    if (this.productoForm.invalid) {
      this.productoForm.form.markAllAsTouched();
      return;
    }

    // Asigna la categoría seleccionada al producto antes de enviar la actualización
    // const categoriaSeleccionada = this.categoriaControl.value;
    // this.producto.id_categoria = categoriaSeleccionada.id_categoria;

    console.log(this.producto);

    this.productoService.updateProduct(this.producto).subscribe({
      next: (result) => {
        console.log(result);
        Swal.fire({
          title: 'Producto actualizado!',
          text: 'Actualización Exitosa!',
          icon: 'success',
        });
        this.router.navigate(['/gestor/inventario/tablaProducto']);
        this.productoForm.reset();
        this.categoriaControl.setValue('');
        this.modoEdicion = false;
        // setTimeout(() => {
        //   this.
        // });
      },
      error: (errores) => {
        Swal.fire({
          title: 'Producto No Actualizado!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });
  }

  onModalShown() {
    if (this.categoriaForm) {
      this.categoriaForm.resetForm();
    }
  }
  
}
