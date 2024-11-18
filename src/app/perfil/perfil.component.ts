import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';
import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';
import { UsuarioService } from '../Servicios/usuario.service';
import { EditarService } from '../Servicios/editar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  usuario: Usuario;

  constructor(private usuariologgedService: UsuarioLoggedService,
    private usuarioService: UsuarioService,
    private editarService: EditarService,
    private router: Router
   ){}

  ngOnInit(): void {
    let usuario = this.usuariologgedService.getUsuario();
    let usuarios: Usuario[] = [];
    this.usuarioService.getUsuarios().subscribe({
      next: (datos) => {
        usuarios = datos;
        for(let user of usuarios){
          if(user.rfc === usuario.rfc){
            this.usuario = user;
            console.log(this.usuario)
            break;
          }
        }
      }, 
      error: (errores) => console.log(errores)
    });
  }
  
  editar(){
    this.editarService.seleccionarUsuario(this.usuario);
    this.router.navigate(['gestor/administrador/formulario-usuario'])
  }

}
