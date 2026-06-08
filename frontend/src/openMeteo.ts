import { CAPITAL_COORDINATES } from "./capitalCoordinates";
import type { ProvinceTemperatureResponse, ProvinceWeather } from "./types";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const CURRENT_FIELDS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
].join(",");
const DAILY_FIELDS = "temperature_2m_max,temperature_2m_min";

const WEATHER_CODE_TEXT: Record<number, string> = {
  0: "晴",
  1: "大部晴朗",
  2: "局部多云",
  3: "阴",
  45: "雾",
  48: "雾凇",
  51: "小毛毛雨",
  53: "中等毛毛雨",
  55: "大毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  80: "小阵雨",
  81: "中阵雨",
  82: "强阵雨",
  95: "雷暴",
  96: "雷暴伴小冰雹",
  99: "雷暴伴大冰雹",
};

interface OpenMeteoLocation {
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

function nowText(): string {
  const date = new Date();
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
}

function weatherCodeToText(code: number | undefined): string {
  if (typeof code !== "number") {
    return "未知天气";
  }
  return WEATHER_CODE_TEXT[code] || "未知天气";
}

function windDirection(degree: number | undefined): string | null {
  if (typeof degree !== "number") {
    return null;
  }
  const value = ((degree % 360) + 360) % 360;
  if (value < 22.5 || value >= 337.5) return "北风";
  if (value < 67.5) return "东北风";
  if (value < 112.5) return "东风";
  if (value < 157.5) return "东南风";
  if (value < 202.5) return "南风";
  if (value < 247.5) return "西南风";
  if (value < 292.5) return "西风";
  return "西北风";
}

function roundTemperature(value: number | undefined): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return Number.isInteger(value) ? value : Number(value.toFixed(1));
}

function normalizeLocations(payload: unknown): OpenMeteoLocation[] {
  if (Array.isArray(payload)) {
    return payload as OpenMeteoLocation[];
  }
  if (payload && typeof payload === "object") {
    return [payload as OpenMeteoLocation];
  }
  return [];
}

function buildWeather(location: OpenMeteoLocation, index: number): ProvinceWeather {
  const meta = CAPITAL_COORDINATES[index];
  const current = location.current || {};
  const daily = location.daily || {};
  return {
    province: meta.province,
    city: meta.city,
    adcode: meta.adcode,
    temperature: roundTemperature(current.temperature_2m),
    temperatureMin: roundTemperature(daily.temperature_2m_min?.[0]),
    temperatureMax: roundTemperature(daily.temperature_2m_max?.[0]),
    weather: weatherCodeToText(current.weather_code),
    humidity:
      typeof current.relative_humidity_2m === "number" ? String(current.relative_humidity_2m) : null,
    winddirection: windDirection(current.wind_direction_10m),
    windpower:
      typeof current.wind_speed_10m === "number" ? `${current.wind_speed_10m.toFixed(1)} km/h` : null,
    reporttime: current.time || null,
    error: null,
  };
}

export async function fetchOpenMeteoTemperatures(): Promise<ProvinceTemperatureResponse> {
  const params = new URLSearchParams({
    latitude: CAPITAL_COORDINATES.map((item) => item.latitude).join(","),
    longitude: CAPITAL_COORDINATES.map((item) => item.longitude).join(","),
    current: CURRENT_FIELDS,
    daily: DAILY_FIELDS,
    timezone: "Asia/Shanghai",
    forecast_days: "1",
  });

  const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open-Meteo 请求失败：HTTP ${response.status}`);
  }

  const locations = normalizeLocations(await response.json());
  if (locations.length !== CAPITAL_COORDINATES.length) {
    throw new Error(`Open-Meteo 返回 ${locations.length} 个地点，预期 ${CAPITAL_COORDINATES.length} 个`);
  }

  return {
    updatedAt: nowText(),
    basis: "按省会/首府/直辖市当前天气模型数据统计",
    source: "open-meteo",
    cacheSeconds: 600,
    data: locations.map(buildWeather),
  };
}
