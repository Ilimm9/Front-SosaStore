import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from 'simple-datatables';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { UsuarioEditarService } from '../../Servicios/usuario-editar.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { map } from 'rxjs';
import { RolService } from '../../Servicios/rol.service';

@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tabla-usuario.component.html',
  styleUrl: './tabla-usuario.component.css'
})
export class TablaUsuarioComponent implements OnInit {

  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;

  roles: Rol[] = [];
  usuarios: Usuario[] = []

  constructor(private usuarioEditarService: UsuarioEditarService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.consultarUsuarios();

  }

  consultarUsuarios() {
    this.usuarioService.getUsuariosCompletos().subscribe((usuariosCompletos) => {
      console.log("Usuarios completos con roles:", usuariosCompletos);
      this.usuarios = usuariosCompletos;
      setTimeout(() => {
        this.initDataTable(); // Inicializa la DataTable después de que el DOM se haya actualizado
      }, 0);
    });
  }

  initDataTable() {
    // Asegúrate de que hay datos en la tabla antes de inicializarla
    if (this.datatablesSimple && this.usuarios.length > 0) {
      // Inicializa la DataTable
      new DataTable(this.datatablesSimple.nativeElement);
    }
  }

  enviarUsuario(event: MouseEvent) {
    let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
    console.log(dataId)
    if (dataId === null) {
      return;
    }
    let id = parseInt(dataId);
    const usuario = this.usuarios.find(u => u.idUsuario === id);
    if (usuario) {
      console.log(usuario)
      this.usuarioEditarService.seleccionarUsuario(usuario)
    }
  }

}
