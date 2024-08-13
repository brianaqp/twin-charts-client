import { ChartsConfiguration, LitoralDataset, PortDataset } from "./data";

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface InitialData {
  configuration: ChartsConfiguration;
  portData: PortDataset;
  litoralData: LitoralDataset;
}

export { ApiResponse, InitialData };