import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { DataTable } from 'simple-datatables';
import { RouterLink } from '@angular/router';
import { EditarService } from '../../Servicios/editar.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../Servicios/categoria.service';
import { Categoria } from '../../models/categoria';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-categoria',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './tabla-categoria.component.html',
  styleUrl: './tabla-categoria.component.css'
})
export class TablaCategoriaComponent implements OnInit{
  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;
  categoriaList: Array<Categoria> = [];

  constructor(
    private editarService: EditarService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoriaService.getCategorias().subscribe((result) => {
      this.categoriaList = Object.values(result);
      console.log(this.categoriaList);
      // this.imprimirItems();
      setTimeout(() => {
        this.initDataTable(); // Inicializa la DataTable después de que el DOM se haya actualizado
      }, 0);
    });
  }

  // imprimirItems() {
  //   console.log("Imprimimos items");
  //   this.productList.forEach((item) => {
  //     console.log('ID:', item.id_producto);
  //     console.log('Nombre:', item.id_categoria);
  //     console.log('Rol:', item.codigo);
  //     console.log('Cuenta:', item.nombre);
  //     console.log('Teléfono:', item.stock);
  //     console.log('Fecha de Nacimiento:', item.stock_min);
  //     console.log('Área:', item.stock_max);
  //     console.log('Género:', item.precio_venta);
  //     console.log('Género:', item.precio_compra);
  //     console.log('---------------------------------');
  //   });
  // }

  initDataTable() {
    // Asegúrate de que hay datos en la tabla antes de inicializarla
    if (this.datatablesSimple && this.categoriaList.length > 0) {
      // Inicializa la DataTable
      new DataTable(this.datatablesSimple.nativeElement, {
        labels: {
          placeholder: 'Buscar...',
          perPage: 'registros por página',
          noRows: 'No se encontraron registros',
          info: 'Mostrando {start} a {end} de {rows} registros',
          noResults: 'No se encontraron coincidencias',
        },
      });
    }
  }

  enviarCategoria(event: MouseEvent) {
    let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
    console.log('enviamos categoria');
    console.log(dataId);
    if (dataId === null) {
      return;
    }
    let id = parseInt(dataId);
    const categoria = this.categoriaList.find((c) => c.id_categoria === id);
    if (categoria) {
      console.log(categoria);
      this.editarService.seleccionarCategoria(categoria);
    }
  }

  deleteCategoria(id_categoria: number) {
    const datos = {
      id_categoria: id_categoria,
    };
    this.categoriaService.deleteCategoria({ datos }).subscribe({
      next: (result) => {
        // Mensaje de éxito
        Swal.fire({
          title: 'Categoria eliminada!',
          text: 'El producto se ha eliminado con éxito.',
          icon: 'success',
        });
        this.loadCategorias();
      },
      error: (error) => {
        // Manejo del error
        Swal.fire({
          title: 'Error al eliminar la categoría',
          text: 'Hubo un problema al intentar eliminar la categoría. Por favor, inténtalo nuevamente.',
          icon: 'error',
        });
        console.error('Error al eliminar el producto:', error); // O puedes registrar el error para depuración
      }
    });
    
  }

}
