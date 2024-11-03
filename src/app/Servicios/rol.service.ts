import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = "http://localhost/backend-punto_de_venta/";

  constructor(private http: HttpClient) {}

  obtenerRoles(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.apiUrl}select_rol.php`);
    
  }
}
