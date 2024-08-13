type SectionsAvailable = 'per-litoral' | 'per-port';

type PlotCategories = {
  name: string;
  propertyName: 'cargo';
}[]

type SeriesItem = {
  name: string;
  type: 'bar';
  data: number[] | any;
  itemStyle?: {
    color?: any;
  };
};

type SeriesItemPie = {
  value: number;
  name: string;
  itemStyle: {
    color: string;
  };
  label: {
    fontSize: number;
    formatter: string;
  };
};

type PortStatusItem = {
  name: string;
  status: boolean;
};

export { SectionsAvailable, PlotCategories, SeriesItem, PortStatusItem, SeriesItemPie };
