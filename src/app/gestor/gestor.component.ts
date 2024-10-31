import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { LayoutSideNavComponent } from "../layout-side-nav/layout-side-nav.component";
import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';

@Component({
  selector: 'app-gestor',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, LayoutSideNavComponent],
  templateUrl: './gestor.component.html',
  styleUrl: './gestor.component.css'
})
export class GestorComponent implements OnInit {

  isSidebarToggled: boolean = false;

  constructor(private usuarioLoggedService: UsuarioLoggedService){}

  ngOnInit(): void {

    if(this.usuarioLoggedService.getIsLogin()){
      return;
    }

    // Comprobar el estado guardado en localStorage al cargar el componente
    const savedToggleState = localStorage.getItem('sb|sidebar-toggle');
    this.isSidebarToggled = savedToggleState === 'true';


  }

  onToggleSidebar(isToggled: boolean): void {
    this.isSidebarToggled = isToggled; // Actualiza el estado
  }

}
