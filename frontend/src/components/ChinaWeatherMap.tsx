import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import ProvinceHeatGrid from "./ProvinceHeatGrid";
import type { ProvinceWeather } from "../types";

interface ChinaWeatherMapProps {
  data: ProvinceWeather[];
  loading: boolean;
}

type GeoJsonFeature = {
  properties?: {
    name?: string;
    [key: string]: unknown;
  };
};

type GeoJson = {
  features?: GeoJsonFeature[];
  [key: string]: unknown;
};

const MISSING_MAP_MESSAGE = "请放置中国地图 GeoJSON 到 public/maps/china.json";

const provinceAliases: Record<string, string[]> = {
  北京: ["北京", "北京市"],
  天津: ["天津", "天津市"],
  河北: ["河北", "河北省"],
  山西: ["山西", "山西省"],
  内蒙古: ["内蒙古", "内蒙古自治区"],
  辽宁: ["辽宁", "辽宁省"],
  吉林: ["吉林", "吉林省"],
  黑龙江: ["黑龙江", "黑龙江省"],
  上海: ["上海", "上海市"],
  江苏: ["江苏", "江苏省"],
  浙江: ["浙江", "浙江省"],
  安徽: ["安徽", "安徽省"],
  福建: ["福建", "福建省"],
  江西: ["江西", "江西省"],
  山东: ["山东", "山东省"],
  河南: ["河南", "河南省"],
  湖北: ["湖北", "湖北省"],
  湖南: ["湖南", "湖南省"],
  广东: ["广东", "广东省"],
  广西: ["广西", "广西壮族自治区"],
  海南: ["海南", "海南省"],
  重庆: ["重庆", "重庆市"],
  四川: ["四川", "四川省"],
  贵州: ["贵州", "贵州省"],
  云南: ["云南", "云南省"],
  西藏: ["西藏", "西藏自治区"],
  陕西: ["陕西", "陕西省"],
  甘肃: ["甘肃", "甘肃省"],
  青海: ["青海", "青海省"],
  宁夏: ["宁夏", "宁夏回族自治区"],
  新疆: ["新疆", "新疆维吾尔自治区"],
};

const aliasToProvince = Object.entries(provinceAliases).reduce<Record<string, string>>(
  (result, [province, aliases]) => {
    aliases.forEach((alias) => {
      result[alias] = province;
    });
    return result;
  },
  {},
);

function normalizeProvinceName(name?: string): string {
  if (!name) {
    return "";
  }
  if (aliasToProvince[name]) {
    return aliasToProvince[name];
  }
  return name
    .replace(/省$/u, "")
    .replace(/市$/u, "")
    .replace(/壮族自治区$/u, "")
    .replace(/回族自治区$/u, "")
    .replace(/维吾尔自治区$/u, "")
    .replace(/自治区$/u, "");
}

function valueText(value: string | number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined || value === "") {
    return "暂无数据";
  }
  return `${value}${suffix}`;
}

function temperatureRangeText(item?: ProvinceWeather): string {
  if (!item) {
    return "暂无数据";
  }
  if (typeof item.temperatureMin === "number" && typeof item.temperatureMax === "number") {
    return `${item.temperatureMin}--${item.temperatureMax}℃`;
  }
  return valueText(item.temperature, "℃");
}

function buildTooltip(item?: ProvinceWeather): string {
  if (!item) {
    return "暂无数据";
  }

  return `
    <div class="map-tooltip">
      <strong>${item.province}</strong>
      <div>代表城市：${item.city}</div>
      <div>当前气温：${valueText(item.temperature, "℃")}</div>
      <div>今日气温区间：${temperatureRangeText(item)}</div>
      <div>天气：${valueText(item.weather)}</div>
      <div>湿度：${valueText(item.humidity, "%")}</div>
      <div>风向：${valueText(item.winddirection)}</div>
      <div>风力：${valueText(item.windpower)}</div>
      <div>数据发布时间：${valueText(item.reporttime)}</div>
      <div>错误信息：${valueText(item.error)}</div>
    </div>
  `;
}

