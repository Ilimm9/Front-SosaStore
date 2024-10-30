import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login-service.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // usuario:string
  // password:string
  // errorMessage: string;
  // mostrarRecuperacion: boolean = false;
  // emailRecuperacion: string; 
  usuario: string = '';
  password: string = '';
  errorMessage: string = '';
  errorUsuario: string = '';
  errorPassword: string = '';
  mostrarRecuperacion: boolean = false;
  emailRecuperacion: string = ''; 


  constructor(private authService: LoginService, private router: Router) { }
  
  login() {
       // Reiniciar msj de error
       this.errorUsuario = '';
       this.errorPassword = '';
       this.errorMessage = '';
   
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
           const rol = response.id_Rol;
   
           // Redirigir según el rol del usuario
           if (rol === 1) {
             this.router.navigate(['cajero']);
           } else if (rol === 2) {
             this.router.navigate(['inventario']); 
           } else if (rol === 3) {
             this.router.navigate(['administrador']); 
           } else {
             console.log('Verifica tus datos');
           }
         },
         error => {
           this.errorMessage = 'Usuario o contraseña incorrectos';
         }
       );
     }

  mostrarRecuperacionContrasenia() {
    this.mostrarRecuperacion = true;
  }

  recuperarContrasenia() {
    this.authService.recuperarContrasenia(this.emailRecuperacion).subscribe(
      response => {
        console.log('Solicitud de recuperación enviada:', response);
        this.mostrarRecuperacion = false;
        this.errorMessage = 'Solicitud de recuperación enviada, revisa tu correo.';
        console.log('Servicio aplicado:', response);

        // Redirigir según el rol del usuario
        const rol = response.id_Rol; // Asumiendo que id_Rol es el campo que contiene el rol del usuario

        if (rol === 1) {
          this.router.navigate(['gestor/administrador']);
          console.log("administrador");
        } else if (rol === 2) {
          this.router.navigate(['inventario']); 
          console.log("inventario");
        } else if (rol == 3){
          this.router.navigate(['gestor/administrador']); 
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




