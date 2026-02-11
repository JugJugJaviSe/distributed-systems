from threading import Lock
from typing import Dict

class QuizCache:
    _lock = Lock()
    _cache: Dict[str, Dict] = {}  # key: Cache type (catalog, approved, pending), value: {"data": ..., "expires_at": ...}

    @classmethod
    def get(cls, key: str):
        with cls._lock:
            cached = cls._cache.get(key)
            return cached["data"] if cached else None


    @classmethod
    def set(cls, key: str, data):
        with cls._lock:
            cls._cache[key] = {
                "data": data,
            }


    @classmethod
    def clear(cls):
        with cls._lock:
            cls._cache.clear()