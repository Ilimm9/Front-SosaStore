import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';
import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';
import { UsuarioService } from '../Servicios/usuario.service';
import { UsuarioEditarService } from '../Servicios/usuario-editar.service';
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
    private usuarioEditarService: UsuarioEditarService,
    private router: Router
   ){}

  ngOnInit(): void {
    let usuario = this.usuariologgedService.getUsuario();
    this.usuarioService.getUsuariosCompletos().subscribe((usuariosCompletos)=> {
      for(let user of usuariosCompletos){
        if(user.idUsuario === usuario.idUsuario){
          this.usuario = user;
          console.log(this.usuario)
          break;
        }
      }
    })
    setTimeout(() => {},0)
    
  }
  
  editar(){
    this.usuarioEditarService.seleccionarUsuario(this.usuario);
    this.router.navigate(['gestor/administrador/formulario-usuario'])
  }

}
