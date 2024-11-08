import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiURL =
    "http://localhost/backend-punto_de_venta/";

  constructor(private _httpClient: HttpClient) {}

  public getCategorias() {
    return this._httpClient.get(`${this.apiURL}selectCategoria.php`);
  }
  insertarCategoria({
    datos,
  }: {
    datos: {
      
      nombre: string;
      descripcion: string;
    };
  }) {
    return this._httpClient.post(
      `${this.apiURL}insertCategoria.php`,
      JSON.stringify(datos)
    );
  }
}
