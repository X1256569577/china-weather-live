# 地图文件说明

当前目录的 `china.json` 是中国省级边界 GeoJSON，用于 ECharts 中国地图模式。

文件路径：

```text
frontend/public/maps/china.json
```

当前文件来源：

```text
https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
```

这是 DataV.GeoAtlas 的全国包含子区域 GeoJSON。请在正式或商业使用前自行确认数据来源授权和使用限制。

如果删除该文件，前端不会白屏，会自动显示省份气温色块图 fallback，并提示：

```text
未检测到 china.json，当前使用免费色块图模式
```
