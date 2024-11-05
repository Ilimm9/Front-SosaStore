import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { EditarService } from '../../Servicios/editar.service';
import { Rol } from '../../models/rol';
import { CommonModule } from '@angular/common';
import { RolService } from '../../Servicios/rol.service';
import { map } from 'rxjs';
import { UsuarioService } from '../../Servicios/usuario.service';
import Swal from 'sweetalert2';

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
    private editarService: EditarService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) { }

  ngOnInit() {
    this.editarService.usuarioSeleccionado$.subscribe((usuario) => {
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
    this.editarService.seleccionarUsuario(null);
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
      id_Rol: this.usuario.id_Rol,
    };
    //console.log(this.usuario);
    //console.log(datos);

    this.usuarioService.insertarUsuario({ datos }).subscribe({
      next: (result) => {
        //console.log(result);
        this.usuarioForm.resetForm();
        Swal.fire({
          title: "Usuario Insertado!",
          text: "Registro Exitoso!",
          icon: "success"
        });
      },
      error: (errores) => {
        Swal.fire({
          title: "Usuario No Insertado!",
          text: errores.toString(),
          icon: "error"
        });
      }

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
      id_Rol: this.usuario.id_Rol,
    };

    console.log(this.usuario);
    console.log(datos);

    this.usuarioService.actualizarUsuario({ datos }).subscribe({

      next: (result) => {
        console.log(result);
        Swal.fire({
          title: "Usuario Actualizado!",
          text: "Actualizacion Exitosa!",
          icon: "success"
        });
        // Limpiar el campo de contraseña en el modelo
        this.usuario.password = "";
        this.usuarioForm.reset();
        this.modoEdicion = false;
        setTimeout(() => {
          this.usuario.password = ""; // Refuerza que el campo de contraseña esté vacío
        });
      },
      error: (errores) => {
        Swal.fire({
          title: "Usuario No Actualizado!",
          text: errores.toString(),
          icon: "error"
        });
      }

    });
  }

  desactivarUsuario() {
    console.log('editar usuario')
    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }
    const dato = {
      id_usuario: this.usuario.idUsuario
    };

    this.usuarioService.desactivarUsuario(dato).subscribe({
      next: (result) => {
        this.usuario.activo = 0;
        console.log(result);
        Swal.fire({
          title: "Usuario Desactivado!",
          text: "Accion aplicada",
          icon: "success"
        });
      },
      error: (errores) => {
        Swal.fire({
          title: "Errror!",
          text: errores.toString(),
          icon: "error"
        });
      }

    });

  }

}
