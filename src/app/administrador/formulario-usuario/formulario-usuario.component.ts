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
  roles: Array<Rol> = [];
  modoEdicion: boolean = false;
  mensajeErrorNombre: string = ''; 
  mensajeErrorAp1: string = '';
  errorTel: string = '';
  mensajeErrorCorreo: string = ''; 
  mensajeErrorUsuario: string = '';
  mensajeErrorPassword: string = '';
  mensajeErrorRol: string = '';


  constructor(
    private editarService: EditarService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.editarService.usuarioSeleccionado$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        console.log(this.usuario)
        this.modoEdicion = true;
      }
    });

    this.rolService.obtenerRoles().subscribe((result) => {
      this.roles = Object.values(result);
      console.log("Roles:", this.roles);
    });
  }

  ngOnDestroy() {
    this.editarService.seleccionarUsuario(null);
  }

  validarNombre(): void {
    const nombre = this.usuario.nombre;   
    this.usuarioForm.controls['nombre'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorNombre = '';
    
    // Validaciones
    if (!nombre || nombre.trim() === '') {
      
      this.mensajeErrorNombre = 'Campo Requerido';
    } else if (nombre.length < 3) {
      this.mensajeErrorNombre = 'Longitud mínima: 3 caracteres';
    } else if (/^\d/.test(nombre)) {
      this.mensajeErrorNombre = 'No puede comenzar con un número';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
      this.mensajeErrorNombre = 'Solo se permiten letras y espacios';
    }else{
      this.usuarioForm.controls['nombre'].setErrors(null)

    } 
  }
  validarApellido(): void {
    
    const apellido = this.usuario.apellido1;
    this.usuarioForm.controls['apellido1'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorAp1 = '';
    // Validaciones
    if (!apellido || apellido.trim() === '') {
      this.mensajeErrorAp1 = 'Campo Requerido';
    } else if (apellido.length < 2) {
      this.mensajeErrorAp1 = 'Largo mínimo: 2 caracteres';
    } else if (/^\d/.test(apellido)) {
      this.mensajeErrorAp1 = 'No puede comenzar con un número';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(apellido)) {
      this.mensajeErrorAp1 = 'Solo se permiten letras y espacios';
    }else{
      this.usuarioForm.controls['apellido1'].setErrors(null)
    }
  }
  validarTelefono(): void {
    
    const telefono = this.usuario.telefono;
    this.usuarioForm.controls['telefono'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.errorTel = '';
    // Validaciones
    if ( telefono.trim() === '') {
      this.errorTel = 'Campo Requerido';
    } else if (!/^\d{10}$/.test(telefono)) {
      this.errorTel = 'Solo se permiten 10 digitos numericos';
    }else{
      this.usuarioForm.controls['telefono'].setErrors(null)
  }
}
  
  validarCorreo(): void {
    
    const correo = this.usuario.correo;
    this.usuarioForm.controls['correo'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorCorreo = '';
    // Validaciones
    if (correo.trim() === '') {
      this.mensajeErrorCorreo = 'Campo Requerido';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)) {
      this.mensajeErrorCorreo = 'Correo incorrecto';
    }else{
      this.usuarioForm.controls['correo'].setErrors(null)
    }
  }

  validarUsuario(): void {
    
    const usuario = this.usuario.nombreUsuario;
    this.usuarioForm.controls['nombreUsuario'].setErrors({Error: true})
    // Limpia el mensaje de error antes de validar
    this.mensajeErrorUsuario = '';
    // Validaciones
    if ( usuario.trim() === '') {
      this.mensajeErrorUsuario = 'Campo Requerido';
    }  else if (usuario.length < 2) {
      this.mensajeErrorUsuario = 'Largo mínimo: 2 caracteres';
    }else if (!/^[a-zA-Z0-9]+$/.test(usuario)) {
      this.mensajeErrorUsuario = 'Formato invalido';
    }else{
      this.usuarioForm.controls['nombreUsuario'].setErrors(null)
  }
}

  validarContrasenia(): void {
  
    const contrasenia = this.usuario.password;
    this.usuarioForm.controls['password'].setErrors({Error: true})
    this.mensajeErrorPassword = '';
    // Validaciones
    if ( contrasenia.trim() === '') {
      this.mensajeErrorPassword = 'Campo Requerido';
    } else if (contrasenia.length < 8) {
      this.mensajeErrorPassword = 'Mínimo: 8 caracteres';
    }else if (!/[A-Z]/.test(contrasenia)) {
        this.mensajeErrorPassword = 'La contraseña debe contener al menos una letra mayúscula';
    }else if (!/[a-z]/.test(contrasenia)) {
        this.mensajeErrorPassword = 'La contraseña debe contener al menos una letra minúscula';
    }else if (!/\d/.test(contrasenia)) {
        this.mensajeErrorPassword = 'La contraseña debe contener al menos un número';
    }else if (!/[@$!%*?&_]/.test(contrasenia)) {
        this.mensajeErrorPassword = 'La contraseña debe contener al menos un carácter especial (@$!%*?&_)';
    }else if (/(.)\1{2,}/.test(contrasenia)){
      this.mensajeErrorPassword = 'No se permiten caracteres seguidos';
    }else{
      this.usuarioForm.controls['password'].setErrors(null)
  }
}

  guardar() {
    console.log('metodo guardar');
    console.log(this.usuario)
    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }
    this.usuario.activo = this.usuario.activo ? 1 : 0; // 1 para true, 0 para false

    this.usuarioService.insertarUsuario(this.usuario).subscribe({
      next: (result) => {
        console.log(result);
        this.usuarioForm.resetForm();
        Swal.fire({
          title: 'Usuario Insertado!',
          text: 'Registro Exitoso!',
          icon: 'success',
        });
      },
      error: (errores) => {
        console.log(errores);
        Swal.fire({
          title: 'Usuario No Insertado!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });
  }

  actualizarUsuario() {
    console.log('editar usuario');

    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }
    this.usuario.activo = this.usuario.activo ? 1 : 0; // 1 para true, 0 para false

    console.log(this.usuario)
    this.usuarioService.actualizarUsuario(this.usuario).subscribe({
      next: (result) => {
        console.log(result);
        Swal.fire({
          title: 'Usuario Actualizado!',
          text: 'Actualizacion Exitosa!',
          icon: 'success',
        });
        // Limpiar el campo de contraseña en el modelo
        this.usuario.password = '';
        this.usuarioForm.reset();
        this.modoEdicion = false;
        setTimeout(() => {
          this.usuario.password = ''; // Refuerza que el campo de contraseña esté vacío
        });
      },
      error: (errores) => {
        Swal.fire({
          title: 'Usuario No Actualizado!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });
  }

  desactivarUsuario() {
    console.log('editar usuario');
    if (this.usuarioForm.invalid) {
      this.usuarioForm.form.markAllAsTouched();
      return;
    }

    this.usuarioService.desactivarUsuario(this.usuario).subscribe({
      next: (result) => {
        this.usuario.activo = 0;
        console.log(result);
        Swal.fire({
          title: 'Usuario Desactivado!',
          text: 'Accion aplicada',
          icon: 'success',
        });
      },
      error: (errores) => {
        Swal.fire({
          title: 'Errror!',
          text: errores.toString(),
          icon: 'error',
        });
      },
    });
  }
}
