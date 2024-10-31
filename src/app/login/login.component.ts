import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Servicios/login-service.service';
import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';
import { Usuario } from '../models/usuario';
import { Rol } from '../models/rol';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  usuario: string
  password: string
  errorMessage: string;

  usuarioLogged: Usuario = new Usuario();

  constructor(private authService: LoginService,
    private router: Router,
    private usuarioLoggedService: UsuarioLoggedService
  ) { }

  ngOnInit(): void {

    if (this.usuarioLoggedService.getIsLogin()) {
      const rol = this.usuarioLoggedService.getUsuario().rol.idRol;
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
    this.authService.login(this.usuario, this.password).subscribe(
      response => {
        console.log('Servicio aplicado:', response);

        this.usuarioLogged.nombre = response.nombre;
        this.usuarioLogged.rol = new Rol();
        this.usuarioLogged.rol.idRol = response.id_Rol;

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
