from datetime import datetime
from typing import Any

import httpx

from .capital_coordinates import CAPITAL_COORDINATES, CapitalCoordinate
from .config import Settings
from .schemas import ProvinceTemperatureResponse, ProvinceWeather


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
BASIS = "按省会/首府/直辖市当前天气模型数据统计"
CURRENT_FIELDS = ",".join(
    [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
    ]
)
DAILY_FIELDS = "temperature_2m_max,temperature_2m_min"


WEATHER_CODE_TEXT: dict[int, str] = {
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
}


def current_time_text() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def weather_code_to_text(code: object) -> str:
    try:
        numeric_code = int(code)
    except (TypeError, ValueError):
        return "未知天气"
    return WEATHER_CODE_TEXT.get(numeric_code, "未知天气")


def degree_to_direction(degree: object) -> str | None:
    if degree is None:
        return None
    try:
        value = float(degree) % 360
    except (TypeError, ValueError):
        return None

    if value < 22.5 or value >= 337.5:
        return "北风"
    if value < 67.5:
        return "东北风"
    if value < 112.5:
        return "东风"
    if value < 157.5:
        return "东南风"
    if value < 202.5:
        return "南风"
    if value < 247.5:
        return "西南风"
    if value < 292.5:
        return "西风"
    return "西北风"


def parse_temperature(value: object) -> int | float | None:
    if value in (None, ""):
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number.is_integer():
        return int(number)
    return round(number, 1)


def format_wind_speed(value: object) -> str | None:
    if value in (None, ""):
        return None
    try:
        return f"{float(value):.1f} km/h"
    except (TypeError, ValueError):
        return None


def current_from_location(location: dict[str, Any]) -> dict[str, Any]:
    current = location.get("current")
    return current if isinstance(current, dict) else {}


def daily_from_location(location: dict[str, Any]) -> dict[str, Any]:
    daily = location.get("daily")
    return daily if isinstance(daily, dict) else {}


def build_error_weather(item: CapitalCoordinate, error: str) -> ProvinceWeather:
    return ProvinceWeather(
        province=item["province"],
        city=item["city"],
        adcode=item["adcode"],
        error=error,
    )


def first_daily_value(daily: dict[str, Any], key: str) -> int | float | None:
    values = daily.get(key)
    if isinstance(values, list) and values:
      return parse_temperature(values[0])
    return parse_temperature(values)


def build_weather(item: CapitalCoordinate, current: dict[str, Any], daily: dict[str, Any]) -> ProvinceWeather:
    temperature = parse_temperature(current.get("temperature_2m"))
    humidity = current.get("relative_humidity_2m")

    return ProvinceWeather(
        province=item["province"],
        city=item["city"],
        adcode=item["adcode"],
        temperature=temperature,
        temperature_min=first_daily_value(daily, "temperature_2m_min"),
        temperature_max=first_daily_value(daily, "temperature_2m_max"),
        weather=weather_code_to_text(current.get("weather_code")),
        humidity=None if humidity is None else str(humidity),
        winddirection=degree_to_direction(current.get("wind_direction_10m")),
        windpower=format_wind_speed(current.get("wind_speed_10m")),
        reporttime=current.get("time"),
        error=None,
    )


def normalize_locations(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if isinstance(payload, dict):
        return [payload]
    return []


async def fetch_open_meteo_locations() -> list[dict[str, Any]]:
    latitudes = ",".join(str(item["latitude"]) for item in CAPITAL_COORDINATES)
    longitudes = ",".join(str(item["longitude"]) for item in CAPITAL_COORDINATES)
    timeout = httpx.Timeout(20.0, connect=10.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(
            OPEN_METEO_URL,
            params={
                "latitude": latitudes,
                "longitude": longitudes,
                "current": CURRENT_FIELDS,
                "daily": DAILY_FIELDS,
                "timezone": "Asia/Shanghai",
                "forecast_days": 1,
            },
        )
        response.raise_for_status()
        return normalize_locations(response.json())


async def get_province_temperatures(settings: Settings) -> ProvinceTemperatureResponse:
    try:
        locations = await fetch_open_meteo_locations()
        if len(locations) != len(CAPITAL_COORDINATES):
            error = f"Open-Meteo returned {len(locations)} locations, expected {len(CAPITAL_COORDINATES)}"
            data = [build_error_weather(item, error) for item in CAPITAL_COORDINATES]
        else:
            data = [
                build_weather(item, current_from_location(location), daily_from_location(location))
                for item, location in zip(CAPITAL_COORDINATES, locations, strict=True)
            ]
    except httpx.HTTPStatusError as exc:
        data = [build_error_weather(item, f"Open-Meteo HTTP {exc.response.status_code}") for item in CAPITAL_COORDINATES]
    except httpx.RequestError as exc:
        data = [build_error_weather(item, f"Open-Meteo request error: {exc.__class__.__name__}") for item in CAPITAL_COORDINATES]
    except ValueError:
        data = [build_error_weather(item, "Open-Meteo returned invalid JSON") for item in CAPITAL_COORDINATES]

    return ProvinceTemperatureResponse(
        updated_at=current_time_text(),
        basis=BASIS,
        source="open-meteo",
        cache_seconds=settings.cache_seconds,
        data=data,
    )
