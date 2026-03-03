import apiClient from "./apiClient";
import { CreatePlotRequest, PlotResponse } from "../type/plot.type";

const PLOT_BASE_URL = "/api/v1/plots";

export const plotApi = {
  getMyPlots: async (): Promise<PlotResponse[]> => {
    const response = await apiClient.get<PlotResponse[]>(PLOT_BASE_URL);
    return response.data;
  },

  createPlot: async (request: CreatePlotRequest): Promise<PlotResponse> => {
    const response = await apiClient.post<PlotResponse>(PLOT_BASE_URL, request);
    return response.data;
  },
};
