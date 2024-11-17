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
  @ViewChild('categoriaNForm') categoriaNForm: NgForm;

  categoriaControl = new FormControl();
  filteredCategorias: Observable<any[]>;
  producto: Producto = new Producto();
  categorias: Categoria[] = [];
  productList: Producto[] = [];
  modoEdicion: boolean = false;
  visibleModal: boolean = false;
  nuevaCategoria: Categoria;

  nombreCategoria: string = ""

  constructor(
    private editarService: EditarService,
    private productoService: ProductosServicioService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.iniciarCategorias();

  }

  ngOnDestroy() {
    this.editarService.seleccionarProducto(null);
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
            if (!this.modoEdicion) {
              this.productoService.getProductos().subscribe((result) => {
                this.productList = Object.values(result);
                //Aqui
                this.producto.codigoProducto = `PRO${this.productList.length + 1}`;
              });
            }
          }
        });
      }
    });
    //Aqui
    this.productoService.getProductos().subscribe((result) => {
      this.productList = result;
      if (!this.modoEdicion) {//Aqui
        this.producto.codigoProducto = `PRO${this.productList.length + 1}`;
      }
    });
  }

  abrirModal() {
    this.visibleModal = true;
    this.nuevaCategoria = new Categoria(); // Reinicia el formulario
  }

  cerrarModal() {
    this.visibleModal = false;

  }

  guardarNuevaCategoria() {
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

  displayCategoryName(categoria: Categoria): string {
    return categoria ? categoria.nombre : '';
  }

  onCategorySelected(categoria: any): void {
    this.producto.codigoCategoria = categoria.codigoCategoria;
  }

  guardar() {
    console.log('metodo guardar');

    console.log(this.producto);
    if (this.productoForm.invalid) {
      this.productoForm.form.markAllAsTouched();
      return;
    }

    console.log(this.producto);

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
