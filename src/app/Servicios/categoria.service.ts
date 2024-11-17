import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiURL =
    "http://localhost/backend-punto_de_venta/";

  constructor(private _httpClient: HttpClient) {}

  public getCategorias(): Observable<Categoria[]> {
    return this._httpClient.get<Categoria[]>(`${this.apiURL}selectCategoria.php`);
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
  updateCategoria({
    datos,
  }: {
    datos: {
      id_categoria:number;
      nombre: string;
      descripcion: string;
    };
  }) {
    return this._httpClient.post(
      `${this.apiURL}updateCategoria.php`,
      JSON.stringify(datos)
    );
  }

  deleteCategoria({
    datos,
  }: {
    datos: {
      id_categoria: number;
    };
  }) {
    return this._httpClient.post(
      `${this.apiURL}deleteCategoria.php`,
      JSON.stringify(datos)
    );
  }
  
}
