import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Component, inject, OnInit } from '@angular/core';
import { PerLitoralComponent } from './sections/per-litoral/per-litoral.component';
import {
  ChartsConfiguration,
  DataStatus,
  LitoralDataset,
  PortDataset,
} from '../../interfaces/data';
import { PerPortComponent } from './sections/per-port/per-port.component';
import { PlotCategories, SectionsAvailable } from '../../interfaces/charts';
import { AuthService } from '../../services/auth.service';

/**
 * Componente dedicado a manejar las gráficas de la aplicación.
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PerLitoralComponent, PerPortComponent],
  providers: [ApiService],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent implements OnInit {
  // Services
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  // --- Variables
  // Configuration
  chartsConfig: ChartsConfiguration = {
    availablePorts: [],
    availableYears: [],
  };

  // Categories. Affect how data is queried.
  categories: PlotCategories = [
    { name: 'Cargo', propertyName: 'cargo' },
  ];
  categorySelected = this.categories[0];

  // Chart options
  yearSelected: string = '';
  sectionSelected: SectionsAvailable = 'per-litoral';

  // Data
  litoralData!: LitoralDataset;
  portPackage: { ports: string[]; data: PortDataset } = { ports: [], data: [] };

  // Data status linked to API response
  DataStatus = DataStatus;
  dataState: DataStatus = DataStatus.Loading;

  // Data vault from other years
  dataVault: {
    year: string;
    portData: PortDataset;
    litoralData: LitoralDataset;
  }[] = [];

  // --- Lifecycle methods
  ngOnInit(): void {
    this.start();
  }

  // --- DOM methods
  onSectionSelect(category: 'per-litoral' | 'per-port') {
    this.sectionSelected = category;
  }

  onYearSelected(year: string) {
    this.yearSelected = year;
    this.reloadData();
  }

  // --- API methods
  /**
   * Metodo que inicializa la aplicación trayendo los datos del api.
   * Primero obtiene los años disponibles, selecciona el primer año,
   * y luego obtiene los datos del puerto y del litoral para ese año y categoría seleccionada.
   */
  start() {
    this.apiService.getData(this.categorySelected.propertyName).subscribe(
      (res) => {
        // Set configuration
        this.chartsConfig = res.data.configuration;
        this.yearSelected = this.chartsConfig.availableYears[0];
        
        // Set data packages
        this.litoralData = res.data.litoralData;
        this.portPackage = {
          data: res.data.portData,
          ports: this.chartsConfig.availablePorts,
        };

        this.onDataStatusChange(DataStatus.Loaded);

        // Store data in vault
        this.dataVault.push({
          year: this.yearSelected,
          portData: this.portPackage.data,
          litoralData: this.litoralData,
        });

        // Fetch data for remaining years
        this.fetchDataForYear();

        // Refresh auth token
        this.authService.refreshToken();
      },
      (error) => {
        this.onDataStatusChange(DataStatus.Error);
      });
  }

  /**
   * Metodo que se encarga de traer los datos del año seleccionado.
   * @param year
   */
  async fetchDataForYear() {
    // 1. Check if there is more years
    const reaminingYears = this.chartsConfig.availableYears.filter(
      (y) => y !== this.yearSelected
    );
    if (reaminingYears.length < 1) {
      // No more years to fetch
      return;
    }
    // 2. Fetch data for remaining years
    for (const y of reaminingYears) {
      // 2.1 Fetch data
      this.apiService.getDataByYear(this.categorySelected.propertyName, y).subscribe(
        (res) => {
          console.log('Data fetched for year', y, res);
          // 2.2 Store data in vault
          this.dataVault.push({
            year: y,
            portData: res.data.portData,
            litoralData: res.data.litoralData,
          });
        },
        (error) => {
          // No need to do anything
        }
      );
    }
  }

  /**
   * Metodo que se encarga de recargar los datos de la aplicación.
   * @returns 
   */
  reloadData() {
    // Check if data is already in vault
    const dataFromVault = this.dataVault.find(
      (d) => d.year === this.yearSelected
    );

    // Validation
    if (!dataFromVault) {
      // Show some error
      return;
    }

    // Change data for port section
    this.portPackage = {
      data: dataFromVault.portData,
      ports: this.chartsConfig.availablePorts,
    };

    // Change data for litoral section
    this.litoralData = dataFromVault.litoralData;
  }

  // Data Status methods
  onDataStatusChange(status: DataStatus) {
    this.dataState = status;
    // if status good, apply to main container the class loaded
    if (status === DataStatus.Loaded) {
      setTimeout(() => {
        document.getElementById('main-container')?.classList.add('loaded');
      }, 1);
    }
  }
}
