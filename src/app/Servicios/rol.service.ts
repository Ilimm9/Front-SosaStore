import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  // private apiUrl = "http://localhost/backend-punto_de_venta/";
  private apiUrl = "http://localhost:8000/";


  constructor(private http: HttpClient) {}

  obtenerRoles() {
    return this.http.get(`${this.apiUrl}select_rol.php`);
    
  }

}
