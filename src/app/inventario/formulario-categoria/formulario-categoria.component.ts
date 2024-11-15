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
import { Router, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-formulario-categoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './formulario-categoria.component.html',
  styleUrl: './formulario-categoria.component.css'
})
export class FormularioCategoriaComponent implements OnInit {
  @ViewChild('categoriaForm') categoriaForm: NgForm;
  categoriaControl = new FormControl();
  modoEdicion: boolean = false;
  categoria:Categoria = new Categoria();
  constructor(
    private editarService: EditarService,
    private productoService: ProductosServicioService,
    private categoriaService: CategoriaService,
    private router:Router
  ) {}

  ngOnInit() {
    this.editarService.categoriaSeleccionada$.subscribe((categoria) => {
      if (categoria) {
        this.categoria = categoria;
        this.modoEdicion = true;
      }
    });
}

  guardar() {
    console.log('metodo guardar');
    if (this.categoriaForm.invalid) {
      this.categoriaForm.form.markAllAsTouched();
      return;
    }


    const datos = {
      nombre: this.categoria.nombre,
      descripcion: this.categoria.descripcion,
    };
    console.log(this.categoria);
    console.log(datos);

    this.categoriaService.insertarCategoria({ datos }).subscribe({
      next: (result) => {
        console.log(result);
        this.categoriaForm.resetForm();
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

  actualizarCategoria() {
    console.log('editar producto');
    if (this.categoriaForm.invalid) {
      this.categoriaForm.form.markAllAsTouched();
      return;
    }

  

    const datos = {
      id_categoria: this.categoria.id_categoria,
      nombre: this.categoria.nombre,
      descripcion: this.categoria.descripcion,
    };

    console.log(this.categoria);
    console.log(datos);

    this.categoriaService.updateCategoria({ datos }).subscribe({
      next: (result) => {
        console.log(result);
        Swal.fire({
          title: 'Categoría actualizado!',
          text: 'Actualización Exitosa!',
          icon: 'success',
        });
        this.categoriaForm.reset();
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
