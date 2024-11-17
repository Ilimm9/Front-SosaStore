import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../Servicios/usuario.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  errorMessage: string = '';
  errorUsuario: string = '';
  errorPassword: string = '';
  mostrarRecuperacion: boolean = false;
  emailRecuperacion: string = '';

  usuarioLogged: Usuario = new Usuario();

  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private usuarioLoggedService: UsuarioLoggedService
  ) { }

  ngOnInit(): void {

    if (this.usuarioLoggedService.getIsLogin()) {
      const rol = this.usuarioLoggedService.getUsuario().idRol;
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
    console.log(this.usuario);

    let isValid = true;
    if (!this.usuario.nombreUsuario) {
      this.errorUsuario = 'El campo usuario no puede estar vacío.';
      isValid = false;
    }
    if (!this.usuario.password) {
      this.errorPassword = 'El campo contraseña no puede estar vacío.';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    this.usuarioService.login(this.usuario).subscribe( {
      next : (response) => {
        
        this.usuario = response;
        console.log(this.usuario)

        // Redirigir según el rol del usuario

        const rol = this.usuario.idRol;

        if (rol === 1) {
          this.router.navigate(['gestor/cajero']);
          console.log("administrador");
          this.usuarioLoggedService.setUsuario(this.usuario)
          this.usuarioLoggedService.setIsLogin(true);

        } else if (rol === 2) {
          this.router.navigate(['gestor/inventario']);
          console.log("inventario");
          this.usuarioLoggedService.setUsuario(this.usuario)
          this.usuarioLoggedService.setIsLogin(true);

        } else if (rol == 3) {
          this.router.navigate(['gestor/administrador']);
          console.log("administrador");

          console.log(this.usuarioLogged)
          this.usuarioLoggedService.setUsuario(this.usuario)
          this.usuarioLoggedService.setIsLogin(true);

        } else {
          this.errorMessage = 'Credenciales no validas.';
        }
      },
      error: (errores) => {
        console.log("eneramos al error")
        console.log(errores)
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
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
    this.usuarioService.recuperarContrasenia(this.emailRecuperacion).subscribe(
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




