interface HeaderBarProps {
  title: string;
  basis: string;
  source: string;
  updatedAt: string;
  refreshSeconds: number;
  countdown: number;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${rest.toString().padStart(2, "0")}`;
}

function HeaderBar({
  title,
  basis,
  source,
  updatedAt,
  refreshSeconds,
  countdown,
  loading,
  error,
  onRefresh,
}: HeaderBarProps) {
  return (
    <header className="header-bar">
      <div className="title-block">
        <p className="eyebrow">China Weather Live</p>
        <h1>{title}</h1>
        <div className="meta-line">
          <span>{basis}</span>
          <span>数据源：{source}</span>
          <span>Open-Meteo 免费天气 API，模型数据仅供参考</span>
          <span>后端更新时间：{updatedAt}</span>
          <span>自动刷新：{Math.round(refreshSeconds / 60)} 分钟</span>
          <span>下一次刷新：{formatSeconds(countdown)}</span>
        </div>
      </div>

      <div className="header-actions">
        {error ? <div className="error-banner">{error}</div> : null}
        <button className="refresh-button" type="button" disabled={loading} onClick={onRefresh}>
          {loading ? "刷新中..." : "立即刷新"}
        </button>
      </div>
    </header>
  );
}

export default HeaderBar;
