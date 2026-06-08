from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    service: str


class ProvinceWeather(BaseModel):
    province: str
    city: str
    adcode: str
    temperature: int | float | None = None
    temperature_min: int | float | None = Field(default=None, serialization_alias="temperatureMin")
    temperature_max: int | float | None = Field(default=None, serialization_alias="temperatureMax")
    weather: str | None = None
    humidity: str | None = None
    winddirection: str | None = None
    windpower: str | None = None
    reporttime: str | None = None
    error: str | None = None


class ProvinceTemperatureResponse(BaseModel):
    updated_at: str = Field(serialization_alias="updatedAt")
    basis: str
    source: str
    cache_seconds: int = Field(serialization_alias="cacheSeconds")
    data: list[ProvinceWeather]
