import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEditarService {

  private usuarioSubject = new BehaviorSubject<Usuario | null> (null);
  usuarioSeleccionado$ = this.usuarioSubject.asObservable();

  constructor() { }

  seleccionarUsuario(usuario: Usuario | null){
    this.usuarioSubject.next(usuario)
  }

}
