import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioLoggedService } from './usuario-logged.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioLoggedService: UsuarioLoggedService, private router: Router) {}

  canActivate(): boolean {
    const user = this.usuarioLoggedService.getUsuario();
    if (user && user.rfc) {
      return true;
    } else {
      // Si no está autenticado, redirigir al login y limpiar datos
      // this.loginService.logout();
      this.usuarioLoggedService.setIsLogin(false);
      this.usuarioLoggedService.clearUsuario();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
