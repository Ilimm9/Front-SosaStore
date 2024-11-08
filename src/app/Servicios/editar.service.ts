import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Producto } from '../models/producto';
import { Categoria } from '../models/categoria';
@Injectable({
  providedIn: 'root'
})
export class EditarService {

  //Modulo usuario
  private usuarioSubject = new BehaviorSubject<Usuario | null> (null);
  usuarioSeleccionado$ = this.usuarioSubject.asObservable();

  //Modulo producto
  private productSubject = new BehaviorSubject<Producto | null> (null);
  productSeleccionado$ = this.productSubject.asObservable();

  //M Categoria
  private categoriaSubject = new BehaviorSubject<Categoria | null> (null);
  categoriaSeleccionada$ = this.categoriaSubject.asObservable();

  constructor() { }

  seleccionarUsuario(usuario: Usuario | null){
    this.usuarioSubject.next(usuario)
  }

  seleccionarProducto(producto: Producto | null){
    this.productSubject.next(producto)
  }

  seleccionarCategoria(categoria: Categoria | null){
    this.categoriaSubject.next(categoria)
  }

}
