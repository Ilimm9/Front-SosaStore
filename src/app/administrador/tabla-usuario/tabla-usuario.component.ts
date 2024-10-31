import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from 'simple-datatables';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { UsuarioEditarService } from '../../Servicios/usuario-editar.service';

@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tabla-usuario.component.html',
  styleUrl: './tabla-usuario.component.css'
})
export class TablaUsuarioComponent {

  @ViewChild('datatablesSimple') datatablesSimple!: ElementRef;


  rolCajero = new Rol();
  rolAdministrador = new Rol();

  usuarios: Usuario[];

  // usuarios: Usuario[] = [
  //   new Usuario(31, 'Pedro', 'Lopez', 'Hernandez', '5551234567', 'cgarcial', 'pass1234', this.rolCajero),
  //   new Usuario(32, 'Ilian', 'Martínez', 'Morales', '5552345678', 'amartinezh', 'securePass1', this.rolAdministrador),
  //   new Usuario(33, 'Franco Steven', 'Sosa', '', '5553456789', 'lramirezg', 'password123', this.rolAdministrador),
  //   new Usuario(4, 'Juan Jose', 'Lopez', 'Rosado', '5554567890', 'mdiazs', 'martad123', this.rolAdministrador),
  //   new Usuario(5, 'Jorge Alberto', 'Cortez', 'Cuevas', '5555678901', 'fperezm', 'fernandoPass', this.rolAdministrador),
  //   new Usuario(6, 'Eduardo', 'Villavicencio', 'Ruiz', '5556789012', 'sgomezf', 'sofiaGF12', this.rolAdministrador),
  //   new Usuario(7, 'Andrés', 'López', 'Núñez', '5557890123', 'alopezn', 'andres2024', this.rolAdministrador),
  //   new Usuario(8, 'Laura', 'Jiménez', 'Hernández', '5558901234', 'ljimenezh', 'jimenezL99', this.rolAdministrador),
  //   new Usuario(9, 'Diego', 'Ortiz', 'Rojas', '5559012345', 'dortizr', 'dortizPass', this.rolAdministrador),
  //   new Usuario(10, 'Paula', 'Silva', 'García', '5550123456', 'psilvag', 'pSG2024', this.rolAdministrador),
  //   new Usuario(11, 'Jorge', 'Castro', 'Martín', '5552345670', 'jcastrom', 'castroJ123', this.rolCajero),
  //   new Usuario(12, 'Valeria', 'Ruiz', 'Salinas', '5553456781', 'vruizs', 'valeria2024', this.rolAdministrador),
  //   new Usuario(13, 'Gabriel', 'Medina', 'Pardo', '5554567892', 'gmedinap', 'gMedina@23', this.rolCajero),
  //   new Usuario(14, 'Daniela', 'Soto', 'Lara', '5555678903', 'dsotol', 'danielaPass', this.rolCajero),
  //   new Usuario(15, 'Iván', 'Flores', 'Montoya', '5556789014', 'ifloresm', 'ivanflores1', this.rolCajero),
  //   new Usuario(16, 'Carmen', 'Vega', 'Delgado', '5557890125', 'cvegad', 'carmenV22', this.rolCajero),
  //   new Usuario(17, 'Ricardo', 'Morales', 'Camacho', '5558901236', 'rmoralesc', 'ricardoMC19', this.rolCajero),
  //   new Usuario(18, 'Luz', 'Hernández', 'Jiménez', '5559012347', 'lhernandezj', 'luzhern20', this.rolCajero),
  //   new Usuario(19, 'Mario', 'Navarro', 'Ortiz', '5550123458', 'mnavarroo', 'mnavarro99', this.rolAdministrador),
  //   new Usuario(20, 'Teresa', 'Pineda', 'Romero', '5551234569', 'tpinedar', 'teresaPR', this.rolCajero),
  // ];

  constructor(private usuarioEditarService: UsuarioEditarService) { }

