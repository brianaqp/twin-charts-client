// LITORAL DATASET
interface LitoralDataset {
  pacific: {
    items: LitoralItem[];
    total: number;
  };
  gulf: {
    items: LitoralItem[];
    total: number;
  };
}

type LitoralItem = {
  name: string;
  value: number;
};

// PORT DATASET

type PortDataset = KeyItem[];

type KeyItem = {
  name: string;
  ports: {
    name: string;
    value: number;
  }[];
  total: number;
};

interface ChartsConfiguration {
  availableYears: string[];
  availablePorts: string[];
}

enum DataStatus {
  Loading,
  Loaded,
  Error,
}

export {
  LitoralDataset,
  LitoralItem,
  PortDataset,
  KeyItem,
  ChartsConfiguration,
  DataStatus,
};