function ChinaWeatherMap({ data, loading }: ChinaWeatherMapProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [geoJson, setGeoJson] = useState<GeoJson | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const weatherByProvince = useMemo(() => {
    return data.reduce<Record<string, ProvinceWeather>>((result, item) => {
      result[item.province] = item;
      return result;
    }, {});
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch("/maps/china.json");
        if (!response.ok) {
          throw new Error(MISSING_MAP_MESSAGE);
        }
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("json")) {
          throw new Error(MISSING_MAP_MESSAGE);
        }
        const payload = (await response.json()) as GeoJson;
        if (!payload.features || !Array.isArray(payload.features)) {
          throw new Error("china.json 格式不正确，请检查 GeoJSON features");
        }
        if (!cancelled) {
          echarts.registerMap("china", payload as never);
          setGeoJson(payload);
          setMapError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setGeoJson(null);
          setMapError(err instanceof Error ? err.message : MISSING_MAP_MESSAGE);
        }
      }
    }

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !geoJson) {
      return;
    }

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;
    const mapData =
      geoJson.features?.map((feature) => {
        const mapName = feature.properties?.name || "";
        const provinceName = normalizeProvinceName(mapName);
        const weather = weatherByProvince[provinceName];

        return {
          name: mapName,
          value: weather?.temperature ?? undefined,
          provinceName,
          itemStyle: !weather || weather.temperature === null ? { areaColor: "#7d8494" } : undefined,
          raw: weather,
        };
      }) || [];

    const option: EChartsOption = {
      backgroundColor: "#f8fbff",
      tooltip: {
        trigger: "item",
        borderColor: "rgba(59, 130, 246, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        textStyle: { color: "#111827" },
        formatter: (params) => {
          const item = params as { data?: { raw?: ProvinceWeather } };
          return buildTooltip(item.data?.raw);
        },
      },
      visualMap: {
        min: -10,
        max: 40,
        left: 24,
        bottom: 20,
        text: ["40℃", "-10℃"],
        calculable: true,
        inRange: {
          color: ["#1536d8", "#2fa8ff", "#9fe87f", "#ffe75c", "#ff8b25", "#ef1d1d"],
        },
        outOfRange: {
          color: ["#d1d5db"],
        },
        textStyle: {
          color: "#111827",
          fontWeight: 800,
        },
      },
      series: [
        {
          name: "实时气温",
          type: "map",
          map: "china",
          roam: true,
          zoom: 1.12,
          scaleLimit: {
            min: 0.8,
            max: 8,
          },
          label: {
            show: true,
            color: "#111827",
            fontSize: 13,
            fontWeight: 900,
            textBorderColor: "#ffffff",
            textBorderWidth: 3,
            textShadowColor: "rgba(255,255,255,0.85)",
            textShadowBlur: 4,
            formatter: (params) => {
              const item = params as { data?: { raw?: ProvinceWeather; provinceName?: string } };
              const weather = item.data?.raw;
              const name = item.data?.provinceName || params.name;
              if (!weather || weather.temperature === null) {
                return `${name}\n暂无数据`;
              }
              return `${weather.province}\n${temperatureRangeText(weather)}`;
            },
          },
          emphasis: {
            label: {
              show: true,
              color: "#111827",
              fontWeight: "bold",
              textBorderColor: "#ffffff",
              textBorderWidth: 3,
            },
            itemStyle: {
              areaColor: "#fff176",
              borderColor: "#ffffff",
              borderWidth: 1.2,
            },
          },
          itemStyle: {
            borderColor: "rgba(255, 255, 255, 0.95)",
            borderWidth: 1.4,
            areaColor: "#cbd5e1",
            shadowColor: "rgba(30, 64, 175, 0.22)",
            shadowBlur: 8,
            shadowOffsetY: 4,
          },
          data: mapData,
        },
      ],
    };

    chart.setOption(option, true);
    chart.resize();

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [geoJson, weatherByProvince]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  if (mapError) {
    return <ProvinceHeatGrid data={data} warning={mapError} />;
  }

  return (
    <section className="map-section">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live Map</p>
          <h2>中国省级气温地图</h2>
        </div>
        <span className="map-note">可拖拽缩放</span>
      </div>

      <div className="map-stage">
        {loading ? <div className="loading-mask">加载天气数据...</div> : null}
        <div ref={chartRef} className="chart-container" />
      </div>
    </section>
  );
}

export default ChinaWeatherMap;