  //   {
  //     nombre: "Pedro",
  //     primerApellido: "Lopez",
  //     segundoApellido: "Hernandez",
  //     telefono: "5551234567",
  //     usuario: "cgarcial",
  //     contrasena: "pass1234",
  //     rol: "Cajero"
  //   },
  //   {
  //     nombre: "Ilian",
  //     primerApellido: "Martínez",
  //     segundoApellido: "Morales",
  //     telefono: "5552345678",
  //     usuario: "amartinezh",
  //     contrasena: "securePass1",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Franco Steven",
  //     primerApellido: "Sosa",
  //     segundoApellido: "",
  //     telefono: "5553456789",
  //     usuario: "lramirezg",
  //     contrasena: "password123",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Juan Jose",
  //     primerApellido: "Lopez",
  //     segundoApellido: "Rosado",
  //     telefono: "5554567890",
  //     usuario: "mdiazs",
  //     contrasena: "martad123",
  //     rol: "Cajero"
  //   },
  //   {
  //     nombre: "Jorge Alberto",
  //     primerApellido: "Cortez",
  //     segundoApellido: "Cuevas",
  //     telefono: "5555678901",
  //     usuario: "fperezm",
  //     contrasena: "fernandoPass",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Eduardo",
  //     primerApellido: "Villavicencio",
  //     segundoApellido: "Ruiz",
  //     telefono: "5556789012",
  //     usuario: "sgomezf",
  //     contrasena: "sofiaGF12",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Andrés",
  //     primerApellido: "López",
  //     segundoApellido: "Núñez",
  //     telefono: "5557890123",
  //     usuario: "alopezn",
  //     contrasena: "andres2024",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Laura",
  //     primerApellido: "Jiménez",
  //     segundoApellido: "Hernández",
  //     telefono: "5558901234",
  //     usuario: "ljimenezh",
  //     contrasena: "jimenezL99",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Diego",
  //     primerApellido: "Ortiz",
  //     segundoApellido: "Rojas",
  //     telefono: "5559012345",
  //     usuario: "dortizr",
  //     contrasena: "dortizPass",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Paula",
  //     primerApellido: "Silva",
  //     segundoApellido: "García",
  //     telefono: "5550123456",
  //     usuario: "psilvag",
  //     contrasena: "pSG2024",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Jorge",
  //     primerApellido: "Castro",
  //     segundoApellido: "Martín",
  //     telefono: "5552345670",
  //     usuario: "jcastrom",
  //     contrasena: "castroJ123",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Valeria",
  //     primerApellido: "Ruiz",
  //     segundoApellido: "Salinas",
  //     telefono: "5553456781",
  //     usuario: "vruizs",
  //     contrasena: "valeria2024",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Gabriel",
  //     primerApellido: "Medina",
  //     segundoApellido: "Pardo",
  //     telefono: "5554567892",
  //     usuario: "gmedinap",
  //     contrasena: "gMedina@23",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Daniela",
  //     primerApellido: "Soto",
  //     segundoApellido: "Lara",
  //     telefono: "5555678903",
  //     usuario: "dsotol",
  //     contrasena: "danielaPass",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Iván",
  //     primerApellido: "Flores",
  //     segundoApellido: "Montoya",
  //     telefono: "5556789014",
  //     usuario: "ifloresm",
  //     contrasena: "ivanflores1",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Carmen",
  //     primerApellido: "Vega",
  //     segundoApellido: "Delgado",
  //     telefono: "5557890125",
  //     usuario: "cvegad",
  //     contrasena: "carmenV22",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Ricardo",
  //     primerApellido: "Morales",
  //     segundoApellido: "Camacho",
  //     telefono: "5558901236",
  //     usuario: "rmoralesc",
  //     contrasena: "ricardoMC19",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Luz",
  //     primerApellido: "Hernández",
  //     segundoApellido: "Jiménez",
  //     telefono: "5559012347",
  //     usuario: "lhernandezj",
  //     contrasena: "luzhern20",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Mario",
  //     primerApellido: "Navarro",
  //     segundoApellido: "Ortiz",
  //     telefono: "5550123458",
  //     usuario: "mnavarroo",
  //     contrasena: "mnavarro99",
  //     rol: "administrador"
  //   },
  //   {
  //     nombre: "Teresa",
  //     primerApellido: "Pineda",
  //     segundoApellido: "Romero",
  //     telefono: "5551234569",
  //     usuario: "tpinedar",
  //     contrasena: "teresaPR",
  //     rol: "administrador"
  //   }
  // ];

  ngAfterViewInit(): void {
    const dataTable = new DataTable(this.datatablesSimple.nativeElement);

  }

  enviarUsuario(event: MouseEvent) {
    let dataId = (event.target as HTMLButtonElement).getAttribute('data-id');
    console.log(dataId)
    if (dataId === null) {
      return;
    }
    let id = parseInt(dataId);
    // const usuario = this.usuarios.find(u => u.idUsuario === id);
    // if (usuario) {
    //   console.log(usuario)
    //   this.usuarioEditarService.seleccionarUsuario(usuario)
    // }
  }

}
