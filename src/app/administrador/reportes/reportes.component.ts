import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartType } from 'chart.js/auto';
import { ReporteService } from '../../Servicios/reporte.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesComponent implements OnInit {

  meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  //para las ventas del dia
  contenedorDia: any[] = [];


  //para las ventas del dia, mes anio
  public chartContenedorDiaMes: any;
  contenedorDiaMes: any[] = [];
  contenedorDiaMesSeleccionado: any[] = [];

  categoriaAnio1: number[] = [];
  categoriaMes1: number[] = [];
  categoriaDia1: number[] = [];

  seleccionadoAnio1: number | null = null;
  seleccionadoMes1: number | null = null;
  seleccionadoDia1: number | null = null;


  //para las ventas del mes anio
  public chartContenedorMesAnio: any;
  contenedorMesAnio: any[] = [];
  contenedorMesAnioSeleccionado: any[] = [];

  categoriaAnio2: number[] = [];
  categoriaMes2: number[] = [];

  seleccionadoAnio2: number | null = null;
  seleccionadoMes2: number | null = null;


   //para las ventas del anio
   public chartContenedorAnio: any;
   contenedorAnio: any[] = [];
   contenedorAnioSeleccionado: any[] = [];
 
   categoriaAnio3: number[] = [];
 
   seleccionadoAnio3: number | null = null;


   //para las ventas generales de categorias
  contenedorGeneral: any[] = [];

  

  // Atributo que almacena los datos del chart
  // public chartTotalCategoria: any;
  // ventasPorCategoria: any[];

  // public chartCategoriaMes: any;
  // ventasPorCategoriaMes: any[];
  // categoria_anio: number[] = [];
  // categoria_mes: number[] = [];
  // // Variables para guardar las selecciones
  // selectedYear: number | null = null;
  // selectedMonth: number | null = null;

  // public chartCategoriaAnio: any;
  // ventasPorCategoriaAnio: any[];
  // categoriaAnio_grafico3: number[] = [];
  // anioSeleccionado: number | null = null;

  // public chartMasVendidos: any;
  // productosMasVendidos: any[];

  constructor(private reporteService: ReporteService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consultarVentaDia();
    this.consultarVentaMesDia();
    this.consultarVentaMesAnio();
    this.consultarVentaAnio();
    this.consultarVentaGeneral();

    // this.obtenerVentaCategoriaTotal();
    // this.obtenerVentaCategoriaMes();
    // this.obtenerVentaCategoriaAnio();
    // this.obtenerMasVendidos();
    // this.graficoVentaCategoriaMes();
  }

  

  // PARA EL GRAFICO DEL DIA ACTUAL
  totalVentaDia = 0;
  gananciaVentaDia = 0;
  calcularTotalDia() {
    this.contenedorDia.forEach(dato => {
      this.totalVentaDia += dato.total_ventas;
      this.gananciaVentaDia += dato.ganancia;
    })
  }

  crearGraficoDia() {
    const labels = this.contenedorDia.map((item) => item.categoria); // Categorías
    const totalVentasData = this.contenedorDia.map((item) => item.total_ventas); // Total Ventas
    const gananciasData = this.contenedorDia.map((item) => item.ganancia); // Ganancias


    new Chart('ventasChart', {
      type: 'bar',
      data: {
        labels: labels, // Categorías
        datasets: [
          {
            label: 'Total Ventas',
            data: totalVentasData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Ganancia',
            data: gananciasData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw; // Obtén el valor
                if (typeof value === 'number') {
                  return `${context.dataset.label}: $${value.toLocaleString()}`;
                }
                return `${context.dataset.label}: $${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Monto'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Categorías'
            }
          }
        }
      }
    });
  }

  consultarVentaDia() {
    let query: string = "SELECT c.nombre AS categoria, YEAR(v.fecha) AS anio, MONTH(v.fecha) AS mes, SUM(pv.total) AS total_ventas, SUM((p.precio_venta - p.precio_compra) * pv.cantidad) AS ganancia FROM producto_venta pv JOIN producto p ON pv.id_producto = p.codigo_producto JOIN categoria c ON p.codigo_categoria = c.codigo_categoria JOIN venta v ON pv.id_venta = v.id_venta WHERE DATE(v.fecha) = CURDATE() GROUP BY c.nombre, YEAR(v.fecha), MONTH(v.fecha) ORDER BY anio DESC, mes DESC, total_ventas DESC;";
    this.reporteService.generarQuery(query).subscribe({
      next: (datos) => {
        this.contenedorDia = datos.data;
        console.log(this.contenedorDia);
        console.log(this.contenedorDia.length)
        this.calcularTotalDia();
        this.cdr.detectChanges();
        this.crearGraficoDia();
      },
      error: errores => {
        console.log(errores)
        this.cdr.detectChanges();
      }
    });
  }

  // PARA SELECCIONAR ANIO MES Y DIA 
  cambioAnio1(event: any): void {
    this.totalVentaDiaMes = 0;
    this.gananciaVentaDiaMes = 0;
    this.seleccionadoAnio1 = event.value; // Captura el valor seleccionado
    console.log('Año seleccionado:', this.seleccionadoAnio1);
    if (this.seleccionadoMes1 && this.seleccionadoDia1) {
      this.crearGraficoDiaMes();
      this.calcularTotalDiaMes();
    }
  }

  cambioMes1(event: any): void {
    this.totalVentaDiaMes = 0;
    this.gananciaVentaDiaMes = 0;
    this.seleccionadoMes1 = event.value; // Captura el valor seleccionado
    console.log('Mes seleccionado:', this.seleccionadoMes1);
    if (this.seleccionadoAnio1 && this.seleccionadoDia1) {
      this.crearGraficoDiaMes();
      this.calcularTotalDiaMes();
    }

  }

  cambioDia1(event: any): void {
    this.totalVentaDiaMes = 0;
    this.gananciaVentaDiaMes = 0;
    this.seleccionadoDia1 = event.value; // Captura el valor seleccionado
    console.log('Mes seleccionado:', this.seleccionadoDia1);
    if (this.seleccionadoAnio1 && this.seleccionadoMes1) {
      this.crearGraficoDiaMes();
      this.calcularTotalDiaMes();
    }

  }

  totalVentaDiaMes = 0;
  gananciaVentaDiaMes = 0;
  calcularTotalDiaMes() {
    this.contenedorDiaMesSeleccionado.forEach(dato => {
      this.totalVentaDiaMes += dato.total_ventas;
      this.gananciaVentaDiaMes += dato.ganancia;
    })
  }

  crearGraficoDiaMes(){
    console.log('podemos crear el grafico')
    this.contenedorDiaMesSeleccionado =  this.contenedorDiaMes.filter(dato => dato.anio === this.seleccionadoAnio1 && 
      dato.mes === this.seleccionadoMes1 && dato.dia === this.seleccionadoDia1
    )

    console.log(this.contenedorDiaMesSeleccionado);

    const labels = this.contenedorDiaMesSeleccionado.map((item) => item.categoria); // Categorías
    const totalVentasData = this.contenedorDiaMesSeleccionado.map((item) => item.total_ventas); // Total Ventas
    const gananciasData = this.contenedorDiaMesSeleccionado.map((item) => item.ganancia); // Ganancias

     // Verificamos si el gráfico ya existe y lo destruimos si es necesario
     if (this.chartContenedorDiaMes) {
      this.chartContenedorDiaMes.destroy();
    }

    this.chartContenedorDiaMes =  new Chart('ventaDiaMes', {
      type: 'bar',
      data: {
        labels: labels, // Categorías
        datasets: [
          {
            label: 'Total Ventas',
            data: totalVentasData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Ganancia',
            data: gananciasData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw; // Obtén el valor
                if (typeof value === 'number') {
                  return `${context.dataset.label}: $${value.toLocaleString()}`;
                }
                return `${context.dataset.label}: $${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Monto'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Categorías'
            }
          }
        }
      }
    });

  }

  consultarVentaMesDia(){
    const query = "SELECT c.nombre AS categoria, YEAR(v.fecha) AS anio, MONTH(v.fecha) AS mes, DAY(v.fecha) AS dia, SUM(pv.total) AS total_ventas, SUM((p.precio_venta - p.precio_compra) * pv.cantidad) AS ganancia FROM producto_venta pv JOIN producto p ON pv.id_producto = p.codigo_producto JOIN categoria c ON p.codigo_categoria = c.codigo_categoria JOIN venta v ON pv.id_venta = v.id_venta GROUP BY c.nombre, YEAR(v.fecha), MONTH(v.fecha), DAY(v.fecha) ORDER BY anio DESC, mes DESC, total_ventas DESC;";

    this.reporteService.generarQuery(query).subscribe({
      next: (datos) => {
        this.contenedorDiaMes = datos.data;
        console.log(this.contenedorDiaMes);
        console.log(this.contenedorDiaMes.length)

        this.categoriaMes1 = [...new Set(this.contenedorDiaMes.map(venta => venta.mes))];
        this.categoriaAnio1 = [...new Set(this.contenedorDiaMes.map(venta => venta.anio))];
        this.categoriaDia1 = [...new Set(this.contenedorDiaMes.map(venta => venta.dia))];
        // this.calcularTotalDia();
        this.cdr.detectChanges();
        // this.crearGraficoDiaMes();
        

        console.log(`Años únicos: ${this.categoriaAnio1}, Meses únicos: ${this.categoriaMes1}`);
      },
      error: errores => {
        console.log(errores)
        this.cdr.detectChanges();
      }
    });

  }

  //PARA SELECCIONAR ANIO MES ========

  cambioAnio2(event: any): void {
    this.totalVentaMesAnio = 0;
    this.gananciaVentaMesAnio = 0;
    this.seleccionadoAnio2 = event.value; // Captura el valor seleccionado
    console.log('Año seleccionado:', this.seleccionadoAnio2);
    if (this.seleccionadoMes2) {
      this.crearGraficoMesAnio();
      this.calcularTotalMesAnio();
    }
  }

  cambioMes2(event: any): void {
    this.totalVentaMesAnio = 0;
    this.gananciaVentaMesAnio = 0;
    this.seleccionadoMes2 = event.value; // Captura el valor seleccionado
    console.log('Mes seleccionado:', this.seleccionadoMes2);
    if (this.seleccionadoAnio2) {
      this.crearGraficoMesAnio();
      this.calcularTotalMesAnio();
    }

  }

  totalVentaMesAnio = 0;
  gananciaVentaMesAnio = 0;
  calcularTotalMesAnio() {
    this.contenedorMesAnioSeleccionado.forEach(dato => {
      this.totalVentaMesAnio += dato.total_ventas;
      this.gananciaVentaMesAnio += dato.ganancia;
    })
  }

  crearGraficoMesAnio(){
    console.log('podemos crear el grafico')
    this.contenedorMesAnioSeleccionado =  this.contenedorMesAnio.filter(dato => dato.anio === this.seleccionadoAnio2 && 
      dato.mes === this.seleccionadoMes2 )

    console.log(this.contenedorMesAnioSeleccionado);

    const labels = this.contenedorMesAnioSeleccionado.map((item) => item.categoria); // Categorías
    const totalVentasData = this.contenedorMesAnioSeleccionado.map((item) => item.total_ventas); // Total Ventas
    const gananciasData = this.contenedorMesAnioSeleccionado.map((item) => item.ganancia); // Ganancias

     // Verificamos si el gráfico ya existe y lo destruimos si es necesario
     if (this.chartContenedorMesAnio) {
      this.chartContenedorMesAnio.destroy();
    }

    this.chartContenedorMesAnio =  new Chart('ventaMesAnio', {
      type: 'bar',
      data: {
        labels: labels, // Categorías
        datasets: [
          {
            label: 'Total Ventas',
            data: totalVentasData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Ganancia',
            data: gananciasData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw; // Obtén el valor
                if (typeof value === 'number') {
                  return `${context.dataset.label}: $${value.toLocaleString()}`;
                }
                return `${context.dataset.label}: $${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Monto'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Categorías'
            }
          }
        }
      }
    });

  }

  consultarVentaMesAnio(){
    const query = "SELECT c.nombre AS categoria, YEAR(v.fecha) AS anio, MONTH(v.fecha) AS mes, SUM(pv.total) AS total_ventas, SUM((p.precio_venta - p.precio_compra) * pv.cantidad) AS ganancia FROM producto_venta pv JOIN producto p ON pv.id_producto = p.codigo_producto JOIN categoria c ON p.codigo_categoria = c.codigo_categoria JOIN venta v ON pv.id_venta = v.id_venta GROUP BY c.nombre, YEAR(v.fecha), MONTH(v.fecha) ORDER BY anio DESC, mes DESC, total_ventas DESC;";


    this.reporteService.generarQuery(query).subscribe({
      next: (datos) => {
        this.contenedorMesAnio = datos.data;
        console.log(this.contenedorMesAnio);
        console.log(this.contenedorMesAnio.length)

        this.categoriaMes2 = [...new Set(this.contenedorMesAnio.map(venta => venta.mes))];
        this.categoriaAnio2 = [...new Set(this.contenedorMesAnio.map(venta => venta.anio))];
        // this.calcularTotalDia();
        this.cdr.detectChanges();
        // this.crearGraficoDiaMes();
        

        console.log(`Años únicos: ${this.categoriaAnio2}, Meses únicos: ${this.categoriaMes2}`);
      },
      error: errores => {
        console.log(errores)
        this.cdr.detectChanges();
      }
    });

  }

  // AHORA CONSULTAS CON SOLO EL ANIO 

  cambioAnio3(event: any): void {
    this.totalVentaAnio = 0;
    this.gananciaVentaAnio = 0;
    this.seleccionadoAnio3 = event.value; // Captura el valor seleccionado
    console.log('Año seleccionado:', this.seleccionadoAnio3);

      this.crearGraficoAnio();
      this.calcularTotalAnio();
    
  }

  totalVentaAnio = 0;
  gananciaVentaAnio = 0;
  calcularTotalAnio() {
    this.contenedorAnioSeleccionado.forEach(dato => {
      this.totalVentaAnio += dato.total_ventas;
      this.gananciaVentaAnio += dato.ganancia;
    })
  }


  crearGraficoAnio(){
    console.log('podemos crear el grafico')
    this.contenedorAnioSeleccionado =  this.contenedorAnio.filter(dato => dato.anio === this.seleccionadoAnio3)

    console.log(this.contenedorAnioSeleccionado);

    const labels = this.contenedorAnioSeleccionado.map((item) => item.categoria); // Categorías
    const totalVentasData = this.contenedorAnioSeleccionado.map((item) => item.total_ventas); // Total Ventas
    const gananciasData = this.contenedorAnioSeleccionado.map((item) => item.ganancia); // Ganancias

     // Verificamos si el gráfico ya existe y lo destruimos si es necesario
     if (this.chartContenedorAnio) {
      this.chartContenedorAnio.destroy();
    }

    this.chartContenedorAnio =  new Chart('ventaAnio', {
      type: 'bar',
      data: {
        labels: labels, // Categorías
        datasets: [
          {
            label: 'Total Ventas',
            data: totalVentasData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Ganancia',
            data: gananciasData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw; // Obtén el valor
                if (typeof value === 'number') {
                  return `${context.dataset.label}: $${value.toLocaleString()}`;
                }
                return `${context.dataset.label}: $${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Monto'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Categorías'
            }
          }
        }
      }
    });

  }


  consultarVentaAnio(){
    const query = "SELECT c.nombre AS categoria, YEAR(v.fecha) AS anio, SUM(pv.total) AS total_ventas, SUM((p.precio_venta - p.precio_compra) * pv.cantidad) AS ganancia FROM producto_venta pv JOIN producto p ON pv.id_producto = p.codigo_producto JOIN categoria c ON p.codigo_categoria = c.codigo_categoria JOIN venta v ON pv.id_venta = v.id_venta GROUP BY c.nombre, YEAR(v.fecha) ORDER BY anio DESC, total_ventas DESC;";

    this.reporteService.generarQuery(query).subscribe({
      next: (datos) => {
        this.contenedorAnio = datos.data;
        console.log(this.contenedorAnio);
        console.log(this.contenedorAnio.length)

        this.categoriaAnio3 = [...new Set(this.contenedorAnio.map(venta => venta.anio))];
        // this.calcularTotalDia();
        this.cdr.detectChanges();
        // this.crearGraficoDiaMes();
        

        console.log(`Años únicos: ${this.categoriaAnio3}`);
      },
      error: errores => {
        console.log(errores)
        this.cdr.detectChanges();
      }
    });

  }

  //para conocer las ventas generales de los departamentos 

  totalVentaGeneral = 0;
  gananciaVentaGeneral = 0;
  calcularTotalGeneral() {
    this.contenedorGeneral.forEach(dato => {
      this.totalVentaGeneral += dato.total_ventas;
      this.gananciaVentaGeneral += dato.ganancia;
    })
  }

  crearGraficoGeneral() {
    const labels = this.contenedorGeneral.map((item) => item.categoria); // Categorías
    const totalVentasData = this.contenedorGeneral.map((item) => item.total_ventas); // Total Ventas
    const gananciasData = this.contenedorGeneral.map((item) => item.ganancia); // Ganancias


    new Chart('ventaGeneral', {
      type: 'bar',
      data: {
        labels: labels, // Categorías
        datasets: [
          {
            label: 'Total Ventas',
            data: totalVentasData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Ganancia',
            data: gananciasData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw; // Obtén el valor
                if (typeof value === 'number') {
                  return `${context.dataset.label}: $${value.toLocaleString()}`;
                }
                return `${context.dataset.label}: $${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Monto'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Categorías'
            }
          }
        }
      }
    });
  }

  consultarVentaGeneral() {
    const query = "SELECT c.nombre AS categoria, SUM(pv.total) AS total_ventas, SUM((p.precio_venta - p.precio_compra) * pv.cantidad) AS ganancia FROM producto_venta pv JOIN producto p ON pv.id_producto = p.codigo_producto JOIN categoria c ON p.codigo_categoria = c.codigo_categoria JOIN venta v ON pv.id_venta = v.id_venta GROUP BY c.nombre ORDER BY total_ventas DESC;";


    this.reporteService.generarQuery(query).subscribe({
      next: (datos) => {
        this.contenedorGeneral = datos.data;
        console.log(this.contenedorGeneral);
        console.log(this.contenedorGeneral.length)
        this.calcularTotalGeneral();
        this.cdr.detectChanges();
        this.crearGraficoGeneral();
      },
      error: errores => {
        console.log(errores)
        this.cdr.detectChanges();
      }
    });
  }



  //productos mas vendidos  por anio y mes 

  





  // obtenerVentasDia(query: string) {
  //   this.reporteService.generarQuery(query).subscribe({
  //     next: (datos) => {

  //       this.contenedorDia = datos.data;
  //       console.log(this.contenedorDia);
  //     },
  //     error: (errores) => {
  //       console.log(errores);
  //     }
  //   });
  // }

  // obtenerVentaCategoriaTotal() {
  //   this.reporteService.getVentaCategoriaTotal().subscribe({
  //     next: (datos) => {
  //       this.ventasPorCategoria = datos;
  //       console.log(this.ventasPorCategoria);
  //       this.graficoVentaCategoriaTotal();
  //     }
  //   });
  // }

  // obtenerVentaCategoriaMes() {
  //   this.reporteService.getVentaCategoriaMes().subscribe({
  //     next: (datos) => {
  //       this.ventasPorCategoriaMes = datos;
  //       console.log(this.ventasPorCategoriaMes);
  //       this.categoria_mes = [...new Set(this.ventasPorCategoriaMes.map(venta => venta.mes))];
  //       this.categoria_anio = [...new Set(this.ventasPorCategoriaMes.map(venta => venta.anio))];

  //       console.log(`Años únicos: ${this.categoria_anio}, Meses únicos: ${this.categoria_mes}`);

  //       //this.graficoVentaCategoriaMes();

  //     }
  //   });
  // }

  // obtenerVentaCategoriaAnio() {
  //   this.reporteService.getVentaCategoriaAnio().subscribe({
  //     next: (datos) => {
  //       this.ventasPorCategoriaAnio = datos;
  //       console.log(this.ventasPorCategoriaMes);
  //       this.categoriaAnio_grafico3 = [...new Set(this.ventasPorCategoriaAnio.map(venta => venta.anio))];

  //       console.log(`Años únicos: ${this.categoria_anio}`);

  //       //this.graficoVentaCategoriaMes();

  //     }
  //   });
  // }

  // obtenerMasVendidos() {
  //   this.reporteService.getMasVendido().subscribe({
  //     next: (datos) => {
  //       this.productosMasVendidos = datos;
  //       console.log(this.productosMasVendidos);
  //       this.graficoMasVendidos();
  //     }
  //   });
  // }





  // graficoVentaCategoriaTotal() {
  //   // Procesamos los datos dinámicamente
  //   const labels = this.ventasPorCategoria.map(venta => venta.categoria); // Extrae las categorías
  //   const dataValues = this.ventasPorCategoria.map(venta => venta.total_ventas); // Extrae los valores

  //   // Configuramos los datos para Chart.js
  //   const data = {
  //     labels: labels, // Categorías dinámicas
  //     datasets: [{
  //       label: "Total: ",
  //       data: dataValues, // Valores dinámicos
  //       backgroundColor: [
  //         'rgb(255, 99, 132)', // Colores personalizados
  //         'rgb(75, 192, 192)',
  //         'rgb(255, 205, 86)',
  //         'rgb(201, 203, 207)',
  //         'rgb(54, 162, 235)',
  //         'rgb(153, 102, 255)',
  //         'rgb(255, 159, 64)'
  //       ].slice(0, labels.length) // Ajustar la cantidad de colores según el número de categorías
  //     }]
  //   };

  //   // Verificamos si el gráfico ya existe y lo destruimos si es necesario
  //   if (this.chartTotalCategoria) {
  //     this.chartTotalCategoria.destroy();
  //   }

  //   // Creamos el gráfico dinámico
  //   this.chartTotalCategoria = new Chart("chartTotalCategoria", {
  //     type: 'pie' as ChartType, // Tipo de gráfico (puede ser 'pie', 'doughnut', etc.)
  //     data: data, // Datos dinámicos
  //     options: {
  //       responsive: true, // Habilita el redimensionamiento automático
  //       maintainAspectRatio: false, // Permite modificar la proporción si es necesario
  //     },
  //   });
  // }

  // // Métodos para manejar los cambios
  // onYearChange(event: any): void {
  //   this.selectedYear = event.value; // Captura el valor seleccionado
  //   console.log('Año seleccionado:', this.selectedYear);
  //   if (this.selectedMonth) {
  //     this.graficoVentaCategoriaMes();
  //   }
  // }

  // onMonthChange(event: any): void {
  //   this.selectedMonth = event.value; // Captura el valor seleccionado
  //   console.log('Mes seleccionado:', this.selectedMonth);
  //   if (this.selectedYear) {
  //     this.graficoVentaCategoriaMes();
  //   }

  // }

  // onYearChange2(event: any): void {
  //   this.anioSeleccionado = event.value; // Captura el valor seleccionado
  //   console.log('Año seleccionado:', this.selectedYear);
  //   this.graficoVentaCategoriaAnio();
  // }

  // graficoVentaCategoriaMes() {
  //   const labels = this.ventasPorCategoriaMes.filter(venta => venta.anio === this.selectedYear && venta.mes === this.selectedMonth).map(venta => venta.categoria); // Extrae las categorías
  //   console.log(labels)
  //   const dataValues = this.ventasPorCategoriaMes.filter(venta => venta.anio === this.selectedYear && venta.mes === this.selectedMonth).map(venta => venta.total_ventas); // Extrae los valores
  //   console.log(dataValues)

  //   // datos
  //   const data = {
  //     labels: labels,
  //     datasets: [{
  //       label: '',
  //       data: dataValues,
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //         'rgba(255, 205, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(201, 203, 207, 0.2)'
  //       ].slice(0, labels.length),
  //       borderColor: [
  //         'rgb(255, 99, 132)',
  //         'rgb(255, 159, 64)',
  //         'rgb(255, 205, 86)',
  //         'rgb(75, 192, 192)',
  //         'rgb(54, 162, 235)',
  //         'rgb(153, 102, 255)',
  //         'rgb(201, 203, 207)'
  //       ].slice(0, labels.length),
  //       borderWidth: 1
  //     }]
  //   };

  //   // Verificamos si el gráfico ya existe y lo destruimos si es necesario
  //   if (this.chartCategoriaMes) {
  //     this.chartCategoriaMes.destroy();
  //   }

  //   // Creamos la gráfica
  //   this.chartCategoriaMes = new Chart("chartCategoriaMes", {
  //     type: 'bar' as ChartType, // tipo de la gráfica 
  //     data: data, // datos 
  //     options: { // opciones de la gráfica 
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     },
  //   });
  // }

  // graficoVentaCategoriaAnio() {
  //   const labels = this.ventasPorCategoriaAnio.filter(venta => venta.anio === this.anioSeleccionado).map(venta => venta.categoria); // Extrae las categorías
  //   console.log(labels)
  //   const dataValues = this.ventasPorCategoriaAnio.filter(venta => venta.anio === this.anioSeleccionado).map(venta => venta.total_ventas); // Extrae los valores
  //   console.log(dataValues)

  //   // datos
  //   const data = {
  //     labels: labels,
  //     datasets: [{
  //       label: 'ventas por categoria',
  //       data: dataValues,
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //         'rgba(255, 205, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(201, 203, 207, 0.2)'
  //       ],
  //       borderColor: [
  //         'rgb(255, 99, 132)',
  //         'rgb(255, 159, 64)',
  //         'rgb(255, 205, 86)',
  //         'rgb(75, 192, 192)',
  //         'rgb(54, 162, 235)',
  //         'rgb(153, 102, 255)',
  //         'rgb(201, 203, 207)'
  //       ],
  //       borderWidth: 1
  //     }]
  //   };

  //   // Verificamos si el gráfico ya existe y lo destruimos si es necesario
  //   if (this.chartCategoriaAnio) {
  //     this.chartCategoriaAnio.destroy();
  //   }

  //   // Creamos la gráfica
  //   this.chartCategoriaAnio = new Chart("chartCategoriaAnio", {
  //     type: 'bar' as ChartType, // tipo de la gráfica 
  //     data: data, // datos 
  //     options: { // opciones de la gráfica 
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     },
  //   });
  // }


  // //mas vendidos

  // graficoMasVendidos() {
  //   const labels = this.productosMasVendidos.map(venta => venta.nombreProducto); // Extrae las categorías
  //   console.log(labels)
  //   const dataValues = this.productosMasVendidos.map(venta => venta.totalVendido); // Extrae los valores
  //   console.log(dataValues)

  //   // datos
  //   const data = {
  //     labels: labels,
  //     datasets: [{
  //       label: 'ventas por categoria',
  //       data: dataValues,
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //         'rgba(255, 205, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(201, 203, 207, 0.2)'
  //       ],
  //       borderColor: [
  //         'rgb(255, 99, 132)',
  //         'rgb(255, 159, 64)',
  //         'rgb(255, 205, 86)',
  //         'rgb(75, 192, 192)',
  //         'rgb(54, 162, 235)',
  //         'rgb(153, 102, 255)',
  //         'rgb(201, 203, 207)'
  //       ],
  //       borderWidth: 1
  //     }]
  //   };

  //   // Verificamos si el gráfico ya existe y lo destruimos si es necesario
  //   if (this.chartMasVendidos) {
  //     this.chartMasVendidos.destroy();
  //   }

  //   // Creamos la gráfica
  //   this.chartMasVendidos = new Chart("chartMasVendidos", {
  //     type: 'bar' as ChartType, // tipo de la gráfica 
  //     data: data, // datos 
  //     options: { // opciones de la gráfica 
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     },
  //   });
  // }

}
