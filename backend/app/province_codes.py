from typing import TypedDict


class ProvinceCode(TypedDict):
    province: str
    city: str
    adcode: str


PROVINCE_CODES: list[ProvinceCode] = [
    {"province": "北京", "city": "北京", "adcode": "110000"},
    {"province": "天津", "city": "天津", "adcode": "120000"},
    {"province": "河北", "city": "石家庄", "adcode": "130100"},
    {"province": "山西", "city": "太原", "adcode": "140100"},
    {"province": "内蒙古", "city": "呼和浩特", "adcode": "150100"},
    {"province": "辽宁", "city": "沈阳", "adcode": "210100"},
    {"province": "吉林", "city": "长春", "adcode": "220100"},
    {"province": "黑龙江", "city": "哈尔滨", "adcode": "230100"},
    {"province": "上海", "city": "上海", "adcode": "310000"},
    {"province": "江苏", "city": "南京", "adcode": "320100"},
    {"province": "浙江", "city": "杭州", "adcode": "330100"},
    {"province": "安徽", "city": "合肥", "adcode": "340100"},
    {"province": "福建", "city": "福州", "adcode": "350100"},
    {"province": "江西", "city": "南昌", "adcode": "360100"},
    {"province": "山东", "city": "济南", "adcode": "370100"},
    {"province": "河南", "city": "郑州", "adcode": "410100"},
    {"province": "湖北", "city": "武汉", "adcode": "420100"},
    {"province": "湖南", "city": "长沙", "adcode": "430100"},
    {"province": "广东", "city": "广州", "adcode": "440100"},
    {"province": "广西", "city": "南宁", "adcode": "450100"},
    {"province": "海南", "city": "海口", "adcode": "460100"},
    {"province": "重庆", "city": "重庆", "adcode": "500000"},
    {"province": "四川", "city": "成都", "adcode": "510100"},
    {"province": "贵州", "city": "贵阳", "adcode": "520100"},
    {"province": "云南", "city": "昆明", "adcode": "530100"},
    {"province": "西藏", "city": "拉萨", "adcode": "540100"},
    {"province": "陕西", "city": "西安", "adcode": "610100"},
    {"province": "甘肃", "city": "兰州", "adcode": "620100"},
    {"province": "青海", "city": "西宁", "adcode": "630100"},
    {"province": "宁夏", "city": "银川", "adcode": "640100"},
    {"province": "新疆", "city": "乌鲁木齐", "adcode": "650100"},
]
