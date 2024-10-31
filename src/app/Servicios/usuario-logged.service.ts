import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLoggedService {

  private usuarioKey = 'usuario';
  private isLoginKey = 'isLogged';

  constructor() { }

  setUsuario(usuario: Usuario): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  setIsLogin(isLogin: boolean): void {
    localStorage.setItem(this.isLoginKey, JSON.stringify(isLogin));
  }

  clearUsuario(): void {
    localStorage.removeItem(this.usuarioKey);
  }

  clearIsLogged(): void{
    localStorage.removeItem(this.isLoginKey);
  }

  getUsuario(): Usuario {
    const empleadoJson = localStorage.getItem(this.usuarioKey);
    return empleadoJson ? JSON.parse(empleadoJson) : null;
  }

  getIsLogin(): boolean {
    const isLogin = localStorage.getItem(this.isLoginKey);
    return isLogin ? JSON.parse(isLogin) : false;
  }

}
