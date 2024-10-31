import { Component, EventEmitter, OnInit, output, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioLoggedService } from '../Servicios/usuario-logged.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  @Output() toggleSidebarEvent: EventEmitter<boolean> = new  EventEmitter();

  constructor(private usuarioLoggedService : UsuarioLoggedService,
    private router: Router
  ){}

  isSidebarToggled: boolean = false;

  ngOnInit(): void {
    
    // Comprobar el estado guardado en localStorage al cargar el componente
    const savedToggleState = localStorage.getItem('sb|sidebar-toggle');
    this.isSidebarToggled = savedToggleState === 'true';
  }
  

  // Método para alternar la visibilidad de la barra lateral
  toggleSidebar(event: Event): void {
    event.preventDefault();
    this.isSidebarToggled = !this.isSidebarToggled;

    // Guardar el estado en localStorage
    localStorage.setItem('sb|sidebar-toggle', String(this.isSidebarToggled));

    this.toggleSidebarEvent.emit(this.isSidebarToggled);
  }

  onDropdownClick(event: Event): void {
    event.preventDefault();
  }

  cerrarSession(){
    this.usuarioLoggedService.setIsLogin(false);
    this.usuarioLoggedService.clearUsuario()
    this.router.navigate(['/login'])

  }

}
