import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosServicioService {
  private apiURL = 'http://localhost/backend-punto_de_venta/';

  constructor(private _httpClient: HttpClient) {}

  public getProductos(): Observable<Producto[]>{
    return this._httpClient.get<Producto[]>(`${this.apiURL}selectProducto.php`);
  }

  insertarProducto(producto: Producto) {
    return this._httpClient.post(`${this.apiURL}insertProduct.php`,producto);
  }

  updateProduct(producto: Producto) {
    return this._httpClient.post(`${this.apiURL}updateProducto.php`,producto);
  }

  deleteProduct(producto: Producto) {
    return this._httpClient.post(`${this.apiURL}deleteProducto.php`,producto );
  }
}
