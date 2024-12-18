import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiURL = 'http://localhost/backend-punto_de_venta/';
  // private apiUrl = "http://localhost:8000/";

  constructor(private httpClient : HttpClient) { }

  public getVentaCategoriaTotal(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiURL}consultaVentaCategoria.php`);
  }

  public getVentaCategoriaMes(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiURL}consultaVentaCategoriaMes.php`);
  }

  public getVentaCategoriaAnio(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiURL}consultaVentaCategoriaAnio.php`);
  }

  public getMasVendido(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiURL}consultaMasVendidos.php`);
  }

  public generarQuery(query: string): Observable<any> {
    const body = { query };
    return this.httpClient.post<any>(`${this.apiURL}consultaGeneral.php`, body);
  }


}
