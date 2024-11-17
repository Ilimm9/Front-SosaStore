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

  // private apiUrl = "http://localhost:8000/";
  private apiUrl = "http://localhost/backend-punto_de_venta/";

  constructor(private http: HttpClient,
    private rolService: RolService
  ) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ nombre_Usuario: username, contrasenia: password });

    return this.http.post(`${this.apiUrl}login_check.php`, body, { headers });
  }

  insertarUsuario({
    datos
  }: {
    datos: {
      nombre: string,
      apellido1: string,
      apellido2: string,
      telefono: string,
      nombre_Usuario: string,
      contrasenia: string,
      id_Rol: number
    };
  }) {
    return this.http.post(`${this.apiUrl}insertUser.php`, JSON.stringify(datos));

  }

  actualizarUsuario({
    datos
  }: {
    datos: {
      id_usuario: number
      nombre: string,
      apellido1: string,
      apellido2: string,
      telefono: string,
      nombre_Usuario: string,
      contrasenia: string,
      id_Rol: number
    };
  }) {
    return this.http.post(`${this.apiUrl}updateUser.php`, JSON.stringify(datos));

  }

  desactivarUsuario(dato: {id_usuario: number}){
    return this.http.post(`${this.apiUrl}disableUser.php`, JSON.stringify(dato));
  }

  getUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.apiUrl}selectUser.php`);
  }

}
