import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Rol } from '../models/rol';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // private apiUrl = "http://localhost:8000/";
  private apiUrl = "http://localhost/backend-punto_de_venta/";

  constructor(private http: HttpClient) { }

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

  getUsuarios(): Observable<any> {

    return this.http.get(`${this.apiUrl}selectUser.php`).pipe(
      map((response: any) => response.data), // Accedemos al campo 'data'
      map((usuarios: any[]) =>  // Ahora usuarios es de tipo any[]
        usuarios.map((userData: any) => {
          const user = new Usuario();
          user.idUsuario = userData.id_usuario;
          user.nombre = userData.nombre;
          user.primerApellido = userData.apellido1;
          user.segundoApellido = userData.apellido2;
          user.telefono = userData.telefono;
          user.password = userData.contrasenia;
          user.nombreUsuario = userData.nombre_Usuario;
          user.correo = userData.correo;
          user.activo = userData.activo;

          const rol = new Rol();
          rol.idRol = userData.id_Rol; // Asegúrate de que id_Rol exista
          user.rol = rol;
          return user;
        })
      )
    )

  }


}
