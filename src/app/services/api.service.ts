import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { ApiResponse, InitialData } from '../interfaces/api-response';
import {
  ChartsConfiguration,
  LitoralDataset,
  PortDataset,
} from '../interfaces/data';

Injectable({
  providedIn: 'root',
});

export class ApiService {
  private api = environment.api + '/charts';
  private http = inject(HttpClient);

  getData(category: string) {
    return this.http.get<ApiResponse<InitialData>>(`${this.api}/${category}`);
  }

  getDataByYear(category: string, year: string) {
    return this.http.get<ApiResponse<InitialData>>(
      `${this.api}/${category}/${year}`
    );
  }
}
