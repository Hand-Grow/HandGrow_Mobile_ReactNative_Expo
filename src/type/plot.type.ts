export interface PlotResponse {
  id: string;
  name: string;
  location: string;
  area: number;
  areaUnit: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlotRequest {
  name: string;
  location: string;
  area: number;
  areaUnit: string;
}
