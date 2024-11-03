import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-layout-side-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './layout-side-nav.component.html',
  styleUrl: './layout-side-nav.component.css'
})
export class LayoutSideNavComponent implements OnInit{

  usuarioLogged: Usuario

  constructor(private usuarioLoggedService: UsuarioLoggedService){}

  ngOnInit(): void {
    this.usuarioLogged = this.usuarioLoggedService.getUsuario();
    
  }

  


}
