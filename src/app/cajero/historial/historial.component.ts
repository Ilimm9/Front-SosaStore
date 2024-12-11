import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { VentaService } from '../../Servicios/venta.service';
import { Venta } from '../../models/venta';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { ProductoVentaService } from '../../Servicios/producto-venta.service';
import { ProductoVenta } from '../../models/producto-venta';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit, AfterViewInit {
  fechaInicio: string = '';
  fechaFin: string = '';

  displayedColumns: string[] = [
    'idVenta',
    'fecha',
    'precioTotal',
    'detallesProductos',
  ];

  dataSource = new MatTableDataSource<Venta>();
  ventaDetalles: ProductoVenta[] = [];
  venta: Venta = new Venta();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  producto_venta: {
    id_venta: number;
    fecha: any;
    total: any;
    detallesProductos: any;
    totalVenta: any; // Ajusta esto según sea necesario
  };

  constructor(
    private ventaService: VentaService,
    private productoVentaService: ProductoVentaService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarVentas(): void {
    this.ventaService.getVentas().subscribe({
      next: (ventas: Venta[]) => {
        this.dataSource.data = ventas;
        console.log(ventas);
      },
      error: (err) => {
        console.error('Error al cargar las ventas', err);
      },
    });
  }

  limpiarDatos(){
    this.venta = new Venta();
    this.ventaDetalles = [];
  }

  cargarDetallesVenta(venta: Venta): void {
    this.productoVentaService.getVentaDetalles(venta.idVenta).subscribe((data) => {
      console.log(data);
      this.venta = venta;
      this.venta.detallesProductos = data.productos;
      this.venta.cajero = data.productos[0]?.cajero;
      
      console.log(this.venta)

      this.ventaDetalles = data.productos.map((producto: any) => ({
        idVenta: venta.idVenta,
        total: producto.total_producto,
        cantidad: producto.cantidad,
        precio: producto.precio,
        nombreProducto: producto.nombre_producto,
      }));
      console.log(this.ventaDetalles);

    });
  }

  aplicarFiltro(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor, selecciona ambas fechas.');
      return;
    }
  
    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);
  
    if (fechaInicio > fechaFin) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }
  
    this.dataSource.data = this.dataSource.data.filter((venta: Venta) => {
      const fechaVenta = new Date(venta.fecha);
      return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
    });
  
    if (this.dataSource.data.length === 0) {
      console.log('No se encontraron ventas dentro del rango de fechas.');
    }
  }

  limpiarFiltro(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.cargarVentas(); // Recarga las ventas sin filtrar
  }
  

}
