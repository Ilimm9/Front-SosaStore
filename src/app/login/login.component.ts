import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  usuario:string
  password:string
  errorMessage: string;

  constructor(private authService: LoginService, private router: Router) { }
  
  login() {
    this.authService.login(this.usuario, this.password).subscribe(
      response => {
        console.log('Servicio aplicado:', response);

        // Redirigir según el rol del usuario
        const rol = response.id_Rol; // Asumiendo que id_Rol es el campo que contiene el rol del usuario

        if (rol === 1) {
          // this.router.navigate(['/admin']);
          console.log("administrador");
        } else if (rol === 2) {
          // this.router.navigate(['/inventario']); 
          console.log("inventario");
        } else if (rol == 3){
          // this.router.navigate(['/caja']); 
          console.log("caja");
        } else {
          console.log('Verifica tus datos');
        }
      },
      error => {
        this.errorMessage = 'Ocurrió un error';
      }
    );
  }
  username(username: any, password: String) {
    throw new Error('Method not implemented.');
  }
}
