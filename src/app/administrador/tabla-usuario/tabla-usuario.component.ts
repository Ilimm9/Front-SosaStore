import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from 'simple-datatables';
import { Usuario } from '../../models/usuario';
import { EditarService } from '../../Servicios/editar.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './tabla-usuario.component.html',
  styleUrl: './tabla-usuario.component.css'
})
export class TablaUsuarioComponent implements OnInit {

  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;

  usuarios: Array<Usuario> = [];

  constructor(private editarService: EditarService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    // this.consultarUsuarios();
    this.loadUsers();
  }

  loadUsers(){
    this.usuarioService.getUsuarios().subscribe((result) => {
      this.usuarios = Object.values(result);
      console.log("Usuarios completos con roles:", this.usuarios);
      setTimeout(() => {
        this.initDataTable(); // Inicializa la DataTable después de que el DOM se haya actualizado
      }, 0);
    });
  }

  // consultarUsuarios() {
  //   this.usuarioService.getUsuariosCompletos().subscribe((usuariosCompletos) => {
  //     console.log("Usuarios completos con roles:", usuariosCompletos);
  //     this.usuarios = usuariosCompletos;
  //     setTimeout(() => {
  //       this.initDataTable(); // Inicializa la DataTable después de que el DOM se haya actualizado
  //     }, 0);
  //   });
  // }

  initDataTable() {
    // Asegúrate de que hay datos en la tabla antes de inicializarla
    if (this.datatablesSimple && this.usuarios.length > 0) {
      // Inicializa la DataTable
      new DataTable(this.datatablesSimple.nativeElement, {
        labels: {
          placeholder: "Buscar...",
          perPage: "registros por página",
          noRows: "No se encontraron registros",
          info: "Mostrando {start} a {end} de {rows} registros",
          noResults: "No se encontraron coincidencias"
      }
      });
    
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
      this.editarService.seleccionarUsuario(usuario)
    }
  }

}
