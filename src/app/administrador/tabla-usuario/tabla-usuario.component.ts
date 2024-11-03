import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from 'simple-datatables';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { UsuarioEditarService } from '../../Servicios/usuario-editar.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { map } from 'rxjs';
import { RolService } from '../../Servicios/rol.service';

@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tabla-usuario.component.html',
  styleUrl: './tabla-usuario.component.css'
})
export class TablaUsuarioComponent implements OnInit {

  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;

  roles: Rol[] = [];
  usuarios: Usuario[] = []

  constructor(private usuarioEditarService: UsuarioEditarService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    this.consultarUsuarios();

  }

  consultarRoles() {
    this.rolService
      .obtenerRoles()
      .pipe(
        map(
          (
            roles: any[]
          ) =>
            roles.map((rolData: any) => {
              // rolData es de tipo any
              const rol = new Rol();
              rol.idRol = rolData.id_rol;
              rol.nombreRol = rolData.nombre;
              return rol;
            })
        )
      )
      .subscribe((transformedRoles) => {
        this.roles = transformedRoles;
        console.log(this.roles)
        setTimeout(() => {
          this.usuarios = this.usuarios.map((user) => {
            const rolEncontrado = this.roles.find((rol) => rol.idRol === user.rol.idRol); // Busca el rol usando idRol

            if (rolEncontrado) {
              // Si el rol fue encontrado, lo asignamos al usuario
              user.rol = rolEncontrado;
            }
            return user; // Retorna el usuario actualizado
          });

          console.log(this.usuarios)
        }, 0);
      });
  }

  consultarUsuarios() {
    this.usuarioService.getUsuarios().subscribe(transformedUsuarios => {
      this.usuarios = transformedUsuarios; // Asigna los usuarios

      this.consultarRoles();



      // Espera un momento para asegurarte de que el DOM se haya actualizado
      setTimeout(() => {
        this.initDataTable(); // Inicializa la DataTable después de que el DOM se haya actualizado
      }, 0);

    }, error => {
      console.error('Error al obtener usuarios:', error); // Manejo de errores
    });
  }

  initDataTable() {
    // Asegúrate de que hay datos en la tabla antes de inicializarla
    if (this.datatablesSimple && this.usuarios.length > 0) {
      // Inicializa la DataTable
      new DataTable(this.datatablesSimple.nativeElement);
    }
  }

  enviarUsuario(event: MouseEvent) {
    let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
    console.log(dataId)
    if (dataId === null) {
      return;
    }
    let id = parseInt(dataId);
    const usuario = this.usuarios.find(u => u.idUsuario === id);
    if (usuario) {
      console.log(usuario)
      this.usuarioEditarService.seleccionarUsuario(usuario)
    }
  }

}
