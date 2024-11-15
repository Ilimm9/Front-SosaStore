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

  //  ngOnInit(): void {
  //   let usuario = this.usuariologgedService.getUsuario();
  //   this.usuarioService.getUsuariosCompletos().subscribe((usuariosCompletos)=> {
  //     for(let user of usuariosCompletos){
  //       if(user.idUsuario === usuario.idUsuario){
  //         this.usuario = user;
  //         console.log(this.usuario)
  //         break;
  //       }
  //     }
  //   })
  //   setTimeout(() => {},0)
    
  // }

  ngOnInit(): void {
    let usuario = this.usuariologgedService.getUsuario();
    let usuarios: Array<Usuario> = [];
    this.usuarioService.getUsuarios().subscribe((usuariosCompletos)=> {
      usuarios = Object.values(usuariosCompletos);
      for(let user of usuarios){
        // if(user.idUsuario === usuario.idUsuario){
        //   this.usuario = user;
        //   console.log(this.usuario)
        //   break;
        // }
      }
    })
    setTimeout(() => {},0)
    
  }
  
  editar(){
    this.editarService.seleccionarUsuario(this.usuario);
    this.router.navigate(['gestor/administrador/formulario-usuario'])
  }

}
