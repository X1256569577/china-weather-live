import type { ProvinceWeather } from "../types";

interface StatusCardsProps {
  data: ProvinceWeather[];
}

function formatTemperature(value: number | null | undefined): string {
  return typeof value === "number" ? `${value.toFixed(value % 1 === 0 ? 0 : 1)}℃` : "暂无数据";
}

function formatRange(item: ProvinceWeather | undefined): string {
  if (!item) {
    return "暂无数据";
  }
  if (typeof item.temperatureMin === "number" && typeof item.temperatureMax === "number") {
    return `${item.temperatureMin}--${item.temperatureMax}℃`;
  }
  return formatTemperature(item.temperature);
}

function StatusCards({ data }: StatusCardsProps) {
  const valid = data.filter((item) => typeof item.temperature === "number");
  const validMax = data.filter((item) => typeof item.temperatureMax === "number");
  const validMin = data.filter((item) => typeof item.temperatureMin === "number");
  const missingCount = data.length - valid.length;
  const highest = [...validMax].sort((a, b) => (b.temperatureMax ?? -Infinity) - (a.temperatureMax ?? -Infinity))[0];
  const lowest = [...validMin].sort((a, b) => (a.temperatureMin ?? Infinity) - (b.temperatureMin ?? Infinity))[0];
  const average =
    valid.length > 0
      ? valid.reduce((sum, item) => sum + (item.temperature ?? 0), 0) / valid.length
      : null;

  return (
    <section className="status-grid">
      <article className="status-card">
        <span className="status-label">有效省份</span>
        <strong>{valid.length}</strong>
        <span className="status-foot">共 {data.length || 31} 个省级行政区</span>
      </article>
      <article className="status-card">
        <span className="status-label">暂无数据</span>
        <strong>{missingCount || 0}</strong>
        <span className="status-foot">接口失败或模型暂无数据</span>
      </article>
      <article className="status-card hot">
        <span className="status-label">今日最高温</span>
        <strong>{highest ? `${highest.province} ${formatRange(highest)}` : "暂无数据"}</strong>
        <span className="status-foot">{highest?.city || "等待数据"}</span>
      </article>
      <article className="status-card cold">
        <span className="status-label">今日最低温</span>
        <strong>{lowest ? `${lowest.province} ${formatRange(lowest)}` : "暂无数据"}</strong>
        <span className="status-foot">{lowest?.city || "等待数据"}</span>
      </article>
      <article className="status-card">
        <span className="status-label">平均气温</span>
        <strong>{average === null ? "暂无数据" : `${average.toFixed(1)}℃`}</strong>
        <span className="status-foot">全国省会/首府口径</span>
      </article>
    </section>
  );
}

export default StatusCards;
