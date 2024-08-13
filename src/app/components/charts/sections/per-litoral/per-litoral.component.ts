import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import * as echarts from 'echarts';
import * as chroma from 'chroma-js';
import { ApiService } from '../../../../services/api.service';
import { LitoralItem, LitoralDataset } from '../../../../interfaces/data';
import { FilterPipe } from '../../../../pipes/filter.pipe';
import { TonFormatPipe } from '../../../../pipes/ton-format.pipe';
import { SeriesItem, SeriesItemPie } from '../../../../interfaces/charts';

@Component({
  selector: 'chart-per-litoral',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, FilterPipe, TonFormatPipe],
  providers: [ApiService],
  templateUrl: './per-litoral.component.html',
  styleUrl: './per-litoral.component.scss',
})
export class PerLitoralComponent implements AfterViewInit {
  // Inputs
  sourceData = input<LitoralDataset>({
    pacific: {
      total: 0,
      items: [],
    },
    gulf: {
      total: 0,
      items: [],
    },
  });

  // DOM Elements
  // Charts container
  @ViewChild('pieChartContainer') pieChartCon!: ElementRef<HTMLDivElement>;
  @ViewChild('pacificBarContainer') pacificBarCon!: ElementRef<HTMLDivElement>;
  @ViewChild('gulfBarContainer') gulfBarCon!: ElementRef<HTMLDivElement>;

  // Chart instances
  litorialDiffChart!: echarts.ECharts;
  pacificChart!: echarts.ECharts;
  gulfChart!: echarts.ECharts;
  allCharts: echarts.ECharts[] = [];

  // Chart configuration
  readonly maxLitoralItems = 15;

  // Colors
  readonly pacificColor = '#405D72';
  readonly gulfColor = '#009FBD';
  readonly chartColorRanges = [this.pacificColor, this.gulfColor];

  // Charts variables
  series: SeriesItem[] = [];
  categories: string[] = [];

  // DOM variables
  searchInput!: string;
  searchPlaceholder: string = '';

  // Signals in constructor
  constructor() {
    effect(() => {
      // 1. Get data
      const data = this.sourceData();
      console.log(data)
      // 2. Load source data
      this.loadSourceData(data);
      // 2. Generate diff chart
      this.generatePieChart(data);
      // 3. Generate bar charts
      this.generateBarCharts(data);
      // 4. Utility functions
      this.initUtilities();
    });
  }

  // --- LIFECYCLE HOOKS
  ngAfterViewInit() {
    // Init charts
    this.litorialDiffChart = echarts.init(this.pieChartCon.nativeElement);
    this.pacificChart = echarts.init(this.pacificBarCon.nativeElement);
    this.gulfChart = echarts.init(this.gulfBarCon.nativeElement);
    // Group all charts in an array
    this.allCharts = [
      this.litorialDiffChart,
      this.pacificChart,
      this.gulfChart,
    ];
    //
  }

  //
  // --- HOST LISTENERS EVENTS
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.allCharts.forEach((chart) => {
      chart.resize();
    });
  }

  // --- DOM METHODS
  getGulfProducts(): LitoralItem[] {
    return this.sourceData().gulf.items;
  }

  getPacificProducts(): LitoralItem[] {
    return this.sourceData().pacific.items;
  }

  /**
   * Metodo que genera procesos de utilidad
   * @param data
   */
  initUtilities() {
    // 1. Search placeholder
    const allProducts = [...this.getPacificProducts(), ...this.getGulfProducts()];
    // 2. Took 3 random products
    const randomProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 3);
    // 3. Generate placeholder
    this.searchPlaceholder = randomProducts.map((product) => product.name).join(', ') + '...';
  }

  /**
   * Metodo que carga los datos litorales
   * @param data
   * @returns
   */
  loadSourceData(data: LitoralDataset) {
    // Validation
    if (!data) {
      return console.log('No data to generate charts');
    }
  }

  /**
   * Metodo que genera una grafica de pastel
   */
  generatePieChart(data: LitoralDataset | undefined) {
    // 1. Validacion
    if (!data) {
      return console.log('No data to generate pie chart');
    }

    // Funcion para calcular el porcentaje.
    const percentOf = (value: number, total: number) => {
      return ((value / total) * 100).toFixed(2) + '%';
    };

    // Construir la series
    const series: SeriesItemPie[] = [
      {
        value: data.pacific.total,
        name: 'Pacific',
        itemStyle: { color: this.pacificColor },
        label: {
          fontSize: 20,
          formatter: percentOf(
            data.pacific.total,
            data.gulf.total + data.pacific.total
          ),
        },
      },
      {
        value: data.gulf.total,
        name: 'Gulf',
        itemStyle: { color: this.gulfColor },
        label: {
          fontSize: 20,
          formatter: percentOf(
            data.gulf.total,
            data.gulf.total + data.pacific.total
          ),
        },
      },
    ];

    // Opciones
    const options: echarts.EChartsOption = {
      grid: {
        left: '70%',
        right: '70%',
      },
      legend: {
        show: true,
        orient: 'horizontal',
        left: 'center',
        textStyle: {
          fontSize: '20',
        },
      },
      series: [
        {
          type: 'pie',
          label: {
            show: true,
            position: 'inner',
          },
          data: series,
        },
      ],
    };

    this.litorialDiffChart.setOption(options);
  }

  /** Metodo que genera las graficas de barras
   * @param data
   */
  generateBarCharts(data: LitoralDataset | undefined) {
    // 1. Validacion
    if (!data) {
      return console.log('No data to generate bar charts');
    }

    // 2. Utilities for bars
    const colorPalette = chroma
      .scale(this.chartColorRanges)
      .colors(this.maxLitoralItems);

    // generate logic
    const generateBarChart = (
      label: 'pacific' | 'gulf',
      chartReference: echarts.ECharts
    ) => {
      const slicedData = data[label].items.slice(0, this.maxLitoralItems);

      // 3. Create categories and series
      const categories = slicedData.map((item) => item.name);
      const series: SeriesItem[] = [
        {
          name: label,
          type: 'bar',
          data: slicedData.map((item) => item.value),
          itemStyle: {
            color: (params: any) => {
              return colorPalette[params.dataIndex];
            },
          },
        },
      ];

      const options: echarts.EChartsOption = {
        grid: {
          left: '30%',
          right: '10%',
          bottom: '10%',
          top: '0%',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          show: false,
        },
        yAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            interval: 0,
          },
        },
        xAxis: {
          type: 'value',
        },
        series: series,
      };

      chartReference.setOption(options);
    };

    generateBarChart('pacific', this.pacificChart);
    generateBarChart('gulf', this.gulfChart);
  }

}
