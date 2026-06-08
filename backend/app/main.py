import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .cache import TTLCache
from .config import get_settings
from .schemas import HealthResponse, ProvinceTemperatureResponse
from .weather_provider import get_province_temperatures


settings = get_settings()
app = FastAPI(title="china-weather-live-backend")
weather_cache: TTLCache[ProvinceTemperatureResponse] = TTLCache()
cache_lock = asyncio.Lock()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", service="china-weather-live-backend")


@app.get(
    "/api/province-temperatures",
    response_model=ProvinceTemperatureResponse,
    response_model_by_alias=True,
)
async def province_temperatures() -> ProvinceTemperatureResponse:
    cached = weather_cache.get()
    if cached is not None:
        return cached

    async with cache_lock:
        cached = weather_cache.get()
        if cached is not None:
            return cached

        result = await get_province_temperatures(settings)
        weather_cache.set(result, settings.cache_seconds)
        return result
