import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioEditarService } from '../../Servicios/usuario-editar.service';
import { Rol } from '../../models/rol';

@Component({
  selector: 'app-formulario-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-usuario.component.html',
  styleUrl: './formulario-usuario.component.css'
})
export class FormularioUsuarioComponent implements OnInit{

  @ViewChild("usuarioForm") prendaForm: NgForm

  usuario: Usuario = new Usuario(0,"","","","","","",new Rol(0,""))

  roles = [
    { "idRol": 1, "nombreRol": "Administrador" },
    { "idRol": 2, "nombreRol": "Cajero" },
    { "idRol": 3, "nombreRol": "Inventario" }
  ]

  constructor(private usuarioEditarService: UsuarioEditarService){}

  ngOnInit() {
    this.usuarioEditarService.usuarioSeleccionado$.subscribe(usuario => {
      if(usuario !== null){
        this.usuario = usuario;
      }
    });
  }

  ngOnDestroy() {
    // Limpiar el usuario seleccionado al salir del formulario
    this.usuarioEditarService.seleccionarUsuario(null);
  }

  guardar(){
    console.log(this.usuario)
  }

}
