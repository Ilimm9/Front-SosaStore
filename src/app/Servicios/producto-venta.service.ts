import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoVenta } from '../models/producto-venta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoVentaService {

  private apiURL = "http://localhost:8000/";


  constructor(private _httpClient: HttpClient) {}

  insertarProductoVenta(productoVenta: ProductoVenta) {
    return this._httpClient.post(`${this.apiURL}insertarVentaProducto.php`,productoVenta);
  }

  // obtenerDetallesVenta(idVenta: number): Observable<ProductoVenta[]> {
  //   return this._httpClient.get<ProductoVenta[]>(`api/productos-venta/${idVenta}`);
  // }

  // obtenerDetallesVenta(idVenta: number): Observable<ProductoVenta[]> { 
  //   return this._httpClient.get<ProductoVenta[]>(`${this.apiURL}getVentaProducto/${idVenta}`);
  //  }

  getVentaDetalles(idVenta: number): Observable<any> {
     return this._httpClient.get(`${this.apiURL}getventaProducto.php?id_venta=${idVenta}`); }
  
}
