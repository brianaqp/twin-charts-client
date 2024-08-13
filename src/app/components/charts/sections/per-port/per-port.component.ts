import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  input,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';
import * as chroma from 'chroma-js';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PortDataset, KeyItem } from '../../../../interfaces/data';
import { FilterInPortPipe } from '../../../../pipes/filter-in-port.pipe';
import { TonFormatPipe } from '../../../../pipes/ton-format.pipe';
import { PortStatusItem, SeriesItem } from '../../../../interfaces/charts';

@Component({
  selector: 'chart-per-port',
  standalone: true,
  imports: [FormsModule, NgbDropdownModule, FilterInPortPipe, TonFormatPipe],
  templateUrl: './per-port.component.html',
  styleUrl: './per-port.component.scss',
})

// [ ] Anadir logica de reinicio de datos en onCheckboxChange y en el effect
export class PerPortComponent implements AfterViewInit {
  // Inputs
  sourceData = input<{ ports: string[]; data: PortDataset }>({
    ports: [],
    data: [],
  });

  // DOM elements
  @ViewChild('barDivContainer') barChContainer!: ElementRef<HTMLDivElement>;

  // Chart instance
  barChart!: echarts.ECharts;

  // Chart configuration
  readonly maxItems = 15;
  readonly chartColorRanges = [
    '#2c3e50',
    '#8e44ad',
    '#2980b9',
    '#16a085',
    '#f39c12',
    '#d35400',
    '#c0392b',
  ];

  // Variables de las graficas
  categories: string[] = [];
  series: SeriesItem[] = [];

  // Ports and their status
  portsState: PortStatusItem[] = [];

  // Search input variables
  searchInput = '';
  searchPlaceholder = '';

  // Signals in constructor
  constructor() {
    // Detect changes in source data
    effect(() => {
      const { data, ports } = this.sourceData();
      // 1. Crear el arreglo de puertos
      this.initializePorts(ports);
      // 2. Process source data
      this.loadSourceData(data);
      // 3. Generate the chart
      this.generateBarChart();
      // 4. Generate utilites
      this.loadUtilities(data);
    });
  }

  // --- Lifecycle methods
  ngAfterViewInit() {
    // Create the chart instance
    this.barChart = echarts.init(this.barChContainer.nativeElement);
  }
  // --- Host Listeners
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.barChart.resize();
    }
  // --- DOM methods
  /**
   * Cambia el estado de un puerto. Si se activa, se reinicia la gráfica.
   * @param port
   * @param status
   */
  // [ ] Anadir logica de reinicio de datos
  onCheckboxChange(port: string, status: boolean) {
    const portIndex = this.portsState.findIndex((p) => p.name === port);
    this.portsState[portIndex].status = status;
    // restart
    this.loadSourceData(this.sourceData().data);
    this.generateBarChart();
  }

  /**
   * Metodo que se encarga de retornar el tonaleje de un item en un puerto.
   * Si existe, retorna el valor, si no, retorna 0.
   * @param item
   * @returns
   */
  getPortValue(keyItem: KeyItem, port: string) {
    return keyItem.ports.find((p) => p.name === port)?.value || 0;
  }

  /**
   * Metodo que inicializa los puertos y marca los primeros tres como activos.
   * @param items
   */
  initializePorts(items: string[] | undefined) {
    if (items) {
      // Create the ports state list
      this.portsState = items.map((port) => ({
        name: port,
        status: false,
      }));

      // Set the first three ports as active
      [0, 1, 2].forEach((index) => {
        this.portsState[index].status = true;
      });
    }
  }

  // --- Data processing
  /**
   * Metodo que se encarga de procesar los datos de entrada y generar las series y categorias.
   * @param data
   * @returns
   */
  loadSourceData(data: PortDataset) {
    // Early exit
    if (!data || data.length === 0) {
      return;
    }
    // 1. Limitar la cantidad de items a mostrar
    const slicedData = data.slice(0, this.maxItems);

    // 2. Categorias. Filtrar los puertos activos.
    this.categories = this.portsState
      .filter((port) => port.status)
      .map((port) => port.name);

    // 3. Series. Crear las series de la gráfica.
    const series: SeriesItem[] = [];

    // 4. Iterar sobre cada item para crear las series
    slicedData.forEach((keyItem) => {
      // 4.1. Crear serie por item, con datos por puerto
      const serie: SeriesItem = {
        name: keyItem.name,
        type: 'bar',
        data: [],
        itemStyle: {},
      };

      // 4.2 Por cada categoria, buscar si en el KeyItem hay un puerto con ese nombre.
      // Si lo hay, se agrega el valor, si no, se agrega un 0.
      this.categories.forEach((category) => {
        const productInPort = keyItem.ports.find(
          (p) => p.name === category
        );
        if (productInPort) {
          serie.data.push(productInPort.value);
        } else {
          serie.data.push(0);
        }
      });

      // 4.3 Agregar la serie al arreglo de series
      series.push(serie);
    });

    this.series = series;
  }

  // --- Chart methods
  generateBarChart() {
    // 1. Validar que la gráfica exista
    if (!this.barChart) {
      console.log('Early exit in generateBarChart');
      return;
    }

    // 2. Crear la paleta de colores
    // 2.1 Escala de colores
    const soberColorScale = chroma
      .scale(this.chartColorRanges)
      .mode('lch')
      .colors(this.series.length);

    // 2.2 Aplicar los colores a las series
    this.series.forEach((serie, index) => {
      serie.itemStyle = {
        color: soberColorScale[index],
      };
    });

    // 3. Configurar la gráfica
    // 3.1. Crear las opciones de la gráfica
    const options: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.categories,
        axisLabel: {
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: this.series,
    };

    // 3.3. Aplicar las opciones a la gráfica
    this.barChart.setOption(options);
  }

  // --- Utilities
  loadUtilities(data: PortDataset) {
    // Create the search input placeholder with 3 random cargos
    this.searchPlaceholder =
      [...data]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((item) => item.name)
        .join(', ') + '...';
  }
}
