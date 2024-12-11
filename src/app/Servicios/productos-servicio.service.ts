import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosServicioService {
  private apiURL = 'http://localhost/backend-punto_de_venta/';
  //private apiURL = "http://localhost:8000/";

  constructor(private _httpClient: HttpClient) {}

  public getProductos(): Observable<Producto[]>{
    return this._httpClient.get<Producto[]>(`${this.apiURL}selectProducto.php`);
  }

  insertarProducto(producto: Producto) {
    return this._httpClient.post(`${this.apiURL}insertProduct.php`,producto);
  }

  updateProduct(producto: Producto) {
    console.log(producto);
    return this._httpClient.post(`${this.apiURL}updateProduct.php`,producto);
  }

  deleteProduct(producto: Producto) {
    return this._httpClient.post(`${this.apiURL}deleteProduct.php`,producto );
  }

  countProducts(nombre: string) {
    console.log('Enviando nombre:', nombre); // Verifica el dato enviado
    return this._httpClient.post<any>(`${this.apiURL}countProducts.php`, { nombre });
  }  
}
