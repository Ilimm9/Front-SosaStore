import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login-service.service';

import { CommonModule } from '@angular/common';

import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';
import { Usuario } from '../models/usuario';
import { Rol } from '../models/rol';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  usuario: string = '';
  password: string = '';
  errorMessage: string = '';
  errorUsuario: string = '';
  errorPassword: string = '';
  mostrarRecuperacion: boolean = false;
  emailRecuperacion: string = '';

  usuarioLogged: Usuario = new Usuario();

  constructor(private authService: LoginService,
    private router: Router,
    private usuarioLoggedService: UsuarioLoggedService
  ) { }

  ngOnInit(): void {

    if (this.usuarioLoggedService.getIsLogin()) {
      const rol = this.usuarioLoggedService.getUsuario().id_Rol;
      if (rol === 1) {
        this.router.navigate(['gestor/cajero']);

      } else if (rol === 2) {
        this.router.navigate(['gestor/inventario']);

      } else if (rol == 3) {
        this.router.navigate(['gestor/administrador']);
      }
    }
  }

  login() {

    let isValid = true;
    if (!this.usuario) {
      this.errorUsuario = 'El campo usuario no puede estar vacío.';
      isValid = false;
    }
    if (!this.password) {
      this.errorPassword = 'El campo contraseña no puede estar vacío.';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    this.authService.login(this.usuario, this.password).subscribe(
      response => {
        console.log('Servicio aplicado:', response);
        console.log(response)
        this.usuarioLogged.nombre = response.nombre;
        this.usuarioLogged.idUsuario = response.id_usuario;
        // this.usuarioLogged.rol = new Rol();
        this.usuarioLogged.id_Rol = response.id_Rol;

        // Redirigir según el rol del usuario

        const rol = response.id_Rol;

        if (rol === 1) {
          this.router.navigate(['gestor/cajero']);
          console.log("administrador");
          this.usuarioLoggedService.setUsuario(this.usuarioLogged)
          this.usuarioLoggedService.setIsLogin(true);

        } else if (rol === 2) {
          this.router.navigate(['gestor/inventario']);
          console.log("inventario");
          this.usuarioLoggedService.setUsuario(this.usuarioLogged)
          this.usuarioLoggedService.setIsLogin(true);

        } else if (rol == 3) {
          this.router.navigate(['gestor/administrador']);
          console.log("administrador");

          console.log(this.usuarioLogged)
          this.usuarioLoggedService.setUsuario(this.usuarioLogged)
          this.usuarioLoggedService.setIsLogin(true);

        } else {
          this.errorMessage = 'Credenciales no validas.';
        }
      },
      error => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    );
  }

  onInputChange() {
    this.errorUsuario = '';
    this.errorPassword = '';
    this.errorMessage = '';
  }

  mostrarRecuperacionContrasenia() {
    this.mostrarRecuperacion = true;
    this.onInputChange();
  }

  recuperarContrasenia() {
    this.authService.recuperarContrasenia(this.emailRecuperacion).subscribe(
      response => {
        console.log('Solicitud de recuperación enviada:', response);
        this.mostrarRecuperacion = false;
        this.errorMessage = 'Solicitud de recuperación enviada, revisa tu correo.';
        console.log('Servicio aplicado:', response);

        // Redirigir según el rol del usuario
        const rol = response.id_Rol; 

        if (rol === 1) {
          this.router.navigate(['gestor/administrador']);
          console.log("administrador");
        } else if (rol === 2) {
          this.router.navigate(['inventario']); 
          console.log("inventario");
        } else if (rol == 3){
          this.router.navigate(['administrador']); 
          console.log("caja");
        } else {
          console.log('Verifica tus datos');
        }
      },
      error => {
        this.errorMessage = 'Error al intentar recuperar la contraseña';
      }
    );
  }
}




