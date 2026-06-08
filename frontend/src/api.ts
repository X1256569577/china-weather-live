import type { ProvinceTemperatureResponse } from "./types";
import { fetchOpenMeteoTemperatures } from "./openMeteo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchProvinceTemperatures(): Promise<ProvinceTemperatureResponse> {
  if (!API_BASE_URL) {
    return fetchOpenMeteoTemperatures();
  }

  const response = await fetch(`${API_BASE_URL}/api/province-temperatures`);

  if (!response.ok) {
    throw new Error(`天气接口请求失败：HTTP ${response.status}`);
  }

  return response.json();
}
