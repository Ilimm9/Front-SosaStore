import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Rol } from '../models/rol';
import { Usuario } from '../models/usuario';
import { RolService } from './rol.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = "http://localhost/backend-punto_de_venta/";

  constructor(private http: HttpClient
  ) { }

  login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}login_check.php`, usuario);
  }

  recuperarContrasenia(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email: email });
    return this.http.post(`${this.apiUrl}recuperar_contrasenia.php`, body, { headers });
  }

  insertarUsuario(usuario: Usuario) : Observable<Object>{
    return this.http.post(`${this.apiUrl}insertUser.php`, usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<Object>{
    return this.http.post(`${this.apiUrl}updateUser.php`, usuario);
  }

  desactivarUsuario(usuario: Usuario): Observable<Object>{
    return this.http.post(`${this.apiUrl}disableUser.php`, usuario);
  }

  getUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.apiUrl}selectUser.php`);
  }

}
