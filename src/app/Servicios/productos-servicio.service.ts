import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosServicioService {

  private selectProductosURL ="http://localhost/backend-punto_de_venta/selectProducto.php";
  constructor(private _httpClient: HttpClient) { }
  
  public getProductos(): Observable<Producto[]> { return this._httpClient.get<{ status: string, data: Producto[] }>(this.selectProductosURL).pipe( map(response => response.data) // Mapea la respuesta para extraer solo el campo `data` 
  );}

}
