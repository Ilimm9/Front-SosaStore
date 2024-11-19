import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UsuarioLoggedService } from './usuario-logged.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private usuarioLoggedService: UsuarioLoggedService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.usuarioLoggedService.getUsuario();
    const allowedRoles = route.data['roles'] as number[]; // Cambiado a 'roles'

    if (user && allowedRoles.includes(Number(user.idRol))) {
      return true;
    } else {
      this.router.navigate(['/login']);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "No tienes permisos para este módulo",
        showConfirmButton: false,
        timer: 1500
      });
      return false;
    }
  }
}
