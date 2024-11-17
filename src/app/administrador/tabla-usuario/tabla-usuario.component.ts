import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTable } from 'simple-datatables';
import { Usuario } from '../../models/usuario';
import { EditarService } from '../../Servicios/editar.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './tabla-usuario.component.html',
  styleUrl: './tabla-usuario.component.css'
})
export class TablaUsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['nombre', 'cargo', 'correo', 'telefono', 'usuario', 'acciones'];
  dataSource = new  MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private editarService: EditarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerUsuarios(){
    this.usuarioService.getUsuarios().subscribe({
      next: (datos) => {
        this.usuarios = datos;
        this.dataSource.data = this.usuarios;
        console.log(this.usuarios);
      },
      error: (errores) => console.log(errores)
    });
  }

  enviarUsuario(event: MouseEvent) {
    let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
    console.log('enviamos a usuario');
    console.log(dataId)
    if (dataId === null) {
      return;
    }
    let id = parseInt(dataId);
    const usuario = this.usuarios.find(u => u.idUsuario === id);
    if (usuario) {
      console.log(usuario)
      this.editarService.seleccionarUsuario(usuario)
      this.router.navigate(['gestor/administrador/formulario-usuario'])
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

}
