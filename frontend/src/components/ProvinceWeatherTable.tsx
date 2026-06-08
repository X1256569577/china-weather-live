import type { ProvinceWeather } from "../types";

interface ProvinceWeatherTableProps {
  data: ProvinceWeather[];
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

function temperatureBadge(item: ProvinceWeather) {
  if (item.temperature === null) {
    return <span className="tag muted">暂无数据</span>;
  }
  if (item.temperature >= 35) {
    return <span className="tag hot">高温</span>;
  }
  if (item.temperature <= 0) {
    return <span className="tag cold">低温</span>;
  }
  return <span className="tag normal">正常</span>;
}

function displayValue(value: string | number | null): string {
  if (value === null || value === "") {
    return "暂无数据";
  }
  return String(value);
}

function temperatureRangeText(item: ProvinceWeather): string {
  if (typeof item.temperatureMin === "number" && typeof item.temperatureMax === "number") {
    return `${item.temperatureMin}--${item.temperatureMax}℃`;
  }
  return item.temperature === null ? "暂无数据" : `${item.temperature}℃`;
}

function ProvinceWeatherTable({ data }: ProvinceWeatherTableProps) {
  const sorted = sortByTemperature(data);

  return (
    <section className="table-section">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Province Ranking</p>
          <h2>省份气温表</h2>
        </div>
        <span className="table-note">按温度从高到低</span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>省份</th>
              <th>代表城市</th>
              <th>今日气温区间</th>
              <th>天气</th>
              <th>湿度</th>
              <th>风向</th>
              <th>风力</th>
              <th>数据发布时间</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.adcode}>
                <td>
                  <div className="province-cell">
                    <strong>{item.province}</strong>
                    {temperatureBadge(item)}
                  </div>
                </td>
                <td>{item.city}</td>
                <td className="temperature-cell">{temperatureRangeText(item)}</td>
                <td>{displayValue(item.weather)}</td>
                <td>{item.humidity ? `${item.humidity}%` : "暂无数据"}</td>
                <td>{displayValue(item.winddirection)}</td>
                <td>{displayValue(item.windpower)}</td>
                <td>{displayValue(item.reporttime)}</td>
              </tr>
            ))}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-table">
                  暂无数据
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProvinceWeatherTable;
