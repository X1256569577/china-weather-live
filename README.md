# china-weather-live

全国省级实时气温观测大屏。后端使用 Open-Meteo 免费天气 API，一次请求中国内地 31 个省会/首府/直辖市当前天气模型数据；前端使用 React、Vite、TypeScript 和 Apache ECharts 展示中国地图、fallback 色块图、统计卡片和省份天气表格。

## 功能列表

- 中国内地 31 个省级行政区代表城市当前气温展示
- 免费无 Key 方案：Open-Meteo 不需要注册，不需要 API Key
- 统计卡片：有效省份、暂无数据、最高温、最低温、平均气温
- 有 `frontend/public/maps/china.json` 时显示 ECharts 中国地图
- 没有 `china.json` 时自动显示省份气温色块图，不白屏
- 省份天气表格，按气温从高到低排序
- 自动刷新和手动刷新
- 后端 TTL 内存缓存，默认 600 秒
- Docker Compose 一键启动

## 数据口径

按省会/首府/直辖市当前天气模型数据统计，不代表全省平均温度。

数据来源：Open-Meteo 免费天气 API，当前天气基于天气模型数据，仅供参考。免费版适合个人、学习、演示和非商业场景；正式商业使用前请自行确认 Open-Meteo 最新服务条款和调用限制。

## 配置 .env

本项目默认不需要 API Key。可以在项目根目录复制示例文件：

```bash
cp .env.example .env
```

Windows PowerShell 可以使用：

```powershell
Copy-Item .env.example .env
```

默认配置：

```env
CACHE_SECONDS=600
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
WEATHER_PROVIDER=open-meteo
```

成功标志：`.env` 文件存在，或即使没有 `.env`，后端也能使用默认配置启动。

## 本地运行后端

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Windows PowerShell 激活虚拟环境：

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

成功标志：

- 浏览器访问 http://localhost:8000/api/health 返回 `status: ok`
- 浏览器访问 http://localhost:8000/api/province-temperatures 返回 31 条省份数据
- 返回字段 `source` 为 `open-meteo`
- 多数省份 `temperature` 为真实数值

## 本地运行前端

```bash
cd frontend
npm install
npm run dev
```

成功标志：浏览器访问 http://localhost:5173 能看到大屏页面。

## 公网访问：电脑不用一直开

当前前端默认可以直接调用 Open-Meteo 免费天气 API，不依赖本地后端，不需要 API Key。因此最简单的公网方案是静态托管：

```bash
cd frontend
npm install
npm run build
```

构建完成后，把 `frontend/dist` 上传到任意静态网站托管平台：

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

成功标志：平台生成一个公网网址，别人打开这个网址就能看到天气大屏；你的电脑关机后也不影响访问。

如果使用 Cloudflare Pages：

1. 注册或登录 Cloudflare。
2. 新建 Pages 项目。
3. 上传 `frontend/dist`，或连接 Git 仓库。
4. 构建命令填写 `npm run build`。
5. 构建目录填写 `frontend/dist`。

如果只上传静态文件，直接上传 `frontend/dist` 目录内容即可。

说明：公网静态版由浏览器直接请求 Open-Meteo，后端 `backend/` 仍保留给本地开发、Docker 或需要服务端缓存的部署使用。

## Docker Compose 一键启动

在项目根目录运行：

```bash
docker compose up --build
```

成功标志：

- 前端：http://localhost:5173
- 后端健康检查：http://localhost:8000/api/health

## 地图模式和色块图模式

本项目不内置未知授权来源的地图 GeoJSON。

如需地图模式，请自行准备有授权的中国地图 GeoJSON，并放到：

```text
frontend/public/maps/china.json
```

没有该文件时，前端会自动显示“省份气温色块图”，并提示：

```text
未检测到 china.json，当前使用免费色块图模式
```

成功标志：

- 没有 `china.json`：页面显示省份气温色块图
- 有 `china.json`：页面显示可拖拽缩放的中国地图

## 常见问题

### 地图不显示

检查 `frontend/public/maps/china.json` 是否存在，文件名必须是 `china.json`。没有地图文件时不是故障，页面会自动进入色块图模式。

### 是否需要 API Key

不需要。本项目默认使用 Open-Meteo 免费天气 API，不需要注册，不需要 Key。

### 某些省份暂无数据

可能是 Open-Meteo 临时请求失败、网络不可用或模型数据暂缺。后端会保持 31 个省份的返回结构，单项失败不会让前端白屏。

### 跨域问题

本地开发前端默认访问 `http://localhost:8000`。如需换前端地址，请在 `.env` 中调整：

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Docker 环境中前端通过 Nginx 反向代理 `/api` 到后端，一般不需要配置 `VITE_API_BASE_URL`。

### 第三方天气 API 调用限制

Open-Meteo 免费接口适合个人、学习、演示和非商业场景。本项目默认缓存 600 秒，避免频繁请求。正式使用前请自行确认 Open-Meteo 最新调用限制。

### 省份名称不匹配

后端返回简称，例如“河北”；地图 GeoJSON 可能使用“河北省”。前端已做名称兼容映射。如果仍然不匹配，请检查 GeoJSON 中 `features[].properties.name` 的字段值。

## 验证命令

后端：

```bash
cd backend
python -m compileall app
```

前端：

```bash
cd frontend
npm run build
```
