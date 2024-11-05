import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosServicioService {
  private apiURL =
    "http://localhost/backend-punto_de_venta/";

  constructor(private _httpClient: HttpClient) {}

  public getProductos() {
    return this._httpClient.get(`${this.apiURL}selectProducto.php`);
  }

  public getProductos2(){
    return this._httpClient.get(`${this.apiURL}getProduct.php`);
  }

  public getCategorias() {
    return this._httpClient.get(`${this.apiURL}getOccupiedLocalsDetails.php`);
  }
}
