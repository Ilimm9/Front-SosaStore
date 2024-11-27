import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductosServicioService } from '../../Servicios/productos-servicio.service';
import { RouterLink } from '@angular/router';
import { EditarService } from '../../Servicios/editar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../models/categoria';
import { MatIconModule } from '@angular/material/icon';
import { Producto } from '../../models/producto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-tabla-producto',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './tabla-producto.component.html',
  styleUrl: './tabla-producto.component.css',
})
export class TablaProductoComponent implements OnInit, AfterViewInit {

  productList: Producto[] = [];
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['codigoProducto', 'producto', 'stock', 'stockMin', 'stockMax', 'precioCompra', 'precioVenta', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _productoServicio: ProductosServicioService,
    private editarService: EditarService
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerProductos() {
    this._productoServicio.getProductos().subscribe({
      next: (datos) => {
        console.log(datos)
        this.productList = datos;
        this.dataSource.data = this.productList;
        console.log(this.productList);
      }
    });
  }

  enviarProducto(producto: Producto) {
    if (producto) {
      console.log(producto);
      this.editarService.seleccionarProducto(producto);
    }
  }

  deleteProduct(producto : Producto) {
    this._productoServicio.deleteProduct(producto).subscribe({
      next: (result) => {
        console.log(result);
        // Mensaje de éxito
        Swal.fire({
          title: 'Producto eliminado!',
          text: 'El producto se ha eliminado con éxito.',
          icon: 'success',
        });
        this.obtenerProductos();
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error al eliminar el producto',
          text: 'Hubo un problema al intentar eliminar el producto. Por favor, inténtalo nuevamente.',
          icon: 'error',
        });
        console.error('Error al eliminar el producto:', error); // O puedes registrar el error para depuración
      },
    });
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
    const worksheet = workbook.addWorksheet('Lista de Productos');

    // configuracion de las columnas
    worksheet.columns = [
      { header: 'Código', key: 'cod_producto', width: 20 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Stock', key: 'stock', width: 30 },
      { header: 'Stock mínimo', key: 'stock_min', width: 15 },
      { header: 'Stock máximo', key: 'stock_max', width: 30 },
      { header: 'Precio compra', key: 'p_compra', width: 15 },
      { header: 'Precio venta', key: 'p_venta', width: 20 },
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
    this.productList.forEach((producto, index) => {
      const row = worksheet.addRow({
        cod_producto: producto.codigoProducto,
        nombre: producto.nombre,
        stock: producto.stock,
        stock_min: producto.stockMin,
        stock_max: producto.stockMax,
        p_compra: producto.precioCompra,
        p_venta: producto.precioVenta,
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
      FileSaver.saveAs(blob, 'Lista_Productos.xlsx');
    });
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    doc.text('Lista de Empleados', 10, 10);

    const columns = ['Código', 'Nombre', 'Stock', 'Stock mínimo', 'Stock máximo', 'Precio compra', 'Precio venta'];
    const rows = this.productList.map((producto) => [
      producto.codigoProducto,
      producto.nombre,
      producto.stock,
      producto.stockMin,
      producto.stockMax,
      `$${producto.precioCompra}`,
      `$${producto.precioVenta}`
    ]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save('productos.pdf');
  }

}
