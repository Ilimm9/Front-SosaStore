import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

//  private apiUrl = "http://localhost:8000/";
// private apiUrl = "http://localhost/backend-punto_de_venta/";

  // private apiUrl = "http://localhost:8000/";
  private apiUrl = "http://localhost/backend-punto_de_venta/";


  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ nombre_Usuario: username, contrasenia: password });

    return this.http.post(`${this.apiUrl}login_check.php`, body, { headers });
  }

  recuperarContrasenia(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email: email });
    return this.http.post(`${this.apiUrl}recuperar_contrasenia.php`, body, { headers });
  }
  
}