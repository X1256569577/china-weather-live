import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProvinceTemperatures } from "./api";
import HeaderBar from "./components/HeaderBar";
import ChinaWeatherMap from "./components/ChinaWeatherMap";
import ProvinceWeatherTable from "./components/ProvinceWeatherTable";
import StatusCards from "./components/StatusCards";
import type { ProvinceTemperatureResponse } from "./types";

const DEFAULT_REFRESH_SECONDS = 600;

function App() {
  const [weather, setWeather] = useState<ProvinceTemperatureResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(DEFAULT_REFRESH_SECONDS);

  const refreshSeconds = weather?.cacheSeconds || DEFAULT_REFRESH_SECONDS;

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProvinceTemperatures();
      setWeather(result);
      setCountdown(result.cacheSeconds || DEFAULT_REFRESH_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "天气数据请求失败");
      setCountdown(refreshSeconds);
    } finally {
      setLoading(false);
    }
  }, [refreshSeconds]);

  useEffect(() => {
    void loadWeather();
  }, [loadWeather]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0 && !loading) {
      void loadWeather();
    }
  }, [countdown, loading, loadWeather]);

  const headerMeta = useMemo(
    () => ({
      basis: weather?.basis || "按省会/首府/直辖市当前天气模型数据统计",
      source: weather?.source || "open-meteo",
      updatedAt: weather?.updatedAt || "未更新",
      refreshSeconds,
    }),
    [refreshSeconds, weather],
  );

  return (
    <main className="app-shell">
      <HeaderBar
        title="全国省级实时气温观测"
        basis={headerMeta.basis}
        source={headerMeta.source}
        updatedAt={headerMeta.updatedAt}
        refreshSeconds={headerMeta.refreshSeconds}
        countdown={countdown}
        loading={loading}
        error={error}
        onRefresh={loadWeather}
      />

      <StatusCards data={weather?.data || []} />

      <section className="dashboard-grid">
        <div className="panel map-panel">
          <ChinaWeatherMap data={weather?.data || []} loading={loading && !weather} />
        </div>
        <div className="panel table-panel">
          <ProvinceWeatherTable data={weather?.data || []} />
        </div>
      </section>

      <p className="source-disclaimer">
        数据来源：Open-Meteo 免费天气 API，当前天气基于天气模型数据，仅供参考。
      </p>
    </main>
  );
}

export default App;
