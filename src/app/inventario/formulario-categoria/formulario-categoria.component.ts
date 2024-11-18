import { Component, OnInit, ViewChild } from '@angular/core';
import { EditarService } from '../../Servicios/editar.service';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoriaService } from '../../Servicios/categoria.service';
import { Categoria } from '../../models/categoria';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

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
  categoria: Categoria = new Categoria();

  mensajeErrorNombreCategoria: string = ''; 
  mensajeErrorDescripcionCategoria: string = ''; 

  constructor(
    private editarService: EditarService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.editarService.categoriaSeleccionada$.subscribe((categoria) => {
      if (categoria) {
        this.categoria = categoria;
        this.modoEdicion = true;
      }
    });
  }

  ngOnDestroy() {
    this.editarService.seleccionarCategoria(null);
  }

  guardar() {
    console.log('metodo guardar');
    if (this.categoriaForm.invalid) {
      this.categoriaForm.form.markAllAsTouched();
      return;
    }

    console.log(this.categoria);

    this.categoriaService.insertarCategoria(this.categoria).subscribe({
      next: (result) => {
        console.log(result);
        this.categoriaForm.resetForm();
        Swal.fire({
          title: 'Categoría Insertada!',
          text: 'Registro Exitoso!',
          icon: 'success',
        });
        this.router.navigate(['/gestor/inventario/tablaCategoria']);
      },
      error: (errores) => {
        Swal.fire({
          title: 'Categoría No Insertada!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });
  }

  actualizarCategoria() {
    console.log('editar categoria');
    if (this.categoriaForm.invalid) {
      this.categoriaForm.form.markAllAsTouched();
      return;
    }
    console.log(this.categoria);

    this.categoriaService.updateCategoria(this.categoria).subscribe({
      next: (result) => {
        console.log(result);
        Swal.fire({
          title: 'Categoría actualizada!',
          text: 'Actualización Exitosa!',
          icon: 'success',
        });
        this.categoriaForm.reset();
        this.modoEdicion = false;
        this.router.navigate(['/gestor/inventario/tablaCategoria']);
      },
      error: (errores) => {
        Swal.fire({
          title: 'Categoría No Actualizada!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });

  }

  validarNombreCategoria(): void {
    const nombre = this.categoria.nombre;   
    this.categoriaForm.controls['nombre'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorNombreCategoria = '';
    
    // Validaciones
    if (!nombre || nombre.trim() === '') {
      
      this.mensajeErrorNombreCategoria = 'Campo Requerido';
    } else if (nombre.length < 2) {
      this.mensajeErrorNombreCategoria = 'Longitud mínima: 2 caracteres';
    } else if (/^\d/.test(nombre)) {
      this.mensajeErrorNombreCategoria = 'No puede comenzar con un número';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
      this.mensajeErrorNombreCategoria = 'Solo se permiten letras y espacios';
    }else{
      this.categoriaForm.controls['nombre'].setErrors(null)
    } 
  }

  validarDescripcionCategoria(): void {
    const descripcion = this.categoria.descripcion;   
    this.categoriaForm.controls['descripcion'].setErrors({Error: true})
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
      this.categoriaForm.controls['descripcion'].setErrors(null)
    } 
  }

}
