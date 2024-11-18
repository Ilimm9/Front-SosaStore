import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { EditarService } from '../../Servicios/editar.service';
import { Rol } from '../../models/rol';
import { CommonModule, NumberFormatStyle } from '@angular/common';
import { RolService } from '../../Servicios/rol.service';
import { map } from 'rxjs';
import { UsuarioService } from '../../Servicios/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  mensajeErrorRfc: string = '';



  constructor(
    private editarService: EditarService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router
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

  convertirMayusculas(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase(); // Convierte el texto a mayúsculas
    this.usuarioForm.controls['rfcUsuario'].setValue(input.value); // Actualiza el valor en el formulario reactivo
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

  validarRfc(): void {
    
    const rfc = this.usuario.rfc;
    this.usuarioForm.controls['rfc'].setErrors({Error: true})
    this.mensajeErrorRfc = '';
    if ( rfc.trim() === '') {
      this.mensajeErrorRfc = 'Campo Requerido';
    } else if (!/^[A-ZÑ&]{3,4}/.test(rfc)) {
      this.mensajeErrorRfc = 'Debe iniciar con 3 o 4 letras';
    } else if (rfc.length < 12 || rfc.length > 13) {
      this.mensajeErrorRfc = 'El RFC debe tener 12 o 13 caracteres';
    } else {
      const fecha = rfc.slice(rfc.length === 12 ? 3 : 4, rfc.length === 12 ? 9 : 10); // Fecha según tipo de RFC
  
      if (!validarFechaRFC(fecha)) {
        this.mensajeErrorRfc = 'Debe contener una fecha válida en formato AAMMDD';
      } else if (!/[A-Z\d]{2}[A\d]$/.test(rfc.slice(rfc.length - 3))) {
        this.mensajeErrorRfc = 'Formato de homoclave o dígito verificador incorrecto';
      } else {
        this.usuarioForm.controls['rfc'].setErrors(null)
      }
    }
  
    function validarFechaRFC(fecha: string): boolean {
      if (fecha.length !== 6) return false;
  
      const año = parseInt(fecha.slice(0, 2), 10);
      const mes = parseInt(fecha.slice(2, 4), 10);
      const dia = parseInt(fecha.slice(4, 6), 10);
  
      if (mes < 1 || mes > 12) return false;
  
      const diasPorMes = [31, (año % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return dia >= 1 && dia <= diasPorMes[mes - 1];
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
      this.mensajeErrorCorreo = 'Formato incorrecto';
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
    } else if (contrasenia.length < 8 || contrasenia.length >15) {
      this.mensajeErrorPassword = 'La contraseña debe contener de 8 a 15 caracteres';
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
        this.router.navigate(['/gestor/administrador/tabla-usuario']);
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
        this.router.navigate(['/gestor/administrador/tabla-usuario']);
        // Limpiar el campo de contraseña en el modelo
        this.usuario.password = '';
        this.usuarioForm.reset();
        this.modoEdicion = false;
        setTimeout(() => {
          this.usuario.password = ''; 
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
