# AGENTS.md

## 项目概述

`china-weather-live` 是一个全国省级实时气温观测大屏。后端使用 FastAPI 调用 Open-Meteo 免费天气 API，按省会/首府/直辖市当前天气模型数据统计中国内地 31 个省级行政区；前端使用 React、Vite、TypeScript 和 Apache ECharts 展示地图、fallback 色块图、统计卡片和表格。

## 后端检查命令

```bash
cd backend
python -m compileall app
```

## 前端检查命令

```bash
cd frontend
npm run build
```

## 代码约束

- 项目默认使用 Open-Meteo，无需 API Key。
- 不允许把任何真实密钥写入前端。
- 不允许把真实 `.env` 提交。
- 不允许把未知授权的地图 GeoJSON 硬编码到代码。
- 后端天气请求失败不能导致整体接口结构丢失，仍需返回 31 个省份。
- 前端请求失败不能白屏。
- 没有 `frontend/public/maps/china.json` 时必须显示省份气温色块图 fallback。

## 修改后必须运行

- backend: `python -m compileall app`
- frontend: `npm run build`
