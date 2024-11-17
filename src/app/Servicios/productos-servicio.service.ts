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

  public getProductos2() {
    return this._httpClient.get(`${this.apiURL}getProduct.php`);
  }

  insertarProducto({
    datos,
  }: {
    datos: {
      id_categoria: number;
      codigo: string;
      nombre: string;
      stock: number;
      stock_min: number;
      stock_max: number;
      precio_venta: number;
      precio_compra: number;
    };
  }) {
    return this._httpClient.post(
      `${this.apiURL}insertProduct.php`,
      JSON.stringify(datos)
    );
  }

  updateProduct({
    datos,
  }: {
    datos: {
      id_producto: number;
      id_categoria: number;
      codigo: string;
      nombre: string;
      stock: number;
      stock_min: number;
      stock_max: number;
      precio_venta: number;
      precio_compra: number;
    };
  }) {
    return this._httpClient.post(
      `${this.apiURL}updateProduct.php`,
      JSON.stringify(datos)
    );
  }

  deleteProduct({
    datos,
  }: {
    datos: {
      id_producto: number;
    };
  }) {
    return this._httpClient.post(
      `${this.apiURL}deleteProduct.php`,
      JSON.stringify(datos)
    );
  }
}
