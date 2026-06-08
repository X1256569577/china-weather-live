export interface ProvinceWeather {
  province: string;
  city: string;
  adcode: string;
  temperature: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  weather: string | null;
  humidity: string | null;
  winddirection: string | null;
  windpower: string | null;
  reporttime: string | null;
  error: string | null;
}

export interface ProvinceTemperatureResponse {
  updatedAt: string;
  basis: string;
  source: string;
  cacheSeconds: number;
  data: ProvinceWeather[];
}
