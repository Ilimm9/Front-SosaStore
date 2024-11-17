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
    MatOptionModule,
  ],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css',
})
export class AgregarProductoComponent implements OnInit {
  @ViewChild('productoForm') productoForm: NgForm;
  @ViewChild('categoriaNForm')categoriaNForm:NgForm;
  categoriaControl = new FormControl();
  filteredCategorias: Observable<any[]>;
  producto: Producto = new Producto();
  categorias: Array<Categoria> = [];
  productList: Array<Producto> = [];
  modoEdicion: boolean = false;
  visibleModal: boolean=false;
  nuevaCategoria:Categoria;
  constructor(
    private editarService: EditarService,
    private productoService: ProductosServicioService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
   this.iniciarCategorias();
    
  }
  iniciarCategorias(){
    this.categoriaService.getCategorias().subscribe((result) => {
      this.categorias = Object.values(result);
      
      this.filteredCategorias = this.categoriaControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const nombre =
            typeof value === 'string' ? value : value?.nombre || '';
          return nombre ? this._filter(nombre) : this.categorias.slice();
        })
      );

      this.editarService.productSeleccionado$.subscribe((producto) => {
        if (producto) {
          this.producto = producto;
          this.modoEdicion = true;
          const categoriaSeleccionada = this.categorias.find(
            (cat) => cat.codigoCategoria === producto.id_categoria
          );
          this.categoriaControl.setValue(categoriaSeleccionada);
        }
        //Aqui
        if (!this.modoEdicion) {
          this.productoService.getProductos().subscribe((result) => {
            this.productList = Object.values(result);
            //Aqui
            this.producto.codigo = `PRO${this.productList.length + 1}`;
          });
        }
      });
    });
    //Aqui
    this.productoService.getProductos().subscribe((result) => {
      this.productList = Object.values(result); 
      if(!this.modoEdicion){//Aqui
      this.producto.codigo = `PRO${this.productList.length + 1}`;}
    });
  }
  abrirModal() {
    this.visibleModal = true;
    this.nuevaCategoria = new Categoria(); // Reinicia el formulario
}

cerrarModal() {
    this.visibleModal = false;
    
} 

guardarNuevaCategoria(){
  if (this.categoriaNForm.invalid) {
    this.categoriaNForm.form.markAllAsTouched();
    return;
  }

  this.categoriaService.insertarCategoria(this.nuevaCategoria).subscribe({
    next: (result) => {
      console.log(result);
      this.iniciarCategorias();
      Swal.fire({
        title: 'Categoria Insertada!',
        text: 'Registro Exitoso!',
        icon: 'success',
      });      
      
      // Cierra el modal y reinicia el formulario
      this.cerrarModal();
    },
    error: (errores) => {
      Swal.fire({
        title: 'Categoria No Insertado!',
        text: errores.toString(),
        icon: 'error',
      });
    },
  });
}


  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(filterValue)
    );
  }
  displayCategoryName(categoria: any): string {
    return categoria ? categoria.nombre : '';
  }

  guardar() {
    console.log('metodo guardar');
    if (this.productoForm.invalid) {
      this.productoForm.form.markAllAsTouched();
      return;
    }

    // Obtiene la categoría seleccionada del control
    const categoriaSeleccionada = this.categoriaControl.value;

    // Asigna el id de la categoría a producto.id_categoria si existe una categoría seleccionada
    if (categoriaSeleccionada && categoriaSeleccionada.id_categoria) {
      this.producto.id_categoria = categoriaSeleccionada.id_categoria;
    } else {
      console.error('No se ha seleccionado una categoría válida');
      return; // Opcional: evita guardar si la categoría no es válida
    }

    const datos = {
      id_categoria: this.producto.id_categoria,
      codigo: this.producto.codigo,
      nombre: this.producto.nombre,
      stock: this.producto.stock,
      stock_min: this.producto.stock_min,
      stock_max: this.producto.stock_max,
      precio_venta: this.producto.precio_venta,
      precio_compra: this.producto.precio_compra,
    };
    console.log(this.producto);
    console.log(datos);

    this.productoService.insertarProducto({ datos }).subscribe({
      next: (result) => {
        console.log(result);
        this.productoForm.resetForm();
        this.categoriaControl.setValue('');
        Swal.fire({
          title: 'Producto Insertado!',
          text: 'Registro Exitoso!',
          icon: 'success',
        });
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
    const categoriaSeleccionada = this.categoriaControl.value;
    this.producto.id_categoria = categoriaSeleccionada.id_categoria;

    const datos = {
      id_producto: this.producto.id_producto,
      id_categoria: this.producto.id_categoria,
      codigo: this.producto.codigo,
      nombre: this.producto.nombre,
      stock: this.producto.stock,
      stock_min: this.producto.stock_min,
      stock_max: this.producto.stock_max,
      precio_venta: this.producto.precio_venta,
      precio_compra: this.producto.precio_compra,
    };

    console.log(this.producto);
    console.log(datos);

    this.productoService.updateProduct({ datos }).subscribe({
      next: (result) => {
        console.log(result);
        Swal.fire({
          title: 'Producto actualizado!',
          text: 'Actualización Exitosa!',
          icon: 'success',
        });
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
}
