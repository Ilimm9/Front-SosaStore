import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { EditarService } from '../../Servicios/editar.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
//importaciones para bajarlo en pdf y xlsx
// import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
  ],
  templateUrl: './tabla-usuario.component.html',
  styleUrl: './tabla-usuario.component.css',
})
export class TablaUsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  displayedColumns: string[] = [
    'rfc',
    'nombre',
    'cargo',
    'correo',
    'telefono',
    'usuario',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private editarService: EditarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (datos) => {
        this.usuarios = datos;
        this.dataSource.data = this.usuarios;
        console.log(this.usuarios);
      },
      error: (errores) => console.log(errores),
    });
  }

  enviarUsuario(user: Usuario) {
    if (user) {
      console.log(user);
      this.editarService.seleccionarUsuario(user);
      this.router.navigate(['gestor/administrador/formulario-usuario']);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lista de Empleados');

    // configuracion de las columnas
    worksheet.columns = [
      { header: 'RFC', key: 'rfc', width: 20 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Cargo', key: 'cargo', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Usuario', key: 'usuario', width: 20 },
    ];

    worksheet.columns.forEach((column, index) => {
      const cell = worksheet.getCell(1, index + 1); // encabezado
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.alignment = { horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' },
      };
    });

    // agregar datos y estilos a cada fila
    this.usuarios.forEach((usuario, index) => {
      const row = worksheet.addRow({
        rfc: usuario.rfc,
        nombre: `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2}`,
        cargo: usuario.rol,
        email: usuario.correo,
        telefono: usuario.telefono,
        usuario: usuario.nombreUsuario,
      });

      // aplicar bordes y colores solo a las celdas que contienen datos
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // pintar fondo solo en filas alternadas
        if (index % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D9E1F2' },
          };
        }
      });
    });

    // generar el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, 'Lista_Empleados.xlsx');
    });
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    doc.text('Lista de Empleados', 10, 10);

    const columns = ['RFC', 'Nombre', 'Cargo', 'Email', 'Teléfono', 'Usuario'];
    const rows = this.usuarios.map((usuario) => [
      usuario.rfc,
      `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2}`,
      usuario.rol,
      usuario.correo,
      usuario.telefono,
      usuario.nombreUsuario,
    ]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save('usuarios.pdf');
  }
}
