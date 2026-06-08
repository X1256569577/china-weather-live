export interface CapitalCoordinate {
  province: string;
  city: string;
  adcode: string;
  latitude: number;
  longitude: number;
}

export const CAPITAL_COORDINATES: CapitalCoordinate[] = [
  { province: "北京", city: "北京", adcode: "110000", latitude: 39.9042, longitude: 116.4074 },
  { province: "天津", city: "天津", adcode: "120000", latitude: 39.3434, longitude: 117.3616 },
  { province: "河北", city: "石家庄", adcode: "130100", latitude: 38.0428, longitude: 114.5149 },
  { province: "山西", city: "太原", adcode: "140100", latitude: 37.8706, longitude: 112.5489 },
  { province: "内蒙古", city: "呼和浩特", adcode: "150100", latitude: 40.8426, longitude: 111.7492 },
  { province: "辽宁", city: "沈阳", adcode: "210100", latitude: 41.8057, longitude: 123.4315 },
  { province: "吉林", city: "长春", adcode: "220100", latitude: 43.8171, longitude: 125.3235 },
  { province: "黑龙江", city: "哈尔滨", adcode: "230100", latitude: 45.8038, longitude: 126.5349 },
  { province: "上海", city: "上海", adcode: "310000", latitude: 31.2304, longitude: 121.4737 },
  { province: "江苏", city: "南京", adcode: "320100", latitude: 32.0603, longitude: 118.7969 },
  { province: "浙江", city: "杭州", adcode: "330100", latitude: 30.2741, longitude: 120.1551 },
  { province: "安徽", city: "合肥", adcode: "340100", latitude: 31.8206, longitude: 117.2272 },
  { province: "福建", city: "福州", adcode: "350100", latitude: 26.0745, longitude: 119.2965 },
  { province: "江西", city: "南昌", adcode: "360100", latitude: 28.6829, longitude: 115.8582 },
  { province: "山东", city: "济南", adcode: "370100", latitude: 36.6512, longitude: 117.1201 },
  { province: "河南", city: "郑州", adcode: "410100", latitude: 34.7466, longitude: 113.6254 },
  { province: "湖北", city: "武汉", adcode: "420100", latitude: 30.5928, longitude: 114.3055 },
  { province: "湖南", city: "长沙", adcode: "430100", latitude: 28.2282, longitude: 112.9388 },
  { province: "广东", city: "广州", adcode: "440100", latitude: 23.1291, longitude: 113.2644 },
  { province: "广西", city: "南宁", adcode: "450100", latitude: 22.817, longitude: 108.3669 },
  { province: "海南", city: "海口", adcode: "460100", latitude: 20.0444, longitude: 110.1999 },
  { province: "重庆", city: "重庆", adcode: "500000", latitude: 29.563, longitude: 106.5516 },
  { province: "四川", city: "成都", adcode: "510100", latitude: 30.5728, longitude: 104.0668 },
  { province: "贵州", city: "贵阳", adcode: "520100", latitude: 26.647, longitude: 106.6302 },
  { province: "云南", city: "昆明", adcode: "530100", latitude: 25.0389, longitude: 102.7183 },
  { province: "西藏", city: "拉萨", adcode: "540100", latitude: 29.652, longitude: 91.1721 },
  { province: "陕西", city: "西安", adcode: "610100", latitude: 34.3416, longitude: 108.9398 },
  { province: "甘肃", city: "兰州", adcode: "620100", latitude: 36.0611, longitude: 103.8343 },
  { province: "青海", city: "西宁", adcode: "630100", latitude: 36.6171, longitude: 101.7782 },
  { province: "宁夏", city: "银川", adcode: "640100", latitude: 38.4872, longitude: 106.2309 },
  { province: "新疆", city: "乌鲁木齐", adcode: "650100", latitude: 43.8256, longitude: 87.6168 },
];
