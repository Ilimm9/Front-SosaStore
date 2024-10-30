import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServicioService {

  // private apiUrl = "http://localhost:8000/";
  private apiUrl = "http://localhost/backend-punto_de_venta/";

  constructor(private http: HttpClient) { }

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
}
