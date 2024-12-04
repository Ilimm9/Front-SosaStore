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

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [MatTableModule, 
    CommonModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})


export class HistorialComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'idVenta',
    'fecha', 
    'precioTotal',
    'detallesProductos'
  ];

  dataSource =  new MatTableDataSource<Venta>();
  ventaDetalles: ProductoVenta[] = [];
  venta: Venta = new Venta(); 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  producto_venta: {
    id_venta: number; fecha: any; total: any; detallesProductos: any; totalVenta: any; // Ajusta esto según sea necesario
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
       next: (ventas:Venta[])=>{
         this.dataSource.data = ventas;
         console.log(ventas);
       },
       error: (err)=>{
         console.error ('Error al cargar las ventas', err);
       }
       
     });
   }

  cargarDetallesVenta(idVenta: number): void { 
    this.productoVentaService.getVentaDetalles(idVenta).subscribe(data => { 
      this.venta = { 
        id_venta: idVenta, 
        fecha: data.fecha, 
        total: data.total_venta, 
        detallesProductos: data.productos,
         totalVenta: data.total_venta 
        };
         this.ventaDetalles = data.productos.map((producto: any) => ({ 
          idProductoVenta: producto.id_producto_venta,
           idProducto: producto.id_producto, 
           idVenta: idVenta,
            total: producto.total_producto,
             cantidad: producto.cantidad, 
             precio: producto.precio, 
             nombre_producto: producto.nombre_producto
             }
            ));
           });
          }
        }



