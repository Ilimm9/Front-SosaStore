import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { EditarService } from '../../Servicios/editar.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './tabla-usuario.component.html',
  styleUrl: './tabla-usuario.component.css'
})
export class TablaUsuarioComponent implements OnInit, AfterViewInit {
  usuarios: Usuario[];
  displayedColumns: string[] = ['RFC', 'nombre', 'telefono', 'usuario', 'cargo', 'correo'];
  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  

  constructor(private editarService: EditarService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (datos) => {
        this.usuarios = Object.values(datos);
        this.dataSource.data = this.usuarios;
      },
      error: (errores) => {
        console.log(errores)
      }
    });
  }

  // enviarUsuario(event: MouseEvent) {
  //   let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
  //   console.log('enviamos a usuario');
  //   console.log(dataId)
  //   if (dataId === null) {
  //     return;
  //   }
  //   let id = parseInt(dataId);
  //   const usuario = this.usuarios.find(u => u.idUsuario === id);
  //   if (usuario) {
  //     console.log(usuario)
  //     this.editarService.seleccionarUsuario(usuario)
  //   }
  // }

}
