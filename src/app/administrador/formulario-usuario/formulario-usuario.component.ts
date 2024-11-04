import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioEditarService } from '../../Servicios/usuario-editar.service';
import { Rol } from '../../models/rol';
import { CommonModule } from '@angular/common';
import { RolService } from '../../Servicios/rol.service';
import { map } from 'rxjs';
import { UsuarioService } from '../../Servicios/usuario.service';

@Component({
  selector: 'app-formulario-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css'],
})
export class FormularioUsuarioComponent implements OnInit {
  @ViewChild('usuarioForm') usuarioForm: NgForm;

  usuario: Usuario = new Usuario();
  roles: Rol[] = [];
  modoEdicion: boolean = false;

  constructor(
    private usuarioEditarService: UsuarioEditarService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) { }

  ngOnInit() {
    this.usuarioEditarService.usuarioSeleccionado$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        this.modoEdicion = true;
      }
    });

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
      });
  }

  ngOnDestroy() {
    this.usuarioEditarService.seleccionarUsuario(null);
    // this.usuario = new Usuario();
  }

  guardar() {
    console.log("metodo guardar")
    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }

    this.usuario.activo = this.usuario.activo ? 1 : 0; // 1 para true, 0 para false

    const datos = {
      nombre: this.usuario.nombre,
      apellido1: this.usuario.primerApellido,
      apellido2: this.usuario.segundoApellido,
      telefono: this.usuario.telefono,
      nombre_Usuario: this.usuario.nombreUsuario,
      contrasenia: this.usuario.password,
      correo: this.usuario.correo,
      activo: this.usuario.activo,
      id_Rol: this.usuario.rol.idRol,
    };
    //console.log(this.usuario);
    //console.log(datos);

    this.usuarioService.insertarUsuario({ datos }).subscribe((result) => {
      //console.log(result);
      this.usuarioForm.resetForm();
    });
  }

  actualizarUsuario() {
    console.log('editar usuario')
    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }

    this.usuario.activo = this.usuario.activo ? 1 : 0; // 1 para true, 0 para false

    const datos = {
      id_usuario: this.usuario.idUsuario,
      nombre: this.usuario.nombre,
      apellido1: this.usuario.primerApellido,
      apellido2: this.usuario.segundoApellido,
      telefono: this.usuario.telefono,
      nombre_Usuario: this.usuario.nombreUsuario,
      contrasenia: this.usuario.password,
      correo: this.usuario.correo,
      activo: this.usuario.activo,
      id_Rol: this.usuario.rol.idRol,
    };

    console.log(this.usuario);
    console.log(datos);

    this.usuarioService.actualizarUsuario({ datos }).subscribe((result) => {
      console.log(result);
      // Limpiar el campo de contraseña en el modelo
      this.usuario.password = "";
      this.usuarioForm.reset();
      this.modoEdicion = false;
      setTimeout(() => {
        this.usuario.password = ""; // Refuerza que el campo de contraseña esté vacío
      });
    });
  }

  desactivarUsuario(){
    console.log('editar usuario')
    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }
    const dato = {
      id_usuario: this.usuario.idUsuario
    };

    this.usuarioService.desactivarUsuario(dato).subscribe((result) => {
      this.usuario.activo = 0;
      console.log(result);
    });

  }

}
