import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Venta } from '../models/venta';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  
  private apiURL = "http://localhost/backend-punto_de_venta/";
  // private apiURL = "http://localhost:8000/";


  constructor(private _httpClient: HttpClient) {}


  insertarVenta(venta: Venta) {
    return this._httpClient.post(`${this.apiURL}insertVenta.php`,venta);
  }

  getVentas(): Observable<Venta[]> {
    return this._httpClient.get<Venta[]>(`${this.apiURL}getVenta.php`);
  }
  

}
