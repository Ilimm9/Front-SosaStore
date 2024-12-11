import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartType } from 'chart.js/auto';
import { ReporteService } from '../../Servicios/reporte.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
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

  // Atributo que almacena los datos del chart
  public chartTotalCategoria: any;
  ventasPorCategoria: any[];

  public chartCategoriaMes: any;
  ventasPorCategoriaMes: any[];
  categoria_anio: number[] = [];
  categoria_mes: number[] = [];
  // Variables para guardar las selecciones
  selectedYear: number | null = null;
  selectedMonth: number | null = null;

  public chartCategoriaAnio: any;
  ventasPorCategoriaAnio: any[];
  categoriaAnio_grafico3: number[] = [];
  anioSeleccionado: number | null = null;

  public chartMasVendidos: any;
  productosMasVendidos: any[];

  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.obtenerVentaCategoriaTotal();
    this.obtenerVentaCategoriaMes();
    this.obtenerVentaCategoriaAnio();
    this.obtenerMasVendidos();
    // this.graficoVentaCategoriaMes();

  }

  obtenerVentaCategoriaTotal() {
    this.reporteService.getVentaCategoriaTotal().subscribe({
      next: (datos) => {
        this.ventasPorCategoria = datos;
        console.log(this.ventasPorCategoria);
        this.graficoVentaCategoriaTotal();
      }
    });
  }

  obtenerVentaCategoriaMes() {
    this.reporteService.getVentaCategoriaMes().subscribe({
      next: (datos) => {
        this.ventasPorCategoriaMes = datos;
        console.log(this.ventasPorCategoriaMes);
        this.categoria_mes = [...new Set(this.ventasPorCategoriaMes.map(venta => venta.mes))];
        this.categoria_anio = [...new Set(this.ventasPorCategoriaMes.map(venta => venta.anio))];

        console.log(`Años únicos: ${this.categoria_anio}, Meses únicos: ${this.categoria_mes}`);

        //this.graficoVentaCategoriaMes();

      }
    });
  }

  obtenerVentaCategoriaAnio() {
    this.reporteService.getVentaCategoriaAnio().subscribe({
      next: (datos) => {
        this.ventasPorCategoriaAnio = datos;
        console.log(this.ventasPorCategoriaMes);
        this.categoriaAnio_grafico3 = [...new Set(this.ventasPorCategoriaAnio.map(venta => venta.anio))];

        console.log(`Años únicos: ${this.categoria_anio}`);

        //this.graficoVentaCategoriaMes();

      }
    });
  }

  obtenerMasVendidos() {
    this.reporteService.getMasVendido().subscribe({
      next: (datos) => {
        this.productosMasVendidos = datos;
        console.log(this.productosMasVendidos);
        this.graficoMasVendidos();
      }
    });
  }

  graficoVentaCategoriaTotal() {
    // Procesamos los datos dinámicamente
    const labels = this.ventasPorCategoria.map(venta => venta.categoria); // Extrae las categorías
    const dataValues = this.ventasPorCategoria.map(venta => venta.total_ventas); // Extrae los valores

    // Configuramos los datos para Chart.js
    const data = {
      labels: labels, // Categorías dinámicas
      datasets: [{
        label: "Total: ",
        data: dataValues, // Valores dinámicos
        backgroundColor: [
          'rgb(255, 99, 132)', // Colores personalizados
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)'
        ].slice(0, labels.length) // Ajustar la cantidad de colores según el número de categorías
      }]
    };

    // Verificamos si el gráfico ya existe y lo destruimos si es necesario
    if (this.chartTotalCategoria) {
      this.chartTotalCategoria.destroy();
    }

    // Creamos el gráfico dinámico
    this.chartTotalCategoria = new Chart("chartTotalCategoria", {
      type: 'pie' as ChartType, // Tipo de gráfico (puede ser 'pie', 'doughnut', etc.)
      data: data, // Datos dinámicos
      options: {
        responsive: true, // Habilita el redimensionamiento automático
        maintainAspectRatio: false, // Permite modificar la proporción si es necesario
      },
    });
  }

  // Métodos para manejar los cambios
  onYearChange(event: any): void {
    this.selectedYear = event.value; // Captura el valor seleccionado
    console.log('Año seleccionado:', this.selectedYear);
    if (this.selectedMonth) {
      this.graficoVentaCategoriaMes();
    }
  }

  onMonthChange(event: any): void {
    this.selectedMonth = event.value; // Captura el valor seleccionado
    console.log('Mes seleccionado:', this.selectedMonth);
    if (this.selectedYear) {
      this.graficoVentaCategoriaMes();
    }

  }

  onYearChange2(event: any): void {
    this.anioSeleccionado = event.value; // Captura el valor seleccionado
    console.log('Año seleccionado:', this.selectedYear);
    this.graficoVentaCategoriaAnio();
  }

  graficoVentaCategoriaMes() {
    const labels = this.ventasPorCategoriaMes.filter(venta => venta.anio === this.selectedYear && venta.mes === this.selectedMonth).map(venta => venta.categoria); // Extrae las categorías
    console.log(labels)
    const dataValues = this.ventasPorCategoriaMes.filter(venta => venta.anio === this.selectedYear && venta.mes === this.selectedMonth).map(venta => venta.total_ventas); // Extrae los valores
    console.log(dataValues)

    // datos
    const data = {
      labels: labels,
      datasets: [{
        label: '',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ].slice(0, labels.length),
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ].slice(0, labels.length),
        borderWidth: 1
      }]
    };

    // Verificamos si el gráfico ya existe y lo destruimos si es necesario
    if (this.chartCategoriaMes) {
      this.chartCategoriaMes.destroy();
    }

    // Creamos la gráfica
    this.chartCategoriaMes = new Chart("chartCategoriaMes", {
      type: 'bar' as ChartType, // tipo de la gráfica 
      data: data, // datos 
      options: { // opciones de la gráfica 
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  graficoVentaCategoriaAnio() {
    const labels = this.ventasPorCategoriaAnio.filter(venta => venta.anio === this.anioSeleccionado).map(venta => venta.categoria); // Extrae las categorías
    console.log(labels)
    const dataValues = this.ventasPorCategoriaAnio.filter(venta => venta.anio === this.anioSeleccionado ).map(venta => venta.total_ventas); // Extrae los valores
    console.log(dataValues)

    // datos
    const data = {
      labels: labels,
      datasets: [{
        label: 'ventas por categoria',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };

    // Verificamos si el gráfico ya existe y lo destruimos si es necesario
    if (this.chartCategoriaAnio) {
      this.chartCategoriaAnio.destroy();
    }

    // Creamos la gráfica
    this.chartCategoriaAnio = new Chart("chartCategoriaAnio", {
      type: 'bar' as ChartType, // tipo de la gráfica 
      data: data, // datos 
      options: { // opciones de la gráfica 
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }


  //mas vendidos

  graficoMasVendidos() {
    const labels = this.productosMasVendidos.map(venta => venta.nombreProducto); // Extrae las categorías
    console.log(labels)
    const dataValues = this.productosMasVendidos.map(venta => venta.totalVendido); // Extrae los valores
    console.log(dataValues)

    // datos
    const data = {
      labels: labels,
      datasets: [{
        label: 'ventas por categoria',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };

    // Verificamos si el gráfico ya existe y lo destruimos si es necesario
    if (this.chartMasVendidos) {
      this.chartMasVendidos.destroy();
    }

    // Creamos la gráfica
    this.chartMasVendidos = new Chart("chartMasVendidos", {
      type: 'bar' as ChartType, // tipo de la gráfica 
      data: data, // datos 
      options: { // opciones de la gráfica 
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

}
