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

  public getProductos(): Observable<Producto[]> {
    return this._httpClient
      .get<{ status: string; data: Producto[] }>(`${this.apiURL}selectProducto.php`)
      .pipe(
        map((response) => response.data) // Mapea la respuesta para extraer solo el campo `data`
      );
  }

  public getProductos2(){
    return this._httpClient.get(`${this.apiURL}getProduct.php`);
  }
}
