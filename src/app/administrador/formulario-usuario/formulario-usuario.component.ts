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

  constructor(
    private usuarioEditarService: UsuarioEditarService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.usuarioEditarService.usuarioSeleccionado$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
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
  }

  guardar() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }

    this.usuario.activo = this.usuario.activo ? true : false; // 1 para true, 0 para false

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
    console.log(this.usuario);
    console.log(datos);

    this.usuarioService.insertarUsuario({ datos }).subscribe((result) => {
      console.log(result);
      this.usuarioForm.resetForm();
    });
  }
}

// import { CommonModule } from '@angular/common';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { Usuario } from '../../models/usuario';
// import { UsuarioEditarService } from '../../Servicios/usuario-editar.service';
// import { Rol } from '../../models/rol';
// import { UsuarioServicioService } from '../../Servicios/usuario-servicio.service';

// @Component({
//   selector: 'app-formulario-usuario',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './formulario-usuario.component.html',
//   styleUrl: './formulario-usuario.component.css'
// })
// export class FormularioUsuarioComponent implements OnInit{

//   @ViewChild("usuarioForm") prendaForm: NgForm

//   usuario: Usuario = new Usuario(0,"","","","","","",new Rol(0,""))

//   roles = [
//     { "idRol": 1, "nombreRol": "Administrador" },
//     { "idRol": 2, "nombreRol": "Cajero" },
//     { "idRol": 3, "nombreRol": "Inventario" }
//   ]

//   constructor(private usuarioEditarService: UsuarioEditarService,
//     private usuarioService: UsuarioServicioService
//   ){}

//   nombre = '';
//   apellidoP = '';
//   apellidom= '';
//   telefono = '';
//   nomusu = '';
//   contrasenia = '';

//   ngOnInit() {
//     this.usuarioEditarService.usuarioSeleccionado$.subscribe(usuario => {
//       if(usuario !== null){
//         this.usuario = usuario;
//       }
//     });
//   }

//   ngOnDestroy() {
//     // Limpiar el usuario seleccionado al salir del formulario
//     this.usuarioEditarService.seleccionarUsuario(null);
//   }

//   guardar(){
//     console.log(this.usuario)
//     const datos = {
//       nombre: this.usuario.nombre,
//       apellido1: this.usuario.primerApellido,
//       apellido2: this.usuario.segundoApellido,
//       telefono: this.usuario.telefono,
//       nombre_Usuario: this.usuario.nombreUsuario,
//       contrasenia: this.usuario.password,
//       id_Rol: this.usuario.rol.idRol
//     };

//     this.usuarioService.insertarUsuario({datos}).subscribe((result) => {
//       console.log(result)
//     })
//   }

//   validarNom(){
//     // if(.nombre)

//   }

// }
