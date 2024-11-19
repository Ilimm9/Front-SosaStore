import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { RouterLink } from '@angular/router';
import { EditarService } from '../../Servicios/editar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../Servicios/categoria.service';
import { Categoria } from '../../models/categoria';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tabla-categoria',
  standalone: true,
  imports: [
    RouterLink, 
    MatIconModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './tabla-categoria.component.html',
  styleUrl: './tabla-categoria.component.css'
})
export class TablaCategoriaComponent implements OnInit, AfterViewInit{

  categoriaList: Categoria[] = [];
  displayedColumns: string[] = ['nombre', 'descripcion','acciones'];
  dataSource = new  MatTableDataSource<Categoria>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private editarService: EditarService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (datos) => {
        this.categoriaList = datos;
        this.dataSource.data = this.categoriaList;
        console.log(this.categoriaList);
      }
    });
  }

  enviarCategoria(cat: Categoria) {
    if (cat) {
      console.log(cat);
      this.editarService.seleccionarCategoria(cat);
    }
  }

  deleteCategoria(cat: Categoria) {
    console.log(cat)
    this.categoriaService.deleteCategoria(cat).subscribe({
      next: (result) => {
        console.log(result)
        // Mensaje de éxito
        Swal.fire({
          title: 'Categoria eliminada!',
          text: 'El producto se ha eliminado con éxito.',
          icon: 'success',
        });
        this.obtenerCategorias();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

}
