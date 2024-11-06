import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { EditarService } from '../../Servicios/editar.service';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoriaService } from '../../Servicios/categoria.service';
import { Categoria } from '../../models/categoria';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent implements OnInit {
  @ViewChild('productoForm') productoForm: NgForm;

  producto: Producto = new Producto();
  categorias: Categoria[] = [];
  modoEdicion: boolean = false;

  constructor(
    private editarService: EditarService,
    private productoService: ProductosServicioService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() { 
    this.categoriaService.getCategorias().subscribe((result) => {
      this.categorias = Object.values(result);
      // this.imprimirItems();
    });
  }

  guardar() {
    console.log('metodo guardar');
    // if (this.productoForm.invalid) {
    //   this.productoForm.form.markAllAsTouched();
    //   return;
    // }

    

    const datos = {
      id_categoria:  this.producto.id_categoria,
      codigo:        this.producto.codigo,
      nombre:        this.producto.nombre,
      stock:         this.producto.stock,
      stock_min:     this.producto.stock_min,
      stock_max:     this.producto.stock_max,
      precio_venta:  this.producto.precio_venta,
      precio_compra: this.producto.precio_compra
    };
    console.log(this.producto);
    console.log(datos);

    this.productoService.insertarProducto({ datos }).subscribe({
      next: (result) => {
        console.log(result);
        this.productoForm.resetForm();
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
}
