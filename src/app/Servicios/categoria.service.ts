import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiURL =  "http://localhost/backend-punto_de_venta/";
    // private apiURL = "http://localhost:8000/";


  constructor(private _httpClient: HttpClient) {}

  public getCategorias(): Observable<Categoria[]> {
    return this._httpClient.get<Categoria[]>(`${this.apiURL}selectCategoria.php`);
  }
  
  insertarCategoria(categoria: Categoria): Observable<Object> {
    return this._httpClient.post(`${this.apiURL}insertCategoria.php`, categoria);
  }

  updateCategoria(categoria: Categoria) {
    return this._httpClient.post(`${this.apiURL}updateCategoria.php`,categoria );
  }

  deleteCategoria(categoria: Categoria) : Observable<Object> {
    return this._httpClient.post(`${this.apiURL}deleteCategoria.php`,categoria );
  }

  countCategories(){
    return this._httpClient.get<any>(`${this.apiURL}countCategories.php`);
  }
  
}
