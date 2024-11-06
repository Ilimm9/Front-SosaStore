import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { EditarService } from '../../Servicios/editar.service';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { NgForm } from '@angular/forms';
import { CategoriaService } from '../../Servicios/categoria.service';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent implements OnInit {
  @ViewChild('usuarioForm') usuarioForm: NgForm;

  producto: Producto = new Producto();
  categorias: Categoria[] = [];
  modoEdicion: boolean = false;

  constructor(
    private editarService: EditarService,
    private productoService: ProductosServicioService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() { 
    
  }
}
