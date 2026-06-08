import type { ProvinceWeather } from "../types";

interface ProvinceHeatGridProps {
  data: ProvinceWeather[];
  warning?: string | null;
}

function sortByTemperature(data: ProvinceWeather[]): ProvinceWeather[] {
  return [...data].sort((a, b) => {
    if (a.temperature === null && b.temperature === null) {
      return a.province.localeCompare(b.province, "zh-CN");
    }
    if (a.temperature === null) {
      return 1;
    }
    if (b.temperature === null) {
      return -1;
    }
    return b.temperature - a.temperature;
  });
}

function heatClass(temperature: number | null): string {
  if (temperature === null) {
    return "heat-null";
  }
  if (temperature <= 0) {
    return "heat-cold";
  }
  if (temperature <= 15) {
    return "heat-cool";
  }
  if (temperature <= 25) {
    return "heat-comfort";
  }
  if (temperature <= 34) {
    return "heat-warm";
  }
  return "heat-hot";
}

function temperatureText(temperature: number | null): string {
  return temperature === null ? "暂无数据" : `${temperature}℃`;
}

function temperatureRangeText(item: ProvinceWeather): string {
  if (typeof item.temperatureMin === "number" && typeof item.temperatureMax === "number") {
    return `${item.temperatureMin}--${item.temperatureMax}℃`;
  }
  return temperatureText(item.temperature);
}

function ProvinceHeatGrid({ data, warning }: ProvinceHeatGridProps) {
  const sorted = sortByTemperature(data);

  return (
    <section className="heat-grid-section">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Fallback View</p>
          <h2>省份气温色块图</h2>
        </div>
        <span className="map-note">按温度从高到低</span>
      </div>

      <div className="fallback-note">
        <strong>未检测到 china.json，当前使用免费色块图模式</strong>
        {warning ? <span>{warning}</span> : null}
      </div>

      <div className="heat-grid">
        {sorted.map((item) => (
          <article className={`heat-tile ${heatClass(item.temperature)}`} key={item.adcode}>
            <div className="heat-tile-top">
              <strong>{item.province}</strong>
              <span>{item.city}</span>
            </div>
            <div className="heat-temperature">{temperatureRangeText(item)}</div>
            <div className="heat-weather">{item.weather || item.error || "暂无数据"}</div>
          </article>
        ))}
        {sorted.length === 0 ? <div className="heat-empty">暂无数据</div> : null}
      </div>
    </section>
  );
}

export default ProvinceHeatGrid;
