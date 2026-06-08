import time
from dataclasses import dataclass
from typing import Generic, TypeVar


T = TypeVar("T")


@dataclass
class CacheEntry(Generic[T]):
    value: T
    expires_at: float


class TTLCache(Generic[T]):
    def __init__(self) -> None:
        self._entry: CacheEntry[T] | None = None

    def get(self) -> T | None:
        if self._entry is None:
            return None
        if time.time() >= self._entry.expires_at:
            self._entry = None
            return None
        return self._entry.value

    def set(self, value: T, ttl_seconds: int) -> None:
        self._entry = CacheEntry(value=value, expires_at=time.time() + ttl_seconds)

    def clear(self) -> None:
        self._entry = None
