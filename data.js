/**
 * 2026/12 沖繩 5天4夜自駕行程資料庫
 * 行程名稱：2026/12沖繩
 * 行程來源：去趣 ChicTrip (https://chictrip-share.app.link/SOyJSS7fi6b)
 */

const TRIP_METADATA = {
  id: "okinawa-2026-12",
  title: "2026/12 沖繩冬日海風自由行",
  subTitle: "OKINAWA 5-DAY ROAD TRIP & GOURMET TOUR",
  originalTitle: "2026/12沖繩",
  dateRange: "2026/12/12 (六) - 2026/12/16 (三)",
  daysCount: 5,
  nightsCount: 4,
  departureDate: "2026-12-12T11:00:00+09:00",
  chictripUrl: "https://chictrip-share.app.link/SOyJSS7fi6b",
  baseLocation: {
    name: "Ocean Tree (海之樹)",
    description: "旅程核心下榻別墅/公寓，位於沖繩南部，臨海環境優美，做為每日出發與歸營的安心港灣。",
    lat: 26.1360,
    lng: 127.6780
  },
  stats: {
    totalScheduleEvents: 40,
    uniqueSpots: 31,
    totalShopping: 12,
    totalFood: 8,
    totalAttraction: 7,
    totalTransitHotel: 13
  },
  themeHighlights: [
    { title: "美式好市多 × 週六美國村煙火", icon: "🎆", desc: "初訪南城全新好市多大採購，夜晚直奔北谷美國村欣賞週六限定璀璨海濱煙火秀。" },
    { title: "南部海味 × 水族沉浸 × 漁民食堂", icon: "🐟", desc: "糸滿魚市場現剖生魚片大餐、新世代DMM光影水族館、排隊名店奶油香煎魚。" },
    { title: "市區免稅 × 雙神社參拜 × 瀨長島夕陽", icon: "⛩️", desc: "波上宮海崖絕景、奧武山護國神社求平安、DFS免稅名品、排隊文青沖繩麵EIBUN與小希臘夕陽。" },
    { title: "PARCO CITY海景巨型商場 × 雙炸豬排", icon: "🛍️", desc: "達磨寺祈求開運不倒翁、敘敘苑海景燒肉、PARCO CITY停留5小時痛快血拼、小やじ與かつ乃屋雙豬排饗宴。" },
    { title: "道之驛小農 × AEON採買 × 通堂拉麵", icon: "🍜", desc: "豐崎道之驛伴手禮、小祿AEON最後補貨、通堂經典男人麵/女人麵為旅途劃下完美句點。" }
  ]
};

const DAY_SUMMARIES = [
  {
    day: 1,
    date: "2026/12/12",
    dayOfWeek: "星期六",
    title: "首日啟程・好市多採購・北谷美國村週末煙火",
    tagline: "自駕首航！南部好市多狂歡與週六限定美村海濱夜空花火",
    themeColor: "#0284c7",
    stopsCount: 7
  },
  {
    day: 2,
    date: "2026/12/13",
    dayOfWeek: "星期日",
    title: "糸滿魚市場海鮮・iias水族館・漁民食堂名店",
    tagline: "海味爆棚的一天！現剖生魚片海膽、海景巨城與光影水族館",
    themeColor: "#0891b2",
    stopsCount: 7
  },
  {
    day: 3,
    date: "2026/12/14",
    dayOfWeek: "星期一",
    title: "雙神社參拜・DFS免稅・文青EIBUN麵・瀨長島夕陽",
    tagline: "那霸文化與時尚的一日英哩，崖上海景波上宮與小希臘落日",
    themeColor: "#2563eb",
    stopsCount: 11
  },
  {
    day: 4,
    date: "2026/12/15",
    dayOfWeek: "星期二",
    title: "達磨寺祈福・敘敘苑海景燒肉・PARCO CITY狂逛5小時・雙豬排巡禮",
    tagline: "極致購物與肉食狂歡！沖繩最大海景商城與日式酥脆豬排雙饗宴",
    themeColor: "#7c3aed",
    stopsCount: 9
  },
  {
    day: 5,
    date: "2026/12/16",
    dayOfWeek: "星期三",
    title: "豐崎道之驛小農・AEON最後補貨・通堂拉麵經典・還車返台",
    tagline: "滿載而歸！特產採購衝刺、傳奇通堂拉麵與機場溫馨道別",
    themeColor: "#d97706",
    stopsCount: 6
  }
];

const SCHEDULE_ITEMS = [
  // DAY 1 (2026/12/12)
  {
    id: "d1-1",
    day: 1,
    date: "2026/12/12",
    time: "11:00",
    name: "Toyota Rental Car Naha Airport Branch",
    nameZh: "Toyota租車 沖繩那霸機場店",
    nameJa: "トヨタレンタカー 那覇空港店",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "transport",
    categoryLabel: "交通取車",
    icon: "🚗",
    lat: 26.1915,
    lng: 127.6590,
    address: "沖縄県那覇市赤嶺2丁目13-1",
    mapCode: "33 064 577*55",
    googleQuery: "Toyota Rental Car Naha Airport Branch",
    tags: ["自駕首站", "機場接駁", "右駕手續"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆極低 (<500步)",
            "walkingScore": "green",
            "seatingRest": "營業所設有寬敞冷氣候車沙發與茶水機，無需站立等候",
            "foodHighlights": "備有常溫及冰熱飲水機、周邊有便利商店可買熱茶",
            "cultureShopping": "提供中文版日本交通規則手冊與右駕注意事項，資訊安心透明",
            "keyTip": "搭乘免費專屬低底盤接駁車從航廈直達，後車廂寬大免手提大行李，長輩在沙發休息由年輕人辦理交車手續"
      },
      "young": {
            "photoSpot": "嶄新豐田休旅/油電車交車出發合影，記錄沖繩自駕啟程",
            "trendyFood": "車載手機連線即時導航，準備前往第一站美食",
            "shoppingNightlife": "免去排隊等待，快速電子化驗車與加購安心全險(NOC)",
            "vibe": "高科技、高效率、現代化自駕探索起點",
            "keyTip": "確認車載藍牙連線成功、連接CarPlay/Android Auto，出發前設定首站MapCode"
      },
      "harmony": {
            "score": 9.8,
            "advice": "年輕人負責櫃台簽約與車況錄影檢查；長輩在候車室安坐歇息喝茶，省去排隊勞頓。",
            "splitMeetingPoint": "那霸機場營業所一樓冷氣大廳沙發區"
      }
},
    desc: "抵達那霸機場後搭乘豐田專屬免費接駁巴士直達營業所。辦理取車手續、出示台灣駕照正本與日文譯本、確認加保安心免責險(NOC)、詳細檢查車體外觀並熟悉右駕按鍵與車載GPS導航。",
    tips: "取車時務必繞車一圈錄影或拍照記錄微小刮痕；熟悉右側方向燈撥桿與雨刷位置；設定好首站導航。"
  },
  {
    id: "d1-2",
    day: 1,
    date: "2026/12/12",
    time: "12:15",
    name: "San-A 塩崎",
    nameZh: "SAN-A 潮崎購物城 (San-A Shiozaki)",
    nameJa: "サンエー しおざきシティ",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "shopping",
    categoryLabel: "補給採買",
    icon: "🛒",
    lat: 26.1305,
    lng: 127.6710,
    address: "沖縄県糸満市潮崎町2丁目2",
    mapCode: "232 425 447*88",
    googleQuery: "サンエー しおざきシティ",
    tags: ["南部大型超市", "隨車補給", "日用品食品"],
        generation: {
      "senior": {
            "walkingLoad": "平緩輕鬆 (<1000步)",
            "walkingScore": "green",
            "seatingRest": "全平面單層動線無樓梯門檻，附設休息座椅與乾淨洗手間",
            "foodHighlights": "日本產地直送草莓、青森蜜柑、無糖Sanpin茶、現烤日式米餅",
            "cultureShopping": "在地沖繩長壽食材、天然海鹽、隨身常備喉糖與健康飲品",
            "keyTip": "平面超大型免費停車場，下車直接推推車進入，長輩挑選當季水果極為開心"
      },
      "young": {
            "photoSpot": "各色日本零食飲料陳列牆、沖繩限定風味餅乾",
            "trendyFood": "沖繩限定Orion風味微醺沙瓦、限定黑糖洋芋片、冰滴咖啡",
            "shoppingNightlife": "藥妝採購、隨身防曬噴霧、護唇膏、車用充電小物",
            "vibe": "道地日本生活感量販、隨車零食採購站",
            "keyTip": "採買隨車礦泉水、大包裝零食與宵夜飲料，價格比超商便宜30%"
      },
      "harmony": {
            "score": 9.6,
            "advice": "自駕首日補給站，長輩挑健康水果與熱茶，年輕人挑潮流零食，30-45分鐘迅速完成全車補給。",
            "splitMeetingPoint": "商場入口生鮮超市烘焙坊休息區"
      }
},
    desc: "沖繩南部在地人最信賴的連鎖大型綜合商場。初抵沖繩立即採購隨車礦泉水、Sanpin香片茶、防曬噴霧、零食、水果及旅程初期隨身生活物資，好逛且價格親民。",
    tips: "設有超大型平面免費停車場；商場內附設美食街與烘焙坊，亦可簡單點心充飢。"
  },
  {
    id: "d1-3",
    day: 1,
    date: "2026/12/12",
    time: "13:20",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (海之樹 旅宿Check-in)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "旅宿休整",
    icon: "🏡",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["行程基地", "海景旅宿", "寄存行李"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "抵達本次沖繩旅程的核心基地 Ocean Tree！辦理入住登記、寄存大件行李、換穿輕便衣物，推開窗感受南國溫柔海風，稍作休整。",
    tips: "確認房門密碼鎖及停車位位置；檢查隨身好市多會員卡準備下午採購。"
  },
  {
    id: "d1-4",
    day: 1,
    date: "2026/12/12",
    time: "14:50",
    name: "COSTCO好市多 沖繩店",
    nameZh: "COSTCO 好市多 沖繩南城倉庫店",
    nameJa: "コストコホールセール 沖縄南城倉庫店",
    duration: "停留 02時30分",
    durationMinutes: 150,
    category: "shopping",
    categoryLabel: "巨型量販",
    icon: "🛍️",
    lat: 26.1558,
    lng: 127.7712,
    address: "沖縄県南城市つきしろ1071-1",
    mapCode: "232 509 780*14",
    googleQuery: "Costco Wholesale Okinawa Nanjo",
    tags: ["沖繩首間好市多", "限定美食", "派對熟食"],
        generation: {
      "senior": {
            "walkingLoad": "平緩大空間 (1500~2000步)",
            "walkingScore": "yellow",
            "seatingRest": "熟食用餐區設有大量桌椅；全館無任何階梯門檻，推車好推",
            "foodHighlights": "熟食區招牌熱蛤蜊濃湯（濃郁暖胃）、石垣牛燒肉片、整盒當季日本草莓",
            "cultureShopping": "沖繩產黑糖特產大包裝、日本產健康養生堅果、深海魚油保健食品",
            "keyTip": "2024全新南城倉庫店，走道極寬不擁擠；建議長輩先至熟食區喝熱湯休息，避免逛太久"
      },
      "young": {
            "photoSpot": "沖繩首間好市多美式巨型貨架背景、巨型泰迪熊、大披薩打卡照",
            "trendyFood": "沖繩限定口味熟食披薩、特大牛肉捲、吉拿棒、派對特大壽司拼盤",
            "shoppingNightlife": "超值進口零食、整箱Orion啤酒、露營戶外用品超划算",
            "vibe": "美式大採購狂歡、社群開箱好物爆棚",
            "keyTip": "台灣Costco實體會員卡全球通用；熟食區免會員卡亦可由外側自助點餐機購買"
      },
      "harmony": {
            "score": 9.4,
            "advice": "年輕人負責推車穿梭快速選購派對食材，長輩在熟食區享用熱騰騰蛤蜊濃湯小憩，互不拖累。",
            "splitMeetingPoint": "好市多熟食餐飲用餐區（近收銀台處）"
      }
},
    desc: "2024年秋季轟動登場的沖繩第一間好市多！佔地遼闊，除各類美式超值商品外，更有沖繩黑糖點心、石垣牛肉排、在地特產，是自駕族群採買派對派對美食與宵夜的大天堂！",
    tips: "台灣好市多實體會員卡全球通用；熟食部的沖繩限定風味披薩、大熱狗與蛤蜊濃湯不可錯過。"
  },
  {
    id: "d1-5",
    day: 1,
    date: "2026/12/12",
    time: "17:49",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (放戰利品・換裝準備出發)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "中途休整",
    icon: "🏡",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["戰利品卸貨", "補水修整", "出發北谷"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "返回Ocean Tree將好市多採購的冷藏食物與戰利品歸位，稍微盥洗補妝，攜帶防風外套準備北上北谷町觀賞週六專屬的美濱煙火秀。",
    tips: "沖繩傍晚5點至7點主幹道（58號公路）偶有下班車潮，保留充足行車時間。"
  },
  {
    id: "d1-6",
    day: 1,
    date: "2026/12/12",
    time: "19:38",
    name: "美國村煙火觀賞點",
    nameZh: "北谷美國村 週末煙火觀賞點",
    nameJa: "美浜アメリカンビレッジ 花火ビューポイント",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "attraction",
    categoryLabel: "限定景觀",
    icon: "🎆",
    lat: 26.3165,
    lng: 127.7565,
    address: "沖縄県中頭郡北谷町美浜 (日落海灘/海濱步道)",
    mapCode: "33 526 452*52",
    googleQuery: "American Village Fireworks Chatan Okinawa",
    tags: ["週六限定煙火", "美式夜景", "浪漫海濱"],
        generation: {
      "senior": {
            "walkingLoad": "平緩海邊步道 (1000~1500步)",
            "walkingScore": "yellow",
            "seatingRest": "日落海灘堤防長廊設有大量休閒長椅，海景露天咖啡座避風舒適",
            "foodHighlights": "溫熱熱可可、香草花茶、海濱餐廳軟嫩牛排與清淡海鮮燉飯",
            "cultureShopping": "欣賞昔日美軍基地轉型之跨文化海濱商圈，感受南國浪漫晚風",
            "keyTip": "週六晚間煙火約施放3-5分鐘，在步道長椅坐著抬頭即可清楚觀賞，無需久站"
      },
      "young": {
            "photoSpot": "Depot Island霓虹燈美式復古街景、繽紛彩繪牆、海邊棧道煙火璀璨首排",
            "trendyFood": "海景餐酒館、精釀啤酒、美式漢堡、網紅Blue Seal冰淇淋",
            "shoppingNightlife": "美式古著服飾、沖繩特色文創潮T、海濱酒吧夜生活",
            "vibe": "美式復古浪漫、IG短影片熱門爆款地、週末狂歡夜",
            "keyTip": "日落海灘（Sunset Beach）堤防或Depot Island Boardwalk為最佳取景點，19:40前就位"
      },
      "harmony": {
            "score": 9.5,
            "advice": "提前抵達海濱景觀餐廳或堤防長椅就座，長輩喝熱飲吹海風賞景，年輕人漫步美街拍照，20:00共同看煙火。",
            "splitMeetingPoint": "Depot Island 海濱木棧道中央鐘樓下方"
      }
},
    desc: "北谷美國村每逢週六晚間（約20:00）定期施放燦爛海濱煙火！在充滿美式復古霓虹街景、棕櫚樹與海潮聲中，抬頭欣賞夜空綻放的璀璨光芒，浪漫無比！",
    tips: "日落海灘（Sunset Beach）堤防或Depot Island Boardwalk海邊棧道是最佳觀賞點；周邊有公共大型免費停車場。"
  },
  {
    id: "d1-7",
    day: 1,
    date: "2026/12/12",
    time: "21:25",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (夜宿歸營)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "旅宿晚安",
    icon: "🌙",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["首日圓滿", "好市多宵夜", "養精蓄銳"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "返回Ocean Tree結束精彩的第一天自駕行程。開一罐沖繩Orion啤酒，搭配好市多美食與零嘴，與旅伴暢聊，好好休息為第二天的海鮮魚市場儲備體力。",
    tips: "設定明晨07:30鬧鐘，準備空腹迎接第二天的現剖海鮮早餐！"
  },

  // DAY 2 (2026/12/13)
  {
    id: "d2-1",
    day: 2,
    date: "2026/12/13",
    time: "08:00",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (晨起準備)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "晨間出發",
    icon: "🌅",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["早安南國", "空腹出發", "海味之旅"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "在南國清澈晨光中醒來，品嚐早晨咖啡，欣賞蔚藍海平線，整理相機與隨身裝備，準備迎接南部著名的海鮮早餐！",
    tips: "空腹出發！留著胃口給魚市場的豪華生魚片與海膽。"
  },
  {
    id: "d2-2",
    day: 2,
    date: "2026/12/13",
    time: "09:06",
    name: "糸滿魚市場",
    nameZh: "糸滿魚市場 (道之驛糸滿魚市中心)",
    nameJa: "糸満漁業協同組合 お魚センター",
    duration: "停留 02時00分",
    durationMinutes: 120,
    category: "food",
    categoryLabel: "老饕海味",
    icon: "🍣",
    lat: 26.1438,
    lng: 127.6625,
    address: "沖縄県糸満市西崎町4丁目19",
    mapCode: "232 484 136*85",
    googleQuery: "糸満漁業協同組合 お魚センター",
    tags: ["現剖生魚片", "焗烤海膽龍蝦", "銅板海鮮", "大生蠔"],
        generation: {
      "senior": {
            "walkingLoad": "平坦短距離 (<600步)",
            "walkingScore": "green",
            "seatingRest": "戶外遮陽用餐區設有百餘個長桌木椅，洗手台與衛生設施近在咫尺",
            "foodHighlights": "產地直送厚切生魚片、清甜魚骨味噌熱湯（300円超暖胃）、現蒸甜蝦、熟食海鮮煎餅",
            "cultureShopping": "沖繩南部漁港道地風情、隔壁農產物產館可買當季小農蔬果",
            "keyTip": "全室內單層魚市平整防滑，生魚片每盒僅300-500円，鮮度無敵且高蛋白少油膩，長輩早餐第一名"
      },
      "young": {
            "photoSpot": "滿滿海膽杯、焗烤龍蝦斷面秀、特大海生蠔鮮嫩特寫、海鮮珠寶盒合影",
            "trendyFood": "超浮誇整隻焗烤明太子海膽龍蝦、大生蠔佐檸檬、海膽鮭魚卵雙拼杯",
            "shoppingNightlife": "痛風餐拍照發限動吸睛度破表、現點現剖極致性價比",
            "vibe": "熱鬧喧騰、極致鮮美、在地老饕市集",
            "keyTip": "建議自備純水濕紙巾；各攤位可使用現金與多數電子支付，各挑一盒拼成豪華海鮮大餐"
      },
      "harmony": {
            "score": 9.9,
            "advice": "戶外座位充足，長輩先入座等候；年輕人穿梭各攤位挑選焗烤龍蝦與生魚片，全家同桌享用豐盛海味早餐！",
            "splitMeetingPoint": "魚市場大門口正對面遮陽木桌用餐區"
      }
},
    desc: "沖繩南部無人不知的海鮮朝聖地！室內一字排開十數間鮮魚攤位，陳列著只要300-500日圓的厚切生魚片、特大生蠔、甜蝦、海膽杯、焗烤海膽龍蝦與酥炸鮪魚排，現點現吃超滿足！",
    tips: "戶外設有遮陽用餐區與洗手台；推薦自備濕紙巾；旁邊還有物產館可買沖繩在地當季水果。"
  },
  {
    id: "d2-3",
    day: 2,
    date: "2026/12/13",
    time: "11:11",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (回宿休整)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "中場休息",
    icon: "🏡",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["小憩放鬆", "避開正午太陽", "換裝出發"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "在魚市場大快朵頤後，車程僅需數分鐘返回Ocean Tree。稍微放鬆小憩、整理戰利品與防曬，避開正午前最強烈的紫外線。",
    tips: "補充足夠水分，準備前往豐見城最新的巨型購物城iias。"
  },
  {
    id: "d2-4",
    day: 2,
    date: "2026/12/13",
    time: "12:21",
    name: "iias 沖繩豐崎",
    nameZh: "iias 沖繩豐崎 (大型海濱休閒商城)",
    nameJa: "イーアス沖縄豊崎",
    duration: "停留 03時00分",
    durationMinutes: 180,
    category: "shopping",
    categoryLabel: "海濱商城",
    icon: "🏬",
    lat: 26.1583,
    lng: 127.6536,
    address: "沖縄県豊見城市字豊崎3-35",
    mapCode: "232 543 400*25",
    googleQuery: "イーアス沖縄豊崎 iias Okinawa Toyosaki",
    tags: ["Uniqlo大型店", "Loft雜貨", "海景露台", "免稅購物"],
        generation: {
      "senior": {
            "walkingLoad": "平緩商場 (<1500步，可隨時休息)",
            "walkingScore": "green",
            "seatingRest": "全棟無障礙、電梯多且寬敞，2F海景露台設有超舒適真皮軟沙發",
            "foodHighlights": "美食街有多家和風定食、烏龍麵熱湯、綠茶甜品、清淡日式便當",
            "cultureShopping": "Uniqlo/GU超大平價門市買防風機能衣、大國藥妝買長輩痠痛貼布與保健品",
            "keyTip": "2020年全新落成，空調舒適不悶熱，長輩在海景沙發看海喝咖啡，完全不累"
      },
      "young": {
            "photoSpot": "頂樓恐龍戶外主題海景園區、海景星巴克露天座位、透明無邊際打卡感",
            "trendyFood": "Eggs 'n Things夏威夷大鬆餅、日式排隊甜點、特色手搖飲",
            "shoppingNightlife": "Loft文具雜貨、KOJIMA Bic Camera免稅電器、日系流行服裝專櫃",
            "vibe": "現代時尚海濱巨城、血拼休閒一把抓",
            "keyTip": "館內各免稅專櫃可合併退稅，服務中心專人辦理；逛街與水族館一站雙享"
      },
      "harmony": {
            "score": 9.7,
            "advice": "約定於2F海景沙發露台為集合點，長輩看海休憩品茗，年輕人盡情血拼，90分鐘後會合，各得其所。",
            "splitMeetingPoint": "iias 2F 面海觀景露台（星巴克旁）"
      }
},
    desc: "2020年全新開幕的沖繩南部最大型購物中心！集結Uniqlo、GU大型店、Loft雜貨、KOJIMA電器、超大藥妝店及各大人氣服飾；頂層更設有恐龍主題戶外海景BBQ園區，面海景致極佳。",
    tips: "館內多數免稅店舖可合併辦理退稅手續；逛累了可到2F海景露台座位喝咖啡看海。"
  },
  {
    id: "d2-5",
    day: 2,
    date: "2026/12/13",
    time: "15:28",
    name: "DMM Kariyushi水族館",
    nameZh: "DMM Kariyushi水族館 (光影沉浸水族)",
    nameJa: "DMMかりゆし水族館",
    duration: "停留 00時30分",
    durationMinutes: 30,
    category: "attraction",
    categoryLabel: "沉浸科技",
    icon: "🐠",
    lat: 26.1578,
    lng: 127.6542,
    address: "沖縄県豊見城市字豊崎3-35 (iias商場內2F)",
    mapCode: "232 543 400*25",
    googleQuery: "DMM Kariyushi Aquarium Okinawa",
    tags: ["光影水族", "玻璃步道", "近距離企鵝", "數位藝術"],
        generation: {
      "senior": {
            "walkingLoad": "全室內平緩 (<800步)",
            "walkingScore": "green",
            "seatingRest": "水母光影展區與大型水槽前設有多處觀景座椅，可坐著靜心觀賞",
            "foodHighlights": "館內附設海島咖啡吧，提供熱花茶與清爽香檸氣泡水",
            "cultureShopping": "沉浸式琉球海洋生態，近距離觀察溫馴的熱帶魚與企鵝，節奏安詳療癒",
            "keyTip": "展館精緻緊湊（全程約30-45分鐘），全館無上下階梯（皆有無障礙坡道/電梯），長輩走起來零負擔"
      },
      "young": {
            "photoSpot": "腳下透明強化玻璃水槽懸空步道（俯視鯊魚魟魚）、夢幻變色水母柱、光影雨林",
            "trendyFood": "水族館限定海洋藍冰淇淋、企鵝造型點心",
            "shoppingNightlife": "觸摸池近距離摸海星海參、樹獺與大嘴鳥近距拍攝、數位互動APP集章",
            "vibe": "光影科技美學、新世代沉浸藝術、IG美拍神館",
            "keyTip": "腳下玻璃步道需脫鞋入內，手機拍照開啟超廣角俯拍，視覺張力極具未來感"
      },
      "harmony": {
            "score": 9.8,
            "advice": "場館小巧精美、動線流暢，長輩不會體力透支，年輕人拍出科技感美照，是跨世代滿意度最高景點之一！",
            "splitMeetingPoint": "水族館出口紀念品旗艦店前休息區"
      }
},
    desc: "緊鄰iias商場的新世代水族館，將尖端投影技術與海洋生態完美結合！步入腳下懸空透明玻璃的水槽步道、觀察自在悠游的魟魚與熱帶魚，還能近距離看到樹獺、大嘴鳥與企鵝！",
    tips: "場館精緻緊湊、動線流暢，30至45分鐘即可完整體驗精彩展區與光影互動秀。"
  },
  {
    id: "d2-6",
    day: 2,
    date: "2026/12/13",
    time: "16:05",
    name: "美麗SUN海灘",
    nameZh: "豐崎海濱公園 美麗SUN海灘",
    nameJa: "豊崎美らSUNビーチ",
    duration: "停留 00時30分",
    durationMinutes: 30,
    category: "attraction",
    categoryLabel: "絕美海灘",
    icon: "🏖️",
    lat: 26.1545,
    lng: 127.6508,
    address: "沖縄県豊見城市字豊崎5-1",
    mapCode: "232 542 328*33",
    googleQuery: "Toyosaki Seaside Park Chura-SUN Beach",
    tags: ["全長700米白沙", "看飛機起降", "日落散步", "南部第一灘"],
        generation: {
      "senior": {
            "walkingLoad": "平坦防滑海濱步道 (<800步)",
            "walkingScore": "green",
            "seatingRest": "沿岸設有多座遮陽涼亭與木製長椅，坐在亭下遠眺碧海藍天非常愜意",
            "foodHighlights": "自備保溫瓶熱茶，漫步海邊深呼吸南國清新海風",
            "cultureShopping": "沖繩南部最大型整建海濱公園，視野極其寬廣，心情豁然開朗",
            "keyTip": "就在iias商場正前方，車輛可停商場或公園；初冬海風略強，提醒長輩披上防風薄外套"
      },
      "young": {
            "photoSpot": "700米純白細沙灘漫步背影、那霸機場降落客機低空掠過海天的大景攝影",
            "trendyFood": "海灘咖啡小吧、香檸果汁、夕陽剪影特寫",
            "shoppingNightlife": "寬闊海景無遮蔽，落日時分粉紫金黃晚霞色彩變幻極美",
            "vibe": "放鬆純白沙灘、航空迷與攝影迷天堂",
            "keyTip": "客機每隔5-10分鐘就有一架掠過頭頂降落，手機連拍即可捕捉飛機與海灘同框神作"
      },
      "harmony": {
            "score": 9.6,
            "advice": "行程時間約30-40分鐘，涼亭下長輩吹風看海聊天，年輕人沙灘走走拍飛機起降，悠閒自在。",
            "splitMeetingPoint": "美麗SUN海灘中央管理棟前觀景涼亭"
      }
},
    desc: "沖繩南部全長超過700公尺的白砂人工海灘，就在iias商場正前方！可踏著細白沙灘漫步，近距離欣賞那霸機場起降航班掠過碧藍海空的震撼視角，微風徐徐非常治癒。",
    tips: "冬季海風較大，建議披上薄防風外套；傍晚落日時分天空會染上一層漸層粉紫金黃。"
  },
  {
    id: "d2-7",
    day: 2,
    date: "2026/12/13",
    time: "16:43",
    name: "糸滿漁民食堂",
    nameZh: "糸滿漁民食堂 (神級奶油香煎鮮魚)",
    nameJa: "糸満漁民食堂",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "food",
    categoryLabel: "名店晚餐",
    icon: "🐟",
    lat: 26.1472,
    lng: 127.6656,
    address: "沖縄県糸満市西崎町4丁目22-7",
    mapCode: "232 484 797*30",
    googleQuery: "糸満漁民食堂 Itoman Gyomin Shokudo",
    tags: ["鐵板奶油煎魚", "琉球石灰岩建築", "排隊神店", "鮮魚定食"],
        generation: {
      "senior": {
            "walkingLoad": "平坦極短 (<200步)",
            "walkingScore": "green",
            "seatingRest": "室內日式榻榻米與木質桌椅，環境典雅安靜，排煙除味佳",
            "foodHighlights": "招牌時令鮮魚定食：肉質細嫩清甜、附濃郁鮮魚味噌湯與3道開胃小菜，營養少油",
            "cultureShopping": "琉球石灰岩傳統工藝堆砌外觀，極具文化底蘊與建築美感",
            "keyTip": "鮮魚刺少肉嫩，極為適合長輩牙口；蒜香或海苔奶油可依長輩喜好選擇清淡海苔風味"
      },
      "young": {
            "photoSpot": "鐵板端上桌時滋滋作響的熱氣升騰、金黃酥脆鮮魚外皮、石灰岩建築網美打卡",
            "trendyFood": "神級鐵板奶油香煎魚（魚のバター焼き），外皮酥脆香濃、魚肉多汁爆漿，排隊名店",
            "shoppingNightlife": "品嚐沖繩在地小農調味料、泡盛調味魚湯、社群狂讚朝聖店",
            "vibe": "排隊神級美食、職人手作溫暖氛圍",
            "keyTip": "晚間經常大排長龍，建議17:00前抵達或由年輕人先下車登記候位，長輩在車內等候叫號"
      },
      "harmony": {
            "score": 9.7,
            "advice": "熱騰騰現煎鮮魚定食老少咸宜，長輩吃得健康溫暖，年輕人嚐到極品奶油香氣，排隊登記分工更貼心。",
            "splitMeetingPoint": "糸滿漁民食堂候位門廳"
      }
},
    desc: "沖繩南部必吃第一名！由當地琉球石灰岩匠人堆砌的優雅外觀，鎮店之寶是鐵盤上滋滋作響的「奶油香煎時令魚（魚のバター焼き）」，可自選蒜味、海苔或辣味奶油，香濃無比，魚肉外酥內嫩汁水飽滿！",
    tips: "名店經常大排長龍，提早於晚餐開始前抵達登記候位最保險；定食隨附新鮮魚湯與三道小菜極度超值。"
  },

  // DAY 3 (2026/12/14)
  {
    id: "d3-1",
    day: 3,
    date: "2026/12/14",
    time: "08:00",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (晨起準備)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "晨間出發",
    icon: "🌅",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["那霸精華日", "神社祈福", "市區免稅"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "旅程第三天將全日造訪沖繩首府那霸市區！早晨悠閒享用早餐，準備走訪神社參拜、市區DFS免稅狂歡、國際通名物與瀨長島日落。",
    tips: "那霸市區白天車流較多，留意導航路況並備妥零錢停車。"
  },
  {
    id: "d3-2",
    day: 3,
    date: "2026/12/14",
    time: "09:22",
    name: "沖繩縣護國神社",
    nameZh: "沖繩縣護國神社",
    nameJa: "沖縄県護国神社",
    duration: "停留 00時30分",
    durationMinutes: 30,
    category: "attraction",
    categoryLabel: "神社參拜",
    icon: "⛩️",
    lat: 26.2039,
    lng: 127.6749,
    address: "沖縄県那覇市奥武山町44",
    mapCode: "33 126 127*41",
    googleQuery: "沖繩縣護國神社 Okinawa Gokoku Shrine",
    tags: ["奧武山公園", "莊嚴清幽", "求闔家平安"],
        generation: {
      "senior": {
            "walkingLoad": "平緩林蔭參道 (<800步)",
            "walkingScore": "green",
            "seatingRest": "參道兩旁古木參天，林蔭遮陽，境內設有石椅可歇腳",
            "foodHighlights": "自備熱茶，在清新綠意森林芬多精中晨行",
            "cultureShopping": "祈求闔家平安、健康長壽、子孫行車平安御守，莊嚴清幽",
            "keyTip": "坐落奧武山公園內，參道平坦無陡峭階梯，附設免費平面停車場，下車直通神社"
      },
      "young": {
            "photoSpot": "巨大朱紅鳥居仰角構圖、日系傳統洗手舍（手水舍）淨手特寫、綠蔭石燈籠街道",
            "trendyFood": "抽特色神籤（御神籤）、收藏精美刺繡御守",
            "shoppingNightlife": "沉靜日系底片風格街拍，洗滌都市喧囂的心靈角落",
            "vibe": "莊嚴祥和、日系傳統美學、晨間心靈沉澱",
            "keyTip": "參拜禮儀為「二禮、二拍手、一禮」；紅色大鳥居前拍攝全家合照視野極佳"
      },
      "harmony": {
            "score": 9.8,
            "advice": "晨間空氣清新怡人，步調舒緩放鬆，長輩虔誠祈願求平安，年輕人拍攝日系大片，全家同沐神恩。",
            "splitMeetingPoint": "護國神社本殿前方參道廣場"
      }
},
    desc: "坐落於奧武山公園林蔭綠意中，是沖繩參拜祈願名所。巨大紅色鳥居與開闊參道帶來平靜祥和氛圍，祈求心願成就與旅程平平安安。",
    tips: "公園內設有專屬免費停車場；神社境內古木參天，早晨散步空氣清新怡人。"
  },
  {
    id: "d3-3",
    day: 3,
    date: "2026/12/14",
    time: "10:04",
    name: "波上宮",
    nameZh: "波上宮 (沖繩總鎮守・懸崖海景神社)",
    nameJa: "波上宮 (なみのうえぐう)",
    duration: "停留 00時30分",
    durationMinutes: 30,
    category: "attraction",
    categoryLabel: "琉球八社之首",
    icon: "⛩️",
    lat: 26.2205,
    lng: 127.6713,
    address: "沖縄県那覇市若狭1丁目25-11",
    mapCode: "33 185 023*22",
    googleQuery: "波上宮 Naminoue Shrine Okinawa",
    tags: ["琉球八社第一", "珊瑚崖海景", "小學生書包御守", "波之上海灘"],
        generation: {
      "senior": {
            "walkingLoad": "平緩小斜坡 (<800步)",
            "walkingScore": "green",
            "seatingRest": "境內設有遮蔭長椅，洗手間整潔；避開正門石階可走側邊平緩斜坡直達本殿",
            "foodHighlights": "參拜後至波之上海灘旁茶亭小歇，吹海風品茶",
            "cultureShopping": "琉球八社之首，沖繩總鎮守！最經典紀念品為精緻紅黑「小學生書包交通御守」，送孫兒首選",
            "keyTip": "歷史悠久香火鼎盛，長輩祈求家族世代興旺；走側邊斜坡免爬階梯非常輕鬆"
      },
      "young": {
            "photoSpot": "波之上臨海大橋回望「矗立在懸崖上的朱紅神社」明信片奇蹟視角、神社朱紅廊柱",
            "trendyFood": "紅黑兩色超萌小書包御守打卡、祈求戀愛良緣御守",
            "shoppingNightlife": "懸崖下波之上海灘踏浪、蔚藍大海與神社同框之攝影大景",
            "vibe": "壯麗海崖神社、沖繩最具代表性地標",
            "keyTip": "參拜後年輕人步行2分鐘至若狹海濱大橋上，能拍出神社懸空立於崖壁上的震撼全景"
      },
      "harmony": {
            "score": 9.7,
            "advice": "長輩由無障礙緩坡至殿前虔誠參拜求御守；年輕人可趁空檔至橋上抓拍懸崖全景照，30分鐘各得所願。",
            "splitMeetingPoint": "波上宮本殿前右側御守販售處旁長椅"
      }
},
    desc: "佇立於珊瑚礁斷崖之上的琉球第一神社！朱紅色本殿襯著蔚藍晴空與浩瀚太平洋，氣勢非凡。最具代表性的紀念品是紅黑兩色的精緻小學生書包交通安全御守！",
    tips: "參拜後可步行至一旁的波之上沙灘橋上，回望拍下矗立在斷崖上的神社經典明信片角度。"
  },
  {
    id: "d3-4",
    day: 3,
    date: "2026/12/14",
    time: "10:51",
    name: "迪斐世 沖繩那霸店",
    nameZh: "T 廣場 by DFS 沖繩那霸店",
    nameJa: "Tギャラリア 沖縄 by DFS",
    duration: "停留 03時00分",
    durationMinutes: 180,
    category: "shopping",
    categoryLabel: "免稅精品",
    icon: "💎",
    lat: 26.2229,
    lng: 127.6976,
    address: "沖縄県那覇市おもろまち4-1",
    mapCode: "33 188 296*33",
    googleQuery: "T Galleria by DFS Okinawa",
    tags: ["日本唯一路面免稅", "一線精品全齊", "香氛化妝品", "歌町站"],
        generation: {
      "senior": {
            "walkingLoad": "室內平坦 (1200~1800步)",
            "walkingScore": "yellow",
            "seatingRest": "全日本唯一境內路面免稅旗艦，各專櫃設有頂級皮質沙發與VIP休息區",
            "foodHighlights": "2F美食廣場與精品咖啡座，提供精緻花草茶、養生果汁與點心",
            "cultureShopping": "頂級專櫃保養品（SK-II、雅詩蘭黛、資生堂）、名牌絲巾、頂級手錶免稅大幅折讓",
            "keyTip": "購買之免稅品直接於返台當天「那霸機場管制區」提貨，旅途中「完全不用手提重物」，對長輩極大減負！"
      },
      "young": {
            "photoSpot": "各大國際一線精品旗艦門面奢華造景、時尚都會街拍",
            "trendyFood": "精品咖啡廳、限定甜品",
            "shoppingNightlife": "Chanel、LV、Gucci、Celine、Dior一線精品齊聚，日圓匯率優勢+免稅超划算，彩妝香氛天堂",
            "vibe": "奢華血拼、路面免稅挖寶、機場輕鬆提貨",
            "keyTip": "記得備妥回程航班代碼與護照，結帳即發送提貨券，最後一天出境直接領取"
      },
      "harmony": {
            "score": 9.5,
            "advice": "機場免稅提貨機制讓長輩逛得輕鬆優雅免提袋；館內咖啡沙發舒適，長輩坐沙發品咖啡，年輕人盡情血拼。",
            "splitMeetingPoint": "DFS 2F 中央精品鐘錶區旁服務台沙發"
      }
},
    desc: "全日本唯一的境內路面免稅店旗艦！匯聚Chanel、Louis Vuitton、Gucci、Cartier、Dior及全球各大頂級美妝保養品牌，免稅價極具吸引力，直接憑回程航班資訊於那霸機場管制區輕鬆提貨！",
    tips: "需出示回程航班機票資訊或預約確認信；館內提供大型室內免費停車場。"
  },
  {
    id: "d3-5",
    day: 3,
    date: "2026/12/14",
    time: "14:03",
    name: "那霸國際通商店街",
    nameZh: "那霸國際通商店街 (途經抵達)",
    nameJa: "那覇国際通り商店街",
    duration: "停留 00時00分",
    durationMinutes: 0,
    category: "shopping",
    categoryLabel: "繁華街區",
    icon: "🚶",
    lat: 26.2160,
    lng: 127.6875,
    address: "沖縄県那覇市牧志",
    mapCode: "33 157 382*41",
    googleQuery: "那覇国際通り商店街 Kokusai Dori",
    tags: ["奇蹟的一英哩", "街區核心", "步行美食"],
        generation: {
      "senior": {
            "walkingLoad": "街道漫步 (1500~2000步)",
            "walkingScore": "yellow",
            "seatingRest": "平和通與公設市場周邊有多處室內遮雨棚拱廊與茶座小店",
            "foodHighlights": "御菓子御殿現烤紅芋塔、老字號純手工柴燒黑糖糕、清爽酸橘冰",
            "cultureShopping": "琉球傳統漆器、風獅爺手作陶器、傳統民謠三線琴店、古法泡盛專賣",
            "keyTip": "全長1.6公里，建議長輩漫步精華前半段或至壺屋陶瓷街漫遊，累了進特產店吹冷氣試吃"
      },
      "young": {
            "photoSpot": "奇蹟的一英哩繁華街景、巨大風獅爺塑像、昭和懷舊巷弄、Blue Seal霓虹招牌",
            "trendyFood": "Blue Seal紅芋海鹽冰淇淋、排隊沖繩飯糰（波上宮旁本店）、街頭居酒屋串燒",
            "shoppingNightlife": "唐吉訶德24小時驚安殿堂、文青潮流選物店、搞怪沖繩限定T恤",
            "vibe": "活力四射、霓虹熱鬧、步行探索核心",
            "keyTip": "國際通兩側單行道多，建議將車輛停放在周邊大型付費停車場，純步行逛街最愜意"
      },
      "harmony": {
            "score": 9.2,
            "advice": "長輩重點逛伴手禮名產試吃與傳統工藝，年輕人衝潮店唐吉訶德，約定於平和通拱廊入口集合避開日曬。",
            "splitMeetingPoint": "國際通與平和通商店街拱廊交界處"
      }
},
    desc: "全長1.6公里的沖繩最繁華主幹道「奇蹟的一英哩」。集合了傳統工藝、風獅爺手作、紫薯塔名店與特色居酒屋，此站作為進入牧志公設市場巷弄美食的起點。",
    tips: "國際通兩側皆為單行道或易塞車路段，建議將車輛停在周邊收費停車場（如平和通或壺屋周邊）步行進入。"
  },
  {
    id: "d3-6",
    day: 3,
    date: "2026/12/14",
    time: "14:10",
    name: "소키소바(Inaka Kosetsuichiba Minami-ten)",
    nameZh: "田舍 沖繩麵 (公設市場南店)",
    nameJa: "ソーキそば 田舎 公設市場南店",
    duration: "停留 00時00分",
    durationMinutes: 0,
    category: "food",
    categoryLabel: "庶民傳奇",
    icon: "🍜",
    lat: 26.2142,
    lng: 127.6882,
    address: "沖縄県那覇市松尾2丁目10-20",
    mapCode: "33 157 235*11",
    googleQuery: "ソーキそば 田舎 公設市場南店",
    tags: ["400円銅板美食", "軟骨入口即化", "巷弄隱藏版", "傳統老味"],
        generation: {
      "senior": {
            "walkingLoad": "平坦短街 (<400步)",
            "walkingScore": "green",
            "seatingRest": "室內傳統木桌凳，座位緊湊溫馨，出餐極快免久等",
            "foodHighlights": "招牌軟骨肉麵僅400円！深褐色豬軟骨燉煮至晶瑩黏糯、入口即化，極易咀嚼，柴魚高湯清甜甘醇",
            "cultureShopping": "體驗老那霸公設市場窄巷內數十年不變的人情味與庶民老滋味",
            "keyTip": "牙口不好的長輩也能毫無負擔享受的極致軟嫩軟骨肉，湯頭清甜少油，暖心又暖胃"
      },
      "young": {
            "photoSpot": "400円超狂銅板價招牌、鋪滿晶亮軟骨肉的超值沖繩麵、昭和懷舊窄巷店門",
            "trendyFood": "那霸傳奇銅板美食對照組、甘甜柴魚豚骨高湯、桌上特製泡盛辣椒（高麗胡椒）微辣過癮",
            "shoppingNightlife": "巷弄尋寶老店朝聖、與新潮EIBUN形成強烈風格對比",
            "vibe": "復古昭和感、極致CP值、老饕私藏小吃",
            "keyTip": "只收日幣現金；翻桌率極快，15分鐘即可完食，可做為雙麵試吃探險的上半場"
      },
      "harmony": {
            "score": 9.4,
            "advice": "極平價美味小品，軟嫩軟骨深受長輩讚許；若同行年輕人想吃文青EIBUN，兩店相距僅步行4分鐘，極易協調！",
            "splitMeetingPoint": "田舍沖繩麵店門前巷口"
      }
},
    desc: "隱身於第一牧志公設市場周邊窄巷的超平價傳奇沖繩麵！一碗招牌軟骨肉麵只要400-500日圓，深褐色的豬軟骨燉煮至晶瑩剔透、軟爛如布丁入口即化，濃郁柴魚豚骨高湯超銷魂！",
    tips: "店內座位精緻、只收現金；若客滿可作為雙麵比拼的對照組，立即步行4分鐘前往文青名店EIBUN。"
  },
  {
    id: "d3-7",
    day: 3,
    date: "2026/12/14",
    time: "14:14",
    name: "沖繩麵 EIBUN",
    nameZh: "沖繩麵 EIBUN (新世代文青話題名店)",
    nameJa: "OKINAWA SOBA EIBUN",
    duration: "停留 02時00分",
    durationMinutes: 120,
    category: "food",
    categoryLabel: "排隊冠軍",
    icon: "🍲",
    lat: 26.2117,
    lng: 127.6908,
    address: "沖縄県那覇市壺屋1丁目5-14",
    mapCode: "33 158 135*00",
    googleQuery: "OKINAWA SOBA EIBUN 那覇",
    tags: ["法式技藝跨界", "炙燒三層肉", "特選特製麵條", "沖繩第一話題"],
        generation: {
      "senior": {
            "walkingLoad": "平緩短路 (<400步)",
            "walkingScore": "green",
            "seatingRest": "文青木質裝潢、室內冷氣舒適；門口採用平板線上抽號，免曬太陽罰站",
            "foodHighlights": "昆布柴魚慢火高湯清澄回甘、低鈉少負擔，炙燒肉塊酥軟芳香，提供香檬與柚子胡椒增添清爽",
            "cultureShopping": "鄰近壺屋通陶瓷街，等候期間可帶長輩至兩旁平緩散步賞陶瓷藝品",
            "keyTip": "平板抽號後有手機簡訊通知，長輩可在隔壁冷氣陶藝店吹冷氣看瓷器，完全不用久站排隊"
      },
      "young": {
            "photoSpot": "當今那霸第一網紅文青麵！法式擺盤特選BUNSOBA、厚切炙燒肉塊特寫、木質現代裝潢",
            "trendyFood": "法餐主廚跨界研發！特製風味辣油、芥末生拌麵、招牌多重肉品組合、香檸冷麵",
            "shoppingNightlife": "沖繩當前話題度冠軍、排隊名店打卡炫耀、壺屋文青潮店",
            "vibe": "文青美學、料理跨界創新、潮流美食天花板",
            "keyTip": "抵達立即至門口平板登記人數與手機號，留意號碼跳轉，通常需等候30-60分鐘，可順遊壺屋街"
      },
      "harmony": {
            "score": 9.6,
            "advice": "年輕人取號排隊，長輩於隔壁壺屋陶藝老街悠然漫步賞瓷器；顛覆傳統的清爽湯頭長輩也讚不絕口！",
            "splitMeetingPoint": "EIBUN店門口木質等候長凳"
      }
},
    desc: "顛覆傳統沖繩麵的當代排隊第一天王！由曾於法國料理修業的主廚打造，柴魚昆布慢火高湯清冽甘甜，招牌特選BUNSOBA盛滿了厚切炙燒三層肉、特選軟骨與嫩煎肉塊，更有多款風味辣油與柚子胡椒自由調配！",
    tips: "可使用門口平板登記排隊號碼，等候期間可順遊兩旁的壺屋陶瓷通漫步。"
  },
  {
    id: "d3-8",
    day: 3,
    date: "2026/12/14",
    time: "16:27",
    name: "Sports Depo Ameku",
    nameZh: "Sports Depo 天久店 (超大運動用品專賣)",
    nameJa: "スポーツデポ 天久店",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "shopping",
    categoryLabel: "戶外運動",
    icon: "👟",
    lat: 26.2307,
    lng: 127.6922,
    address: "沖縄県那覇市天久1-2-1 (天久樂市內)",
    mapCode: "33 218 074*74",
    googleQuery: "Sports Depo Ameku Naha",
    tags: ["露營登山", "球鞋服飾", "Coleman特賣", "免稅退稅"],
        generation: {
      "senior": {
            "walkingLoad": "平緩大賣場 (<1200步)",
            "walkingScore": "green",
            "seatingRest": "試鞋區設有大量軟皮試穿長凳，隨時可坐下休息；走道寬平防滑",
            "foodHighlights": "商場周邊附設平價美食小吃與飲料機",
            "cultureShopping": "挑選極致減震超輕量健走鞋（Skechers、Hoka、Asics）、長輩防風排汗薄夾克，免稅超值",
            "keyTip": "全館平面單層，挑雙好走的日本健走鞋，接下來幾天行程腳步輕盈無負擔"
      },
      "young": {
            "photoSpot": "超大規模露營帳篷展示區、日線限定球鞋展示牆",
            "trendyFood": "商場周邊美食",
            "shoppingNightlife": "The North Face紫標與日線山系服飾、Coleman戶外露營裝備免稅大特賣、限量球鞋",
            "vibe": "山系Outdoor潮流、裝備控天堂、超大運動賣場",
            "keyTip": "免稅手續於專屬免稅收銀台統一辦理，戶外露營用品價格約為台灣專櫃6-7折"
      },
      "harmony": {
            "score": 9.5,
            "advice": "長輩在舒適鞋區試穿好走慢跑鞋，年輕人探索潮流露營裝備，全家在同一商場各取所需，附免費大型停車場。",
            "splitMeetingPoint": "Sports Depo 入口服務台旁休息椅"
      }
},
    desc: "那霸市區最大規模運動與戶外裝備量販店！齊聚The North Face、Nike、Adidas、Under Armour、Coleman露營裝備等，折扣幅度大且提供免稅服務，運動迷尋寶必逛！",
    tips: "同商場周邊還有Uniqlo與Best電器，附有超寬敞免費停車場。"
  },
  {
    id: "d3-9",
    day: 3,
    date: "2026/12/14",
    time: "17:54",
    name: "瀨長島",
    nameZh: "瀨長島 Umikaji Terrace (沖繩小希臘)",
    nameJa: "瀬長島ウミカジテラス",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "attraction",
    categoryLabel: "浪漫落日",
    icon: "🌅",
    lat: 26.1751,
    lng: 127.6415,
    address: "沖縄県豊見城市字瀬長174-6",
    mapCode: "33 002 602*06",
    googleQuery: "瀨長島 Umikaji Terrace",
    tags: ["小希臘純白建築", "飛機近距越頂", "海景夕陽", "幸福鬆餅"],
        generation: {
      "senior": {
            "walkingLoad": "階梯步道有平緩坡道替代 (800~1200步)",
            "walkingScore": "yellow",
            "seatingRest": "地中海純白階梯各層均設有海景露天遮陽陽傘座，底層步道平坦",
            "foodHighlights": "熱檸檬花草茶、清涼香檸果汁、軟嫩舒芙蕾鬆餅、現烤海鮮串",
            "cultureShopping": "欣賞夕陽染紅東海海平線，海浪輕拍岸邊，感受極致悠閒度假氛圍",
            "keyTip": "階梯旁設有無障礙坡道可繞行；若長輩不想爬階梯，坐在最下層海景第一排露天座位視野最開闊"
      },
      "young": {
            "photoSpot": "沖繩小希臘純白建築階梯大片、落日時分飛機低空掠頂的震撼特寫、夕陽金黃海面剪影",
            "trendyFood": "全沖繩最火排隊名店「幸福鬆餅（幸せのパンケーキ）」舒芙蕾、水果聖代、海景精釀啤酒",
            "shoppingNightlife": "海濱文創露天小店、特色飾品手作、黃昏海景微醺Bar",
            "vibe": "小希臘地中海風、浪漫日落、航空客機絕景",
            "keyTip": "日落前1小時抵達為黃金時刻；幸福鬆餅需提早現場登記，戶外座位拍照最美"
      },
      "harmony": {
            "score": 9.7,
            "advice": "日落絕景人人愛！年輕人先去登記幸福鬆餅，長輩在海邊露天陽傘長椅喝茶看夕陽與飛機，共享南國暮色。",
            "splitMeetingPoint": "Umikaji Terrace 47號店舖旁觀景平台"
      }
},
    desc: "依傍海島斜坡建起的一整排純白地中海風格階梯建築！傍晚時分金黃夕陽灑滿海面，客機以極近距離自頭頂掠過降落機場，震撼又夢幻。人氣名店「幸福鬆餅」亦座落於此！",
    tips: "落日時分是全日最美時刻；島上停車位熱門，建議順著道路指示停於防波堤公共免費停車區。"
  },
  {
    id: "d3-10",
    day: 3,
    date: "2026/12/14",
    time: "19:01",
    name: "美思佰樂 豐見城店",
    nameZh: "MaxValu 豐見城店 (24小時大型超市)",
    nameJa: "マックスバリュ 豊見城店",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "shopping",
    categoryLabel: "深夜超市",
    icon: "🛒",
    lat: 26.1668,
    lng: 127.6710,
    address: "沖縄県豊見城市字田頭155-1",
    mapCode: "33 034 656*33",
    googleQuery: "MaxValu Tomigusuku 豊見城",
    tags: ["24小時不打烊", "AEON旗下", "水果伴手禮", "熟食特價"],
        generation: {
      "senior": {
            "walkingLoad": "平緩小超市 (<600步)",
            "walkingScore": "green",
            "seatingRest": "入口設有休息座椅，推車順手平整",
            "foodHighlights": "新鮮日本產蜜柑、草莓、低糖高鈣鮮乳、無糖綠茶、長輩睡前安神養生飲品",
            "cultureShopping": "日本在地永旺集團連鎖生活超市，價格透明平民化，體驗在地生活節奏",
            "keyTip": "24小時不打烊，回民宿前順路補給，買好隔天早餐水果，省去清晨找早餐的不便"
      },
      "young": {
            "photoSpot": "晚間熟食特價貼紙專區、琳瑯滿目的沖繩限定泡麵零食牆",
            "trendyFood": "晚間半價熟食炸物（炸雞、可樂餅、日式炒麵）、限定泡盛Chu-hi調酒、限定甜點",
            "shoppingNightlife": "宵夜狂歡補給站、整箱伴手禮小點心批發價",
            "vibe": "在地生活超市、深夜尋寶特價熟食",
            "keyTip": "晚間19:00後生鮮熟食區貼滿20%~50%特價標籤，便宜又美味"
      },
      "harmony": {
            "score": 9.6,
            "advice": "回海之樹民宿前的5分鐘快速補給，長輩挑水果牛奶，年輕人挑宵夜炸雞啤酒，15分鐘滿載而歸。",
            "splitMeetingPoint": "超市收銀台旁服務區"
      }
},
    desc: "永旺AEON集團旗下24小時不打烊的生活超市！回民宿前的補給好幫手，採購新鮮當季草莓/蜜柑、日本鮮乳、泡盛、各款限定泡麵與宵夜熟食，晚間常有特價貼紙優惠！",
    tips: "買好隔天早晨的水果與飲料，免去清晨出門買早餐的匆忙。"
  },
  {
    id: "d3-11",
    day: 3,
    date: "2026/12/14",
    time: "20:14",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (夜宿歸營)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "旅宿晚安",
    icon: "🌙",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["那霸戰利品", "微醺海風", "充飽電力"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "帶著DFS免稅店提貨單與超市戰利品滿載而歸。在客廳享受沖繩微醺夜晚，迎接明天第四天的超狂PARCO CITY購物與敘敘苑頂級燒肉！",
    tips: "檢查隨身相機與行動電源充電狀態；整理這兩天累積的發票退稅單據。"
  },

  // DAY 4 (2026/12/15)
  {
    id: "d4-1",
    day: 4,
    date: "2026/12/15",
    time: "08:00",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (晨起出發)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "晨間出發",
    icon: "🌅",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["祈福開運日", "頂級和牛燒肉", "巨型商城5小時"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "早晨悠閒梳洗出發，今天將深入首里古道探訪開運達摩寺、享用敘敘苑海景午餐、在全沖繩最大的PARCO CITY購物中心停留5小時血拼，晚上更是日式炸豬排雙名店巡禮！",
    tips: "穿著最舒適好走的球鞋，準備應付5小時的馬拉松逛街！"
  },
  {
    id: "d4-2",
    day: 4,
    date: "2026/12/15",
    time: "09:34",
    name: "西來院 (達磨寺)",
    nameZh: "西來院 達磨寺 (滿滿開運不倒翁秘境)",
    nameJa: "西来院 達磨寺 (だるまでら)",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "attraction",
    categoryLabel: "私房開運",
    icon: "🎎",
    lat: 26.2185,
    lng: 127.7225,
    address: "沖縄県那覇市首里赤田町1丁目5",
    mapCode: "33 162 768*41",
    googleQuery: "西来院 達磨寺 首里",
    tags: ["開運達摩", "紅不倒翁牆", "求安產祈願", "首里秘境"],
        generation: {
      "senior": {
            "walkingLoad": "平緩小庭院 (<400步)",
            "walkingScore": "green",
            "seatingRest": "禪宗寺院環境肅穆幽靜，主殿前設有木質歇腳長椅，清風徐徐",
            "foodHighlights": "自備溫熱開水，享受寺廟古木間的寧靜禪意",
            "cultureShopping": "首里古道歷史禪寺，祈求安產、長壽、闔家平安與諸願成就；開運不倒翁加持",
            "keyTip": "隱密私房景點，無大型遊覽車喧嘩；階梯僅數階且有平緩扶手，長輩參拜非常舒服"
      },
      "young": {
            "photoSpot": "數百尊大大小小紅色開運達摩不倒翁祈願牆、日式石庭院、萌感達摩排排坐特寫",
            "trendyFood": "在達摩身上親自點睛許願、購買迷你可愛達摩御守",
            "shoppingNightlife": "深度私房小眾景點、拍出與眾不同的日式文化感文青照",
            "vibe": "神秘清幽、紅色達摩震撼視覺、開運祈福",
            "keyTip": "買一個開運不倒翁，心中默念願望並親手畫上左眼，待日後願望實現再補點右眼"
      },
      "harmony": {
            "score": 9.8,
            "advice": "鬧中取靜的祈福秘境，步數極少，長輩求健康平安、年輕人拍照許願，全家同獲吉祥好兆頭！",
            "splitMeetingPoint": "達磨寺山門入口古鐘前"
      }
},
    desc: "鄰近首里城的悠久禪宗名剎！寺內供奉達磨大師，階梯與殿前擺滿了信眾許願祈福的紅色不倒翁（達磨），十分壯觀吸睛！在此可求安產、求子、學業成就與開運必勝，氣氛寧靜肅穆。",
    tips: "可在境內求一顆專屬開運不倒翁，畫上左眼許下願望，待心願實現時再點上右眼。"
  },
  {
    id: "d4-3",
    day: 4,
    date: "2026/12/15",
    time: "10:36",
    name: "7-Eleven Shuri Castle Town JA Okinawa",
    nameZh: "7-Eleven 首里城下町JA沖繩店",
    nameJa: "セブン-イレブン 首里城下町JAおきなわ店",
    duration: "停留 00時20分",
    durationMinutes: 20,
    category: "shopping",
    categoryLabel: "便利小憩",
    icon: "🏪",
    lat: 26.2162,
    lng: 127.7185,
    address: "沖縄県那覇市首里当蔵町2丁目",
    mapCode: "33 161 685*00",
    googleQuery: "セブン-イレブン 首里城下町JAおきなわ店",
    tags: ["小七補給", "首里城門市", "特色冷飲"],
        generation: {
      "senior": {
            "walkingLoad": "極低 (<100步)",
            "walkingScore": "green",
            "seatingRest": "門市設有洗手間與室內外簡單休憩座位",
            "foodHighlights": "熱騰騰日式黑輪（關東煮）、熱焙茶、熱美式咖啡",
            "cultureShopping": "融入首里琉球城下町古樸風貌的傳統瓦頂特色門市",
            "keyTip": "自駕途中的黃金中繼歇腳點，伸展腿部筋骨、使用洗手間，避免長輩久坐僵硬"
      },
      "young": {
            "photoSpot": "琉球紅瓦風貌7-11店面打卡、沖繩限定商品合照",
            "trendyFood": "現打冰沙機特色思慕昔、沖繩香檸冰棒、自駕提神冰拿鐵",
            "shoppingNightlife": "限定零食補給、日本7-11限定保養品（雪肌粹）",
            "vibe": "快速便利、城下町特色建築",
            "keyTip": "15分鐘迅速快閃，補充足夠水分與提神飲料，準備直奔浦添PARCO CITY"
      },
      "harmony": {
            "score": 9.7,
            "advice": "自駕途中最貼心的中途如廁與伸展點，長輩上洗手間暖胃，年輕人買冰沙，精神奕奕繼續出發。",
            "splitMeetingPoint": "7-Eleven 門口停車場"
      }
},
    desc: "融入首里琉球城下町古樸風貌的7-Eleven，自駕途中短暫休息，買杯招牌冰咖啡、特色茶飲或限定小點心，準備前往浦添西海岸。",
    tips: "利用門市洗手間與ATM，車程約20分鐘直達浦添西海岸PARCO CITY。"
  },
  {
    id: "d4-4",
    day: 4,
    date: "2026/12/15",
    time: "11:17",
    name: "敘敘苑 沖繩浦添PARCO CITY店",
    nameZh: "敘敘苑 燒肉 浦添PARCO CITY店",
    nameJa: "叙々苑 沖縄浦添パルコシティ店",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "food",
    categoryLabel: "頂級海景燒肉",
    icon: "🥩",
    lat: 26.2589,
    lng: 127.6972,
    address: "沖縄県浦添市西洲3-1-1 サンエー浦添西海岸 PARCO CITY 3F",
    mapCode: "33 339 024*42",
    googleQuery: "叙々苑 沖縄浦添パルコシティ店",
    tags: ["海景第一排", "東京燒肉之王", "午間超值套餐", "極品牛舌"],
        generation: {
      "senior": {
            "walkingLoad": "商場室內平坦直達 (<300步)",
            "walkingScore": "green",
            "seatingRest": "落地窗海景高檔皮質包廂沙發，下吸式無煙烤爐，完全無油煙味",
            "foodHighlights": "油花均勻柔嫩的和牛燒肉、招牌特製敘敘苑沙拉、海帶芽清湯、爽口泡菜與餐後冰淇淋",
            "cultureShopping": "享受西海岸海景第一排尊榮用餐體驗，肉質軟嫩多汁完全不費牙力",
            "keyTip": "中午限定超值套餐CP值極高；肉品油花細膩軟嫩，長輩吃得驚喜讚不絕口"
      },
      "young": {
            "photoSpot": "無敵西海岸蔚藍落地窗海景配頂級燒肉同框大片、油花粉嫩牛五花與牛舌特寫",
            "trendyFood": "東京燒肉王者之尊、招牌特選和牛牛五花、薄切蔥鹽牛舌、餐後愛心造型冰淇淋",
            "shoppingNightlife": "頂級奢華味蕾享受、社群打卡必爆人氣話題",
            "vibe": "奢華尊榮、無敵海景、極致美味",
            "keyTip": "海景窗邊席位極度熱門，建議11:00開門即前往排隊候位，或提早透過官網預約"
      },
      "harmony": {
            "score": 9.9,
            "advice": "海景頂級燒肉老少皆陶醉！長輩坐在無煙海景包廂享受入口即化軟嫩和牛，全家同享最奢華午餐時光。",
            "splitMeetingPoint": "PARCO CITY 3F 敘敘苑餐廳門口"
      }
},
    desc: "日本奢華燒肉代表「敘敘苑」進駐沖繩海景第一排！坐在面朝西海岸無邊蔚藍的落地窗席，細細品味油花勻稱的頂級特選牛五花、招牌敘敘苑特製沙拉、Q彈牛舌與精緻甜點，午間套餐CP值極高！",
    tips: "窗景座位極度熱門，建議提早於11:00前至店門口排隊或事前預約；飯後薄荷糖是經典招牌。"
  },
  {
    id: "d4-5",
    day: 4,
    date: "2026/12/15",
    time: "12:21",
    name: "SAN-A浦添西海岸 PARCO CITY",
    nameZh: "SAN-A 浦添西海岸 PARCO CITY",
    nameJa: "サンエー浦添西海岸 PARCO CITY",
    duration: "停留 05時00分",
    durationMinutes: 300,
    category: "shopping",
    categoryLabel: "沖繩最大購物旗艦",
    icon: "🛍️",
    lat: 26.2588,
    lng: 127.6975,
    address: "沖縄県浦添市西洲3-1-1",
    mapCode: "33 339 024*42",
    googleQuery: "サンエー浦添西海岸 PARCO CITY",
    tags: ["停留5小時", "250間店鋪", "Loft/3COINS", "無敵海景商城", "退稅服務中心"],
        generation: {
      "senior": {
            "walkingLoad": "平緩寬闊 (依體力自由調整 1500~2500步)",
            "walkingScore": "yellow",
            "seatingRest": "沖繩最大海景商場，每層樓面海側皆設有超大軟皮觀海休憩沙發區，冷氣恆溫舒適",
            "foodHighlights": "美食廣場有道地沖繩料理、熱湯麵、和風綠茶甜點，餐飲選擇超豐富",
            "cultureShopping": "無印良品全沖繩最大旗艦店、特色沖繩產物館、精緻生活雜貨",
            "keyTip": "停留5小時的秘訣：長輩在海景沙發區坐看西海岸波光放鬆，或在無印良品慢步，完全不累"
      },
      "young": {
            "photoSpot": "全落地海景商場廊道、超大潮流店鋪打卡、夕陽西海岸金黃光影",
            "trendyFood": "A&W美式漢堡、一風堂、貢茶、限定甜品手搖飲",
            "shoppingNightlife": "250間名店瘋狂血拼！Loft、3COINS+plus、ABC-MART GRAND STAGE限定鞋、BEAMS、ZARA",
            "vibe": "全沖繩最大最齊全潮流商場、退稅中心一站搞定、5小時買到手軟",
            "keyTip": "2F設有外國旅客退稅中心，統一辦理各店退稅；1F設有免費大型置物櫃可寄存大包小包"
      },
      "harmony": {
            "score": 9.6,
            "advice": "「分流不走散」的最佳示範：長輩在海景沙發喝茶看海或逛無印良品，年輕人衝潮流服飾，約定90分鐘會合一次！",
            "splitMeetingPoint": "PARCO CITY 2F 海景觀景沙發區（退稅櫃台旁）"
      }
},
    desc: "沖繩規模最大、店鋪最全的海濱複合式巨型商城！整整5小時無死角血拼：無印良品超大門市、Loft生活雜貨、3COINS+plus、ABC-Mart Grand Stage、BEAMS、URBAN RESEARCH、ZARA等，走累了隨處都有落地玻璃窗可眺望西海岸海景！",
    tips: "2F設有外國遊客免稅服務專櫃，可統整全館發票辦理退稅；館內提供免費置物櫃可寄放大包小包。"
  },
  {
    id: "d4-6",
    day: 4,
    date: "2026/12/15",
    time: "17:39",
    name: "Workman Plus Urasoe Kyozuka",
    nameZh: "WORKMAN Plus 浦添經塚店",
    nameJa: "ワークマンプラス 浦添経塚店",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "shopping",
    categoryLabel: "機能工裝神店",
    icon: "🧥",
    lat: 26.2410,
    lng: 127.7208,
    address: "沖縄県浦添市字前田1064-1 (經塚站周邊)",
    mapCode: "33 253 456*11",
    googleQuery: "WORKMAN Plus 浦添経塚店",
    tags: ["日本爆紅神店", "防潑水風衣", "平價極致機能", "工裝休閒"],
        generation: {
      "senior": {
            "walkingLoad": "平緩小量販 (<600步)",
            "walkingScore": "green",
            "seatingRest": "店內通道平整，門口即有專屬平面停車場，下車直通",
            "foodHighlights": "周邊有超商與自動販賣機",
            "cultureShopping": "日本國民級平價機能神牌！一件輕便防潑水保暖外套僅1900-2900円，防滑耐磨健走鞋只要1500円",
            "keyTip": "價格便宜到不可思議，長輩挑選防風防雨保暖衣物毫無心理負擔，買得極有成就感"
      },
      "young": {
            "photoSpot": "Urban Outdoor工裝風穿搭鏡前照、超酷機能登山防潑水服飾特寫",
            "trendyFood": "商場周邊美食",
            "shoppingNightlife": "日本爆紅山系潮流穿搭、露營防風外套、超輕工裝機能褲、防水背包",
            "vibe": "平價極致機能、山系穿搭挖寶神店",
            "keyTip": "版型與尺寸容易缺貨，看到合適尺碼建議立即下手；價格是專櫃戶外品牌的四分之一"
      },
      "harmony": {
            "score": 9.6,
            "advice": "高性價比的實用購物點，長輩買防風保暖衣，年輕人買工裝山系潮服，45分鐘滿意結帳。",
            "splitMeetingPoint": "Workman Plus 門口收銀台旁"
      }
},
    desc: "近年橫掃日本時尚圈的平價機能之王！以專業工裝品質打造戶外露營、防風防潑水外套、休閒彈性長褲與防滑鞋履，價格驚人親民（一件防風外套僅約1900-2900日圓），深受戶外旅行者推崇！",
    tips: "尺寸容易斷碼，看到喜歡的款式與尺寸建議立即下手；附有免費停車場。"
  },
  {
    id: "d4-7",
    day: 4,
    date: "2026/12/15",
    time: "18:52",
    name: "Katsunoya Naha Main Place",
    nameZh: "かつ乃屋 那霸Main Place店",
    nameJa: "かつ乃屋 那覇メインプレイス店",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "food",
    categoryLabel: "酥脆日式炸豬排",
    icon: "🍱",
    lat: 26.2238,
    lng: 127.6948,
    address: "沖縄県那覇市おもろまち4丁目4-9 (那霸Main Place 1F)",
    mapCode: "33 188 560*22",
    googleQuery: "かつ乃屋 那覇メインプレイス店",
    tags: ["新都心Main Place", "日式厚切豬排", "高麗菜絲免費續", "酥脆爽口"],
        generation: {
      "senior": {
            "walkingLoad": "商場室內平坦 (<300步)",
            "walkingScore": "green",
            "seatingRest": "那霸Main Place商場1F，寬敞舒適皮質沙發卡座，桌距大無壓迫感",
            "foodHighlights": "現磨白芝麻香氣高雅、熟成豬排金黃酥脆不油膩，越光米白飯、熱味噌湯與爽脆高麗菜絲免費續加",
            "cultureShopping": "日式連鎖精緻豬排文化，服務親切有禮，長輩吃得飽足舒心",
            "keyTip": "商場地下附設超大型室內免費停車場，搭乘電梯直達1F餐廳，免除戶外日曬風雨"
      },
      "young": {
            "photoSpot": "卡滋作響的黃金厚切炸豬排特寫、現磨白芝麻香氣蒸騰、大碗堆疊高麗菜絲",
            "trendyFood": "酥脆金黃日式熟成炸豬排、特製甘口/辛口雙醬汁、越光米白飯無限吃到飽",
            "shoppingNightlife": "位於新都心Main Place內，吃飽可順逛商場San-A超市與日系專櫃",
            "vibe": "日式家庭溫馨、經典酥脆豬排饗宴",
            "keyTip": "現磨芝麻混合特製豬排醬蘸著吃最道地；白飯與味噌湯皆可續加，大胃王年輕人首選"
      },
      "harmony": {
            "score": 9.7,
            "advice": "室內停車直通免受風雨，沙發寬大舒適，酥脆好咬的熟成豬排全家皆喜愛，飯後順道逛商場消食。",
            "splitMeetingPoint": "那霸Main Place 1F かつ乃屋門口"
      }
},
    desc: "新都心Main Place內的高人氣日式炸豬排專門店！精選熟成豬肉裹上生麵包粉酥炸至金黃酥脆，咬下去卡滋作響，肉質鮮嫩彈牙。白飯、味噌湯與爽口高麗菜絲皆可免費續添！",
    tips: "搭配特製豬排醬與現磨白芝麻更添香氣；位於Main Place內方便順道逛超市與服飾店。"
  },
  {
    id: "d4-8",
    day: 4,
    date: "2026/12/15",
    time: "20:03",
    name: "沖繩豬排小やじ 那霸店",
    nameZh: "豚かつ 小やじ 那霸店 (隱藏版極品阿古豬)",
    nameJa: "豚かつ 小やじ (Tonkatsu Koyaji)",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "food",
    categoryLabel: "私房職人豬排",
    icon: "🥢",
    lat: 26.2148,
    lng: 127.6912,
    address: "沖縄県那覇市牧志",
    mapCode: "33 158 544*77",
    googleQuery: "豚かつ 小やじ 那覇",
    tags: ["阿古豬專賣", "低溫慢炸熟成", "夢幻粉嫩肉質", "老饕私藏居酒屋"],
        generation: {
      "senior": {
            "walkingLoad": "短街巷弄 (<300步)",
            "walkingScore": "green",
            "seatingRest": "日式居酒屋精巧原木桌位，溫馨寧靜，環境乾淨雅致",
            "foodHighlights": "嚴選沖繩頂級純種阿古豬，以「低溫慢炸熟成工法」烹調，肉質軟嫩無筋無腥味，油脂清甜化口不油膩",
            "cultureShopping": "體驗沖繩職人對阿古豬的最高敬意與料理極致追求",
            "keyTip": "不同於高溫硬脆炸豬排，低溫慢炸保留了肉質的細嫩水份，非常適合長輩牙口品嚐"
      },
      "young": {
            "photoSpot": "夢幻粉嫩肉質玫瑰色橫切面、日式精緻居酒屋暖簾打卡、阿古豬特上定食全景",
            "trendyFood": "沖繩排隊老饕口袋名單、極品阿古豬特上炸豬排、蘸沖繩海鹽與現磨山葵、沖繩Orion生啤酒",
            "shoppingNightlife": "居酒屋微醺氛圍、隱藏版美食朝聖、夜晚小酌首選",
            "vibe": "職人低溫料理、老饕私藏秘店、微醺溫暖夜",
            "keyTip": "座位較精巧，建議提早於晚餐開始前抵達，推薦搭配一杯沖繩在地生啤酒共度美食之夜"
      },
      "harmony": {
            "score": 9.6,
            "advice": "沖繩最頂級的阿古豬體驗，低溫粉嫩肉質讓長輩驚艷軟嫩，年輕人享受老饕朝聖的儀式感。",
            "splitMeetingPoint": "豚かつ 小やじ 店門口日式暖簾前"
      }
},
    desc: "老饕才懂得找尋的極品炸豬排居酒屋！嚴選沖繩頂級阿古豬，採用高超的低溫慢炸烹調法，肉質保留最誘人的粉嫩玫瑰色，油脂甘甜化口、肉汁滿溢，搭配特選海鹽與芥末，一嚐難忘！",
    tips: "店內座位精巧溫馨，適合點份特上炸豬排搭配沖繩在地生啤酒或泡盛共度美味夜晚。"
  },
  {
    id: "d4-9",
    day: 4,
    date: "2026/12/15",
    time: "21:32",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (最後夜宿整理)",
    nameJa: "オーシャンツリー",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "hotel",
    categoryLabel: "旅宿晚安",
    icon: "🌙",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["打包行李", "行李秤重", "最後一晚"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "在Ocean Tree的最後一晚！整理過去四天滿載的購物戰利品，進行行李箱秤重分裝，確認重要護照證件與明天的還車航班流程，在海浪聲中進入甜美夢鄉。",
    tips: "液體類（泡盛、保養品、化妝水）務必打包托運，隨身僅帶必要證件與貴重物品。"
  },

  // DAY 5 (2026/12/16)
  {
    id: "d5-1",
    day: 5,
    date: "2026/12/16",
    time: "08:00",
    name: "Ocean Tree",
    nameZh: "Ocean Tree (退房手續・告別海之樹)",
    nameJa: "オーシャンツリー",
    duration: "停留 02時00分",
    durationMinutes: 120,
    category: "hotel",
    categoryLabel: "退房告別",
    icon: "🧳",
    lat: 26.1360,
    lng: 127.6780,
    address: "沖縄県糸満/南部海岸エリア",
    mapCode: "232 456 123*45",
    googleQuery: "Ocean Tree Okinawa",
    tags: ["2小時打包退房", "海景道別", "全車上行李"],
        generation: {
      "senior": {
            "walkingLoad": "輕鬆無負擔",
            "walkingScore": "green",
            "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
            "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
            "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
            "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
            "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
            "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
            "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
            "vibe": "渡假Villa風、私密自在、極致放鬆",
            "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
            "score": 9.9,
            "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
            "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
},
    desc: "最後一天早晨！預留充足的2小時悠閒享受旅宿最後的海景晨光、拍照留念、徹底檢查房間有無遺漏充電線或衣物，辦理Check-out將行李全數上車，開啟最終日採購與美食之旅。",
    tips: "檢查後車廂空間分配；隨身攜帶日幣零錢與加油收據準備午後還車。"
  },
  {
    id: "d5-2",
    day: 5,
    date: "2026/12/16",
    time: "10:08",
    name: "道之驛 豐崎",
    nameZh: "道之驛 豐崎 (日本最西端道之驛)",
    nameJa: "道の駅 豊崎 (菜々色畑)",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "shopping",
    categoryLabel: "小農伴手禮",
    icon: "🥭",
    lat: 26.1585,
    lng: 127.6575,
    address: "沖縄県豊見城市字豊崎3-39",
    mapCode: "232 544 195*55",
    googleQuery: "道の駅 豊崎 Roadside Station Toyosaki",
    tags: ["日本最西端道の駅", "小農生鮮", "手作黑糖", "地產地消"],
        generation: {
      "senior": {
            "walkingLoad": "平坦單層小市集 (<500步)",
            "walkingScore": "green",
            "seatingRest": "館內附設觀光情報中心，設有冷氣休憩桌椅與茶水設備",
            "foodHighlights": "日本最西端之道之驛！農夫清晨現摘新鮮蔬果、柴燒古法黑糖、沖繩海藻、特產小農調味料",
            "cultureShopping": "長輩最愛的「地產地消」在地小農市集，天然純黑糖與手作果醬送禮自用兩相宜",
            "keyTip": "物美價廉，價格遠比市區免稅店親民，清晨新鮮採摘，長輩在此挑選天然食材格外興奮"
      },
      "young": {
            "photoSpot": "日本最西端「道の駅」紀念立牌合影打卡、在地特色小農包裝商品特寫",
            "trendyFood": "現挖沖繩芒果雪酪冰淇淋、道之驛限定手工黑糖小餅乾",
            "shoppingNightlife": "特色地方文創貼紙、道之驛紀念章收集、手作辣油伴手禮",
            "vibe": "質樸在地小農風、日本最西端紀念打卡點",
            "keyTip": "館內設有觀光導覽中心，可免費蓋上日本最西端道之驛紀念戳章留念"
      },
      "harmony": {
            "score": 9.7,
            "advice": "最後一天返台前採買天然小農特產的私房寶地，長輩挑純手工柴燒黑糖，年輕人蓋紀念章吃冰淇淋，收穫豐富。",
            "splitMeetingPoint": "道之驛「菜々色畑」大門入口木造休息區"
      }
},
    desc: "獲認證為日本最西端之道之驛！館內「菜菜色畑」販售沖繩南部農家清晨現採的新鮮蔬果、手工柴燒黑糖、芒果乾、紅芋脆片與特產調味料，是挑選道地小農伴手禮的絕佳私房寶地。",
    tips: "附設觀光情報中心，可拿取最新沖繩旅遊地圖與機場最新指引資訊。"
  },
  {
    id: "d5-3",
    day: 5,
    date: "2026/12/16",
    time: "11:20",
    name: "永忘 那霸店",
    nameZh: "永旺 那霸店 (AEON 那霸小祿店)",
    nameJa: "イオン那覇店 (AEON Naha Store)",
    duration: "停留 03時00分",
    durationMinutes: 180,
    category: "shopping",
    categoryLabel: "最後採買衝刺",
    icon: "🛒",
    lat: 26.1965,
    lng: 127.6668,
    address: "沖縄県那覇市金城5丁目10-2 (單軌小祿站直通)",
    mapCode: "33 095 154*14",
    googleQuery: "イオン那覇店 AEON Naha",
    tags: ["直通小祿站", "專屬免稅櫃台", "沖繩伴手禮總匯", "大型超市"],
        generation: {
      "senior": {
            "walkingLoad": "大型綜合商場 (1200~1800步)",
            "walkingScore": "yellow",
            "seatingRest": "各樓層走道設有沙發座椅，全棟無障礙坡道與直通電梯齊全",
            "foodHighlights": "B1F超大型超市生鮮區，當季日本水果、熟食壽司便當、日式綠茶與保健飲品",
            "cultureShopping": "沖繩名產總匯專區：雪鹽金楚糕、辣蝦餅、黑糖塊、泡盛酒一站購齊，附專屬免稅打包服務",
            "keyTip": "直通單軌小祿站，且備有室內大型免費停車場；推車可直接推至後車廂裝箱，免搬重物"
      },
      "young": {
            "photoSpot": "滿坑滿谷的沖繩伴手禮陳列牆、限定日系零食展示",
            "trendyFood": "超市特大草莓盒、日系甜甜圈、特色飲料、生鮮熟食",
            "shoppingNightlife": "免稅藥妝店最後大掃貨、整箱日系泡麵零食帶回台灣、大創百圓店",
            "vibe": "返台前最終伴手禮大衝刺、一站式購足",
            "keyTip": "專屬外國人退稅櫃台辦理速度快，免稅專用透明袋打包整齊，直接裝進行李箱託運"
      },
      "harmony": {
            "score": 9.8,
            "advice": "返台前最後一站採購，室內停車場不怕風吹日曬，長輩與年輕人把所有送親朋好友的伴手禮在此全數搞定！",
            "splitMeetingPoint": "AEON 那霸店 1F 沖繩特產免稅專區服務台"
      }
},
    desc: "行程文字註記之「永忘 那霸店」即為與單軌小祿站直通的超大型「AEON 永旺 那霸店」！離機場僅約8分鐘車程，擁有專屬免稅櫃台，可一口氣掃購雪鹽餅乾、辣蝦餅、黑糖、泡盛、藥妝與各款限定商品，作返台前最後的大衝刺！",
    tips: "地下1F設有大型超市與伴手禮專區；館內室內停車場車位充足不怕日曬。"
  },
  {
    id: "d5-4",
    day: 5,
    date: "2026/12/16",
    time: "14:23",
    name: "琉球新麵 通堂 小祿本店",
    nameZh: "琉球新麵 通堂 小祿本店 (男人麵・女人麵)",
    nameJa: "琉球新麺 通堂 小禄本店",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "food",
    categoryLabel: "拉麵傳奇收尾",
    icon: "🍜",
    lat: 26.1973,
    lng: 127.6675,
    address: "沖縄県那覇市金城5-4-6 (AEON那霸店斜對面)",
    mapCode: "33 095 245*88",
    googleQuery: "琉球新麺 通堂 小禄本店",
    tags: ["沖繩第一拉麵", "男味濃豚骨", "女味清鹽雞湯", "無限免費辣豆芽"],
        generation: {
      "senior": {
            "walkingLoad": "平坦極短 (<100步)",
            "walkingScore": "green",
            "seatingRest": "店內日式桌席座位舒適，出餐神速翻桌快，免去漫長等待",
            "foodHighlights": "招牌「女人麵（おんな味）」：採用久米島天然海鹽與老母雞高湯精心熬煮，金黃清澈甘醇完全不油膩，細麵滑順；桌上無限量特製醃漬辣豆芽爽脆開胃",
            "cultureShopping": "沖繩拉麵界始祖名店，體驗日本拉麵的溫暖職人精神",
            "keyTip": "女人麵的鹽味雞湯清雅甘潤，完全打破長輩對日本拉麵太鹹太油的刻板印象，長輩讚不絕口"
      },
      "young": {
            "photoSpot": "通堂經典招牌雙碗對比、投幣式食券機點餐特寫、滿桌無限量享用辣豆芽小菜罐",
            "trendyFood": "招牌「男人麵（おとこ味）」：黑蒜濃郁豚骨高湯香氣爆棚、溏心蛋、炙燒叉燒肉大口過癮",
            "shoppingNightlife": "就在AEON那霸店斜對面，吃飽直接前往機場還車，動線完美順暢",
            "vibe": "傳奇拉麵雙重奏、濃郁與清爽的完美對決",
            "keyTip": "投幣式食券機可點餐加料；桌上的涼拌辣豆芽是全沖繩拉麵界最著名的小菜，免費無限續加"
      },
      "harmony": {
            "score": 9.9,
            "advice": "男女雙麵設計是跨世代拉麵的完美解法！長輩享用清爽女人麵，年輕人大啖濃醇男人麵，為旅途劃下完美句點！",
            "splitMeetingPoint": "通堂拉麵小祿本店門口長凳"
      }
},
    desc: "沖繩最具代表性的傳奇拉麵名店！就在AEON那霸店斜對面。招牌「男味」濃郁黑蒜豚骨高湯搭配特選叉燒，「女味」則是以久米島天然海鹽熬煮的清雅金黃雞湯；桌上無限量享用的特製辣豆芽爽脆開胃，為沖繩美食之旅畫下完美句點！",
    tips: "門口採投幣式食券機點餐；若遇排隊通常翻桌率極快，15-20分鐘即可入座。"
  },
  {
    id: "d5-5",
    day: 5,
    date: "2026/12/16",
    time: "15:27",
    name: "Toyota租車沖繩那霸機場店（還車處）",
    nameZh: "Toyota租車 那霸機場店 (還車處)",
    nameJa: "トヨタレンタカー 那覇空港店 (返却)",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "transport",
    categoryLabel: "還車手續",
    icon: "⛽",
    lat: 26.1915,
    lng: 127.6590,
    address: "沖縄県那覇市赤嶺2丁目13-1",
    mapCode: "33 064 577*55",
    googleQuery: "Toyota Rental Car Naha Airport Branch Return",
    tags: ["加滿油歸還", "出示加油單據", "免費機場接駁車"],
        generation: {
      "senior": {
            "walkingLoad": "極低 (<200步)",
            "walkingScore": "green",
            "seatingRest": "營業所設有寬敞冷氣候車室與洗手間，沙發充足舒適",
            "foodHighlights": "候車室提供熱茶與常溫水",
            "cultureShopping": "工作人員熱情協助提搬大件行李上專屬接駁巴士，服務體貼溫馨",
            "keyTip": "緊鄰指定ENEOS加油站，加滿油（Regular）後50公尺直接進場，還車驗車5分鐘搞定"
      },
      "young": {
            "photoSpot": "自駕完結儀表板里程數拍照、滿油收據確認、豐田租車站合影",
            "trendyFood": "自駕旅程圓滿完工的輕鬆感",
            "shoppingNightlife": "搭乘免費冷氣接駁巴士直達國際線航廈出發層",
            "vibe": "高效率還車、平安滿載而歸",
            "keyTip": "保留加油發票供查驗；檢查座位前後、副駕手套箱與車門置物槽避免遺留隨身手機充電線"
      },
      "harmony": {
            "score": 9.9,
            "advice": "年輕人處理驗車與油單核對，長輩坐在冷氣候車室稍事休息，隨後一同搭乘接駁車直達航廈門口。",
            "splitMeetingPoint": "豐田租車還車營業所接駁巴士乘車處"
      }
},
    desc: "自駕行程順利返抵豐田租車那霸機場店。鄰近加油站依約加滿汽油（出示加油發票或收據供工作人員查驗），檢查車廂座位有無遺落行李，完成驗車後搭乘免費專車接駁至那霸機場國際線航廈。",
    tips: "店舖旁即有ENEOS加油站，加滿油（油種：レギュラー Regular）並保留完整收據。"
  },
  {
    id: "d5-6",
    day: 5,
    date: "2026/12/16",
    time: "16:50",
    name: "那霸機場",
    nameZh: "那霸機場 國際線航廈 (返程返台)",
    nameJa: "那覇空港 国際線ターミナル (OKA)",
    duration: "停留 01時00分",
    durationMinutes: 60,
    category: "transport",
    categoryLabel: "登機返台",
    icon: "✈️",
    lat: 26.2065,
    lng: 127.6465,
    address: "沖縄県那覇市鏡水150",
    mapCode: "33 123 279*00",
    googleQuery: "Naha Airport International Terminal OKA",
    tags: ["國際線託運", "DFS免稅提貨", "機場最後買伴手禮", "旅途平安返台"],
        generation: {
      "senior": {
            "walkingLoad": "平坦航廈動線 (800~1200步)",
            "walkingScore": "green",
            "seatingRest": "國際線出發大廳與登機候機區設有大量視野極佳的觀景軟椅，無障礙電梯便利",
            "foodHighlights": "機場管制區內茶座、免稅糕點試吃、溫熱熱茶",
            "cultureShopping": "管制區內DFS免稅提貨櫃台「一鍵領取」第3天採購的精品，免隨車搬運；免稅店補買Royce生巧與紅芋塔",
            "keyTip": "動線簡單清晰，各處均有繁體中文標示，長輩推著隨身小行李悠閒登機，平安返台"
      },
      "young": {
            "photoSpot": "候機大廳大片玻璃窗前停機坪客機打卡、登機證與蔚藍跑道合影、滿滿免稅提袋開箱",
            "trendyFood": "自動販賣機最後喝一瓶沖繩香檸氣泡水、Blue Seal最後一支冰淇淋",
            "shoppingNightlife": "免稅店最後衝刺補貨、提領DFS精品戰利品、退稅清點",
            "vibe": "依依不捨的南國蔚藍回憶、滿載而歸的成就感",
            "keyTip": "國際線請於起飛前2至2.5小時抵達；DFS提貨櫃台出示提貨券迅速領貨"
      },
      "harmony": {
            "score": 9.8,
            "advice": "留足2小時從容通關，長輩在登機門前坐著看飛機起降休息，年輕人提領免稅品，全家平平安安快樂返台！",
            "splitMeetingPoint": "那霸機場國際線出發大廳中央服務台"
      }
},
    desc: "抵達那霸機場辦理航空公司登機報到與行李託運手續。通關後至DFS免稅提貨櫃台領取第3天採購的免稅商品，候機期間可在機場免稅店補買Royce生巧克力、沖繩紅芋塔，帶著滿滿戰利品與蔚藍回憶登機返台！",
    tips: "國際線建議於起飛前2小時至2.5小時完成報到；托運行李注意重量限制。"
  }
];

const PACKING_CHECKLIST_DATA = [
  { id: "p1", category: "documents", categoryName: "重要證件與金融", text: "台灣駕照正本 (自駕不可或缺，千萬不可忘記！)", essential: true },
  { id: "p2", category: "documents", categoryName: "重要證件與金融", text: "日文譯本 (監理所申辦有效期限內，非國際駕照！)", essential: true },
  { id: "p3", category: "documents", categoryName: "重要證件與金融", text: "護照 (有效期需6個月以上)", essential: true },
  { id: "p4", category: "documents", categoryName: "重要證件與金融", text: "日本Visit Japan Web入境QR Code截圖備存", essential: true },
  { id: "p5", category: "documents", categoryName: "重要證件與金融", text: "信用卡 (回饋高/免海外手續費卡片至少2張)", essential: true },
  { id: "p6", category: "documents", categoryName: "重要證件與金融", text: "日圓現金 (部分小吃、神社御守與停車場需現金)", essential: true },
  { id: "p7", category: "documents", categoryName: "重要證件與金融", text: "台灣好市多Costco實體會員卡 (第1天採購必備)", essential: true },
  
  { id: "p8", category: "electronics", categoryName: "3C電器與自駕", text: "日本eSIM卡或實體漫遊網卡 (網路通暢最重要)", essential: true },
  { id: "p9", category: "electronics", categoryName: "3C電器與自駕", text: "行動電源 (需隨身攜帶上飛機，禁止托運)", essential: true },
  { id: "p10", category: "electronics", categoryName: "3C電器與自駕", text: "車用手機支架 (自駕導航看Google Maps極度實用)", essential: false },
  { id: "p11", category: "electronics", categoryName: "3C電器與自駕", text: "Type-C / Lightning充電線與車用點菸器轉接頭", essential: false },
  { id: "p12", category: "electronics", categoryName: "3C電器與自駕", text: "便攜式行李電子秤 (最後兩天血拼秤重必備)", essential: false },

  { id: "p13", category: "clothing", categoryName: "衣物穿搭", text: "防風連帽薄外套 (12月沖繩海風強勁、早晚偏涼)", essential: true },
  { id: "p14", category: "clothing", categoryName: "衣物穿搭", text: "洋蔥式好穿脫長袖/短袖上衣、舒適長褲", essential: true },
  { id: "p15", category: "clothing", categoryName: "衣物穿搭", text: "好走運動布鞋 (PARCO CITY逛5小時與市場走路必備)", essential: true },
  { id: "p16", category: "clothing", categoryName: "衣物穿搭", text: "抗UV太陽眼鏡 (白天海島駕車與陽光海景必備)", essential: false },

  { id: "p17", category: "convenience", categoryName: "便利好物與生活", text: "折疊大容量購物袋/行李軟袋 (好市多與商場戰利品)", essential: true },
  { id: "p18", category: "convenience", categoryName: "便利好物與生活", text: "隨身純水濕紙巾 (海鮮魚市場與路邊小吃必備)", essential: false },
  { id: "p19", category: "convenience", categoryName: "便利好物與生活", text: "個人常備藥品 (胃腸藥、止痛藥、暈車藥、OK繃)", essential: false },
  { id: "p20", category: "convenience", categoryName: "便利好物與生活", text: "晴雨兩用摺疊傘 (應對偶發海島陣雨)", essential: false }
];

const TRAVEL_TIPS = {
  weather: {
    tempRange: "16°C ~ 22°C",
    season: "初冬海島乾爽涼爽氣候",
    clothing: "早晚海風大，白天天氣晴朗舒適。推薦「洋蔥式穿法」：短袖或薄長袖內搭，外加一件輕便防風外套，兼顧室內商場暖氣與海邊海風。",
    highlights: [
      "12月是沖繩乾季，降雨天數遠少於夏季颱風季，是自駕旅遊的好時節。",
      "海風吹拂時體感溫度會稍低3-4度，尤其在美國村海濱、美麗SUN海灘及瀨長島務必穿防風外套。",
      "冬季海水偏涼不建議下水游泳，但沙灘漫步與看飛機視野極佳。"
    ]
  },
  driving: {
    side: "日本左側通行 (右駕)",
    essentials: "台灣旅客需同時備齊「台灣有效駕照正本」與「日文譯本正本」（監理所申辦，非國際駕照！）。",
    rules: [
      { title: "轉彎口訣", desc: "牢記「左小轉、右大轉」；右轉時必須在路口中心等候，禮讓對向直行車輛全部通過後方能轉彎。" },
      { title: "方向燈與雨刷", desc: "日系車方向燈撥桿在右手邊，雨刷在左手邊。初期容易誤刷雨刷，放慢動作即可。" },
      { title: "行人絕對優先", desc: "無號誌或綠燈路口，若有行人踏上斑馬線，必須完全靜止停下等待行人通過。" },
      { title: "導航 MapCode", desc: "本網站每站皆已標記專屬 MapCode，上車輸入車機即可精準導航，亦可搭配 Google Maps。" },
      { title: "還車滿油規定", desc: "最後一天還車前，必須在營業所附近指定加油站加滿油（滿タン，Regular汽油），保留發票核對。" }
    ]
  },
  foodBucketList: [
    { name: "沖繩麵 (ソーキそば)", desc: "傳統甘甜柴魚高湯與入口即化豬軟骨，田舍與EIBUN雙派系必吃", icon: "🍲" },
    { name: "現剖生魚片與焗烤龍蝦", desc: "糸滿魚市場一盒300-500円銅板價，爽吃甜蝦、海膽與現開生蠔", icon: "🍣" },
    { name: "敘敘苑海景午間燒肉", desc: "PARCO CITY落地窗賞西海岸蔚藍海景，頂級牛舌與極品牛五花", icon: "🥩" },
    { name: "奶油香煎時令鮮魚", desc: "糸滿漁民食堂招牌鐵板奶油蒜香煎魚，外皮焦香酥脆、魚肉多汁鮮美", icon: "🐟" },
    { name: "琉球新麵 通堂", desc: "經典男味黑蒜豚骨與女味久米島天然鹽味雞湯，滿桌免費辣豆芽", icon: "🍜" },
    { name: "沖繩阿古豬炸豬排", desc: "かつ乃屋金黃酥脆與小やじ極品低溫慢炸熟成粉嫩阿古豬排", icon: "🍱" },
    { name: "南城好市多限定熟食", desc: "沖繩首店限定風味美式熱狗披薩與牛肉捲", icon: "🍕" }
  ]
};


// ============================================================================
// SPOTS CATALOG (Comprehensive Unique Spots for Itinerary Planning)
// ============================================================================
const SPOTS_CATALOG = [
  {
    "id": "spot-toyota",
    "name": "Toyota Rental Car Naha Airport Branch",
    "nameZh": "Toyota租車 沖繩那霸機場店",
    "nameJa": "トヨタレンタカー 那覇空港店",
    "category": "transport",
    "categoryLabel": "自駕租還",
    "icon": "🚗",
    "lat": 26.1915,
    "lng": 127.659,
    "address": "沖縄県那覇市赤嶺2丁目13-1",
    "mapCode": "33 064 577*55",
    "defaultDurationMinutes": 60,
    "tags": [
      "機場接駁",
      "右駕取車",
      "保險加保"
    ],
    "desc": "那霸機場專屬免費接駁巴士直達，辦理右駕交車手續與導航確認。",
    "generation": {
      "senior": {
        "walkingLoad": "輕鬆極低 (<500步)",
        "walkingScore": "green",
        "seatingRest": "營業所設有寬敞冷氣候車沙發與茶水機，無需站立等候",
        "foodHighlights": "備有常溫及冰熱飲水機、周邊有便利商店可買熱茶",
        "cultureShopping": "提供中文版日本交通規則手冊與右駕注意事項，資訊安心透明",
        "keyTip": "搭乘免費專屬低底盤接駁車從航廈直達，後車廂寬大免手提大行李，長輩在沙發休息由年輕人辦理交車手續"
      },
      "young": {
        "photoSpot": "嶄新豐田休旅/油電車交車出發合影，記錄沖繩自駕啟程",
        "trendyFood": "車載手機連線即時導航，準備前往第一站美食",
        "shoppingNightlife": "免去排隊等待，快速電子化驗車與加購安心全險(NOC)",
        "vibe": "高科技、高效率、現代化自駕探索起點",
        "keyTip": "確認車載藍牙連線成功、連接CarPlay/Android Auto，出發前設定首站MapCode"
      },
      "harmony": {
        "score": 9.8,
        "advice": "年輕人負責櫃台簽約與車況錄影檢查；長輩在候車室安坐歇息喝茶，省去排隊勞頓。",
        "splitMeetingPoint": "那霸機場營業所一樓冷氣大廳沙發區"
      }
    }
  },
  {
    "id": "spot-san-a-shiozaki",
    "name": "San-A Shiozaki City",
    "nameZh": "SAN-A 潮崎購物城 (San-A Shiozaki)",
    "nameJa": "サンエー しおざきシティ",
    "category": "shopping",
    "categoryLabel": "量販補給",
    "icon": "🛒",
    "lat": 26.1305,
    "lng": 127.671,
    "address": "沖縄県糸満市潮崎町2丁目2",
    "mapCode": "232 425 447*88",
    "defaultDurationMinutes": 60,
    "tags": [
      "南部超大型超市",
      "隨車補給",
      "日本水果"
    ],
    "desc": "南部在地人最信賴的連鎖大型綜合商場，採購當季水果、茶飲、零食與日常物資。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩輕鬆 (<1000步)",
        "walkingScore": "green",
        "seatingRest": "全平面單層動線無樓梯門檻，附設休息座椅與乾淨洗手間",
        "foodHighlights": "日本產地直送草莓、青森蜜柑、無糖Sanpin茶、現烤日式米餅",
        "cultureShopping": "在地沖繩長壽食材、天然海鹽、隨身常備喉糖與健康飲品",
        "keyTip": "平面超大型免費停車場，下車直接推推車進入，長輩挑選當季水果極為開心"
      },
      "young": {
        "photoSpot": "各色日本零食飲料陳列牆、沖繩限定風味餅乾",
        "trendyFood": "沖繩限定Orion風味微醺沙瓦、限定黑糖洋芋片、冰滴咖啡",
        "shoppingNightlife": "藥妝採購、隨身防曬噴霧、護唇膏、車用充電小物",
        "vibe": "道地日本生活感量販、隨車零食採購站",
        "keyTip": "採買隨車礦泉水、大包裝零食與宵夜飲料，價格比超商便宜30%"
      },
      "harmony": {
        "score": 9.6,
        "advice": "自駕首日補給站，長輩挑健康水果與熱茶，年輕人挑潮流零食，30-45分鐘迅速完成全車補給。",
        "splitMeetingPoint": "商場入口生鮮超市烘焙坊休息區"
      }
    }
  },
  {
    "id": "spot-ocean-tree",
    "name": "Ocean Tree Okinawa",
    "nameZh": "Ocean Tree (海之樹 旅宿基地)",
    "nameJa": "オーシャンツリー",
    "category": "hotel",
    "categoryLabel": "海景旅宿",
    "icon": "🏡",
    "lat": 26.136,
    "lng": 127.678,
    "address": "沖縄県糸満/南部海岸エリア",
    "mapCode": "232 456 123*45",
    "defaultDurationMinutes": 60,
    "tags": [
      "核心基地",
      "面海別墅",
      "舒適客廳",
      "放鬆身心"
    ],
    "desc": "旅程核心下榻別墅，位於沖繩南部臨海優美環境，早晚享受溫柔南國海風。",
    "generation": {
      "senior": {
        "walkingLoad": "輕鬆無負擔",
        "walkingScore": "green",
        "seatingRest": "海景客廳軟墊沙發、戶外觀海休閒椅、獨立安靜長輩主臥",
        "foodHighlights": "具備完整廚房設備，可燒煮熱水、沖泡日式煎茶或清淡熱湯",
        "cultureShopping": "清晨推開窗欣賞晨曦海景、遠離都市喧囂，身心完全放鬆",
        "keyTip": "門口專屬停車位直通玄關免搬運行李爬坡，早起長輩可在陽台享受海風晨運"
      },
      "young": {
        "photoSpot": "南國蔚藍海景落地窗大片陽光美照、溫馨客廳自拍、陽台黃昏打卡",
        "trendyFood": "好市多派對美食開箱、宵夜Orion生啤酒微醺時光",
        "shoppingNightlife": "寬敞客廳適合夜晚開箱戰利品、投影機看電影或分享當日美照",
        "vibe": "渡假Villa風、私密自在、極致放鬆",
        "keyTip": "衛浴分離設備極佳，多人梳洗化妝不排隊；客廳音響連線撥放海島Chill音樂"
      },
      "harmony": {
        "score": 9.9,
        "advice": "作為每日出發歸營基地，獨立臥室讓長輩早睡不被干擾，客廳空間讓年輕人自在暢聊，世代共融滿分！",
        "splitMeetingPoint": "Ocean Tree 海景大客廳"
      }
    }
  },
  {
    "id": "spot-costco-nanjo",
    "name": "Costco Wholesale Okinawa Nanjo",
    "nameZh": "COSTCO 好市多 沖繩南城倉庫店",
    "nameJa": "コストコホールセール 沖縄南城倉庫店",
    "category": "shopping",
    "categoryLabel": "巨型美式量販",
    "icon": "🛍️",
    "lat": 26.1558,
    "lng": 127.7712,
    "address": "沖縄県南城市つきしろ1071-1",
    "mapCode": "232 509 780*14",
    "defaultDurationMinutes": 120,
    "tags": [
      "沖繩首店",
      "熟食熱濃湯",
      "石垣牛烤肉",
      "限定特產"
    ],
    "desc": "2024全新開幕沖繩首間好市多！採買派對美食、沖繩黑糖點心、石垣牛肉排與限定商品。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩大空間 (1500~2000步)",
        "walkingScore": "yellow",
        "seatingRest": "熟食用餐區設有大量桌椅；全館無任何階梯門檻，推車好推",
        "foodHighlights": "熟食區招牌熱蛤蜊濃湯（濃郁暖胃）、石垣牛燒肉片、整盒當季日本草莓",
        "cultureShopping": "沖繩產黑糖特產大包裝、日本產健康養生堅果、深海魚油保健食品",
        "keyTip": "2024全新南城倉庫店，走道極寬不擁擠；建議長輩先至熟食區喝熱湯休息，避免逛太久"
      },
      "young": {
        "photoSpot": "沖繩首間好市多美式巨型貨架背景、巨型泰迪熊、大披薩打卡照",
        "trendyFood": "沖繩限定口味熟食披薩、特大牛肉捲、吉拿棒、派對特大壽司拼盤",
        "shoppingNightlife": "超值進口零食、整箱Orion啤酒、露營戶外用品超划算",
        "vibe": "美式大採購狂歡、社群開箱好物爆棚",
        "keyTip": "台灣Costco實體會員卡全球通用；熟食區免會員卡亦可由外側自助點餐機購買"
      },
      "harmony": {
        "score": 9.4,
        "advice": "年輕人負責推車穿梭快速選購派對食材，長輩在熟食區享用熱騰騰蛤蜊濃湯小憩，互不拖累。",
        "splitMeetingPoint": "好市多熟食餐飲用餐區（近收銀台處）"
      }
    }
  },
  {
    "id": "spot-american-village",
    "name": "Mihama American Village",
    "nameZh": "北谷美國村 週末煙火觀賞點",
    "nameJa": "美浜アメリカンビレッジ 花火ビューポイント",
    "category": "attraction",
    "categoryLabel": "美式海濱煙火",
    "icon": "🎆",
    "lat": 26.3165,
    "lng": 127.7565,
    "address": "沖縄県中頭郡北谷町美浜",
    "mapCode": "33 526 452*52",
    "defaultDurationMinutes": 90,
    "tags": [
      "週六限定煙火",
      "美式復古霓虹",
      "海濱棧道",
      "海景酒吧"
    ],
    "desc": "每週六晚間施放璀璨海濱煙火！在復古美式街道與棕櫚海風中享受浪漫夜空。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩海邊步道 (1000~1500步)",
        "walkingScore": "yellow",
        "seatingRest": "日落海灘堤防長廊設有大量休閒長椅，海景露天咖啡座避風舒適",
        "foodHighlights": "溫熱熱可可、香草花茶、海濱餐廳軟嫩牛排與清淡海鮮燉飯",
        "cultureShopping": "欣賞昔日美軍基地轉型之跨文化海濱商圈，感受南國浪漫晚風",
        "keyTip": "週六晚間煙火約施放3-5分鐘，在步道長椅坐著抬頭即可清楚觀賞，無需久站"
      },
      "young": {
        "photoSpot": "Depot Island霓虹燈美式復古街景、繽紛彩繪牆、海邊棧道煙火璀璨首排",
        "trendyFood": "海景餐酒館、精釀啤酒、美式漢堡、網紅Blue Seal冰淇淋",
        "shoppingNightlife": "美式古著服飾、沖繩特色文創潮T、海濱酒吧夜生活",
        "vibe": "美式復古浪漫、IG短影片熱門爆款地、週末狂歡夜",
        "keyTip": "日落海灘（Sunset Beach）堤防或Depot Island Boardwalk為最佳取景點，19:40前就位"
      },
      "harmony": {
        "score": 9.5,
        "advice": "提前抵達海濱景觀餐廳或堤防長椅就座，長輩喝熱飲吹海風賞景，年輕人漫步美街拍照，20:00共同看煙火。",
        "splitMeetingPoint": "Depot Island 海濱木棧道中央鐘樓下方"
      }
    }
  },
  {
    "id": "spot-itoman-fish",
    "name": "Itoman Fish Market",
    "nameZh": "糸滿魚市場 (道之驛糸滿魚市中心)",
    "nameJa": "糸満漁業協同組合 お魚センター",
    "category": "food",
    "categoryLabel": "產地現剖海鮮",
    "icon": "🍣",
    "lat": 26.1438,
    "lng": 127.6625,
    "address": "沖縄県糸満市西崎町4丁目19",
    "mapCode": "232 484 136*85",
    "defaultDurationMinutes": 90,
    "tags": [
      "現剖生魚片",
      "清甜魚湯",
      "焗烤海膽龍蝦",
      "大生蠔"
    ],
    "desc": "南部海鮮朝聖地！厚切生魚片、特大生蠔、海膽杯與現烤龍蝦，產地直送銅板價！",
    "generation": {
      "senior": {
        "walkingLoad": "平坦短距離 (<600步)",
        "walkingScore": "green",
        "seatingRest": "戶外遮陽用餐區設有百餘個長桌木椅，洗手台與衛生設施近在咫尺",
        "foodHighlights": "產地直送厚切生魚片、清甜魚骨味噌熱湯（300円超暖胃）、現蒸甜蝦、熟食海鮮煎餅",
        "cultureShopping": "沖繩南部漁港道地風情、隔壁農產物產館可買當季小農蔬果",
        "keyTip": "全室內單層魚市平整防滑，生魚片每盒僅300-500円，鮮度無敵且高蛋白少油膩，長輩早餐第一名"
      },
      "young": {
        "photoSpot": "滿滿海膽杯、焗烤龍蝦斷面秀、特大海生蠔鮮嫩特寫、海鮮珠寶盒合影",
        "trendyFood": "超浮誇整隻焗烤明太子海膽龍蝦、大生蠔佐檸檬、海膽鮭魚卵雙拼杯",
        "shoppingNightlife": "痛風餐拍照發限動吸睛度破表、現點現剖極致性價比",
        "vibe": "熱鬧喧騰、極致鮮美、在地老饕市集",
        "keyTip": "建議自備純水濕紙巾；各攤位可使用現金與多數電子支付，各挑一盒拼成豪華海鮮大餐"
      },
      "harmony": {
        "score": 9.9,
        "advice": "戶外座位充足，長輩先入座等候；年輕人穿梭各攤位挑選焗烤龍蝦與生魚片，全家同桌享用豐盛海味早餐！",
        "splitMeetingPoint": "魚市場大門口正對面遮陽木桌用餐區"
      }
    }
  },
  {
    "id": "spot-iias-toyosaki",
    "name": "iias Okinawa Toyosaki",
    "nameZh": "iias 沖繩豐崎 (大型海濱休閒商城)",
    "nameJa": "イーアス沖縄豊崎",
    "category": "shopping",
    "categoryLabel": "海濱巨型商城",
    "icon": "🏬",
    "lat": 26.1583,
    "lng": 127.6536,
    "address": "沖縄県豊見城市字豊崎3-35",
    "mapCode": "232 543 400*25",
    "defaultDurationMinutes": 150,
    "tags": [
      "Uniqlo大型店",
      "Loft生活雜貨",
      "2F海景露台",
      "免稅合併"
    ],
    "desc": "沖繩南部最新型海濱購物中心！集結時尚服飾、Loft雜貨、KOJIMA電器與海景沙發露台。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩商場 (<1500步，可隨時休息)",
        "walkingScore": "green",
        "seatingRest": "全棟無障礙、電梯多且寬敞，2F海景露台設有超舒適真皮軟沙發",
        "foodHighlights": "美食街有多家和風定食、烏龍麵熱湯、綠茶甜品、清淡日式便當",
        "cultureShopping": "Uniqlo/GU超大平價門市買防風機能衣、大國藥妝買長輩痠痛貼布與保健品",
        "keyTip": "2020年全新落成，空調舒適不悶熱，長輩在海景沙發看海喝咖啡，完全不累"
      },
      "young": {
        "photoSpot": "頂樓恐龍戶外主題海景園區、海景星巴克露天座位、透明無邊際打卡感",
        "trendyFood": "Eggs 'n Things夏威夷大鬆餅、日式排隊甜點、特色手搖飲",
        "shoppingNightlife": "Loft文具雜貨、KOJIMA Bic Camera免稅電器、日系流行服裝專櫃",
        "vibe": "現代時尚海濱巨城、血拼休閒一把抓",
        "keyTip": "館內各免稅專櫃可合併退稅，服務中心專人辦理；逛街與水族館一站雙享"
      },
      "harmony": {
        "score": 9.7,
        "advice": "約定於2F海景沙發露台為集合點，長輩看海休憩品茗，年輕人盡情血拼，90分鐘後會合，各得其所。",
        "splitMeetingPoint": "iias 2F 面海觀景露台（星巴克旁）"
      }
    }
  },
  {
    "id": "spot-dmm-aquarium",
    "name": "DMM Kariyushi Aquarium",
    "nameZh": "DMM Kariyushi水族館 (光影沉浸水族)",
    "nameJa": "DMMかりゆし水族館",
    "category": "attraction",
    "categoryLabel": "沉浸科技水族",
    "icon": "🐠",
    "lat": 26.1578,
    "lng": 127.6542,
    "address": "沖縄県豊見城市字豊崎3-35 (iias內2F)",
    "mapCode": "232 543 400*25",
    "defaultDurationMinutes": 45,
    "tags": [
      "數位光影",
      "透明玻璃步道",
      "近距離企鵝",
      "全室內平緩"
    ],
    "desc": "尖端光影科技與海洋生態結合，腳踏懸空透明玻璃俯視熱帶魚群，水母圓柱光影療癒。",
    "generation": {
      "senior": {
        "walkingLoad": "全室內平緩 (<800步)",
        "walkingScore": "green",
        "seatingRest": "水母光影展區與大型水槽前設有多處觀景座椅，可坐著靜心觀賞",
        "foodHighlights": "館內附設海島咖啡吧，提供熱花茶與清爽香檸氣泡水",
        "cultureShopping": "沉浸式琉球海洋生態，近距離觀察溫馴的熱帶魚與企鵝，節奏安詳療癒",
        "keyTip": "展館精緻緊湊（全程約30-45分鐘），全館無上下階梯（皆有無障礙坡道/電梯），長輩走起來零負擔"
      },
      "young": {
        "photoSpot": "腳下透明強化玻璃水槽懸空步道（俯視鯊魚魟魚）、夢幻變色水母柱、光影雨林",
        "trendyFood": "水族館限定海洋藍冰淇淋、企鵝造型點心",
        "shoppingNightlife": "觸摸池近距離摸海星海參、樹獺與大嘴鳥近距拍攝、數位互動APP集章",
        "vibe": "光影科技美學、新世代沉浸藝術、IG美拍神館",
        "keyTip": "腳下玻璃步道需脫鞋入內，手機拍照開啟超廣角俯拍，視覺張力極具未來感"
      },
      "harmony": {
        "score": 9.8,
        "advice": "場館小巧精美、動線流暢，長輩不會體力透支，年輕人拍出科技感美照，是跨世代滿意度最高景點之一！",
        "splitMeetingPoint": "水族館出口紀念品旗艦店前休息區"
      }
    }
  },
  {
    "id": "spot-chura-sun-beach",
    "name": "Toyosaki Seaside Park Chura-SUN Beach",
    "nameZh": "豐崎海濱公園 美麗SUN海灘",
    "nameJa": "豊崎美らSUNビーチ",
    "category": "attraction",
    "categoryLabel": "白沙觀機海灘",
    "icon": "🏖️",
    "lat": 26.1545,
    "lng": 127.6508,
    "address": "沖縄県豊見城市字豊崎5-1",
    "mapCode": "232 542 328*33",
    "defaultDurationMinutes": 45,
    "tags": [
      "700米白沙",
      "看客機起降",
      "遮陽涼亭",
      "防風慢步"
    ],
    "desc": "南部最寬廣人工白沙灘，漫步平坦步道，近距離仰望那霸機場客機劃過海空的震撼景象。",
    "generation": {
      "senior": {
        "walkingLoad": "平坦防滑海濱步道 (<800步)",
        "walkingScore": "green",
        "seatingRest": "沿岸設有多座遮陽涼亭與木製長椅，坐在亭下遠眺碧海藍天非常愜意",
        "foodHighlights": "自備保溫瓶熱茶，漫步海邊深呼吸南國清新海風",
        "cultureShopping": "沖繩南部最大型整建海濱公園，視野極其寬廣，心情豁然開朗",
        "keyTip": "就在iias商場正前方，車輛可停商場或公園；初冬海風略強，提醒長輩披上防風薄外套"
      },
      "young": {
        "photoSpot": "700米純白細沙灘漫步背影、那霸機場降落客機低空掠過海天的大景攝影",
        "trendyFood": "海灘咖啡小吧、香檸果汁、夕陽剪影特寫",
        "shoppingNightlife": "寬闊海景無遮蔽，落日時分粉紫金黃晚霞色彩變幻極美",
        "vibe": "放鬆純白沙灘、航空迷與攝影迷天堂",
        "keyTip": "客機每隔5-10分鐘就有一架掠過頭頂降落，手機連拍即可捕捉飛機與海灘同框神作"
      },
      "harmony": {
        "score": 9.6,
        "advice": "行程時間約30-40分鐘，涼亭下長輩吹風看海聊天，年輕人沙灘走走拍飛機起降，悠閒自在。",
        "splitMeetingPoint": "美麗SUN海灘中央管理棟前觀景涼亭"
      }
    }
  },
  {
    "id": "spot-itoman-gyomin",
    "name": "Itoman Gyomin Shokudo",
    "nameZh": "糸滿漁民食堂 (神級奶油香煎鮮魚)",
    "nameJa": "糸満漁民食堂",
    "category": "food",
    "categoryLabel": "石灰岩排隊名店",
    "icon": "🐟",
    "lat": 26.1472,
    "lng": 127.6656,
    "address": "沖縄県糸満市西崎町4丁目22-7",
    "mapCode": "232 484 797*30",
    "defaultDurationMinutes": 75,
    "tags": [
      "奶油香煎魚",
      "琉球石灰岩建築",
      "鮮魚定食",
      "熱魚湯"
    ],
    "desc": "在地老饕首選！招牌鐵板滋滋作響的時令奶油香煎鮮魚，外皮酥脆肉質細嫩，附鮮甜魚湯。",
    "generation": {
      "senior": {
        "walkingLoad": "平坦極短 (<200步)",
        "walkingScore": "green",
        "seatingRest": "室內日式榻榻米與木質桌椅，環境典雅安靜，排煙除味佳",
        "foodHighlights": "招牌時令鮮魚定食：肉質細嫩清甜、附濃郁鮮魚味噌湯與3道開胃小菜，營養少油",
        "cultureShopping": "琉球石灰岩傳統工藝堆砌外觀，極具文化底蘊與建築美感",
        "keyTip": "鮮魚刺少肉嫩，極為適合長輩牙口；蒜香或海苔奶油可依長輩喜好選擇清淡海苔風味"
      },
      "young": {
        "photoSpot": "鐵板端上桌時滋滋作響的熱氣升騰、金黃酥脆鮮魚外皮、石灰岩建築網美打卡",
        "trendyFood": "神級鐵板奶油香煎魚（魚のバター焼き），外皮酥脆香濃、魚肉多汁爆漿，排隊名店",
        "shoppingNightlife": "品嚐沖繩在地小農調味料、泡盛調味魚湯、社群狂讚朝聖店",
        "vibe": "排隊神級美食、職人手作溫暖氛圍",
        "keyTip": "晚間經常大排長龍，建議17:00前抵達或由年輕人先下車登記候位，長輩在車內等候叫號"
      },
      "harmony": {
        "score": 9.7,
        "advice": "熱騰騰現煎鮮魚定食老少咸宜，長輩吃得健康溫暖，年輕人嚐到極品奶油香氣，排隊登記分工更貼心。",
        "splitMeetingPoint": "糸滿漁民食堂候位門廳"
      }
    }
  },
  {
    "id": "spot-gokoku-shrine",
    "name": "Okinawa Gokoku Shrine",
    "nameZh": "沖繩縣護國神社",
    "nameJa": "沖縄県護国神社",
    "category": "attraction",
    "categoryLabel": "神社林蔭祈願",
    "icon": "⛩️",
    "lat": 26.2039,
    "lng": 127.6749,
    "address": "沖縄県那覇市奥武山町44",
    "mapCode": "33 126 127*41",
    "defaultDurationMinutes": 40,
    "tags": [
      "奧武山公園",
      "巨大紅色鳥居",
      "闔家平安御守",
      "平緩清幽"
    ],
    "desc": "坐落奧武山綠意林蔭間，巨大朱紅鳥居與開闊平緩參道，晨間清幽祈福求平安。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩林蔭參道 (<800步)",
        "walkingScore": "green",
        "seatingRest": "參道兩旁古木參天，林蔭遮陽，境內設有石椅可歇腳",
        "foodHighlights": "自備熱茶，在清新綠意森林芬多精中晨行",
        "cultureShopping": "祈求闔家平安、健康長壽、子孫行車平安御守，莊嚴清幽",
        "keyTip": "坐落奧武山公園內，參道平坦無陡峭階梯，附設免費平面停車場，下車直通神社"
      },
      "young": {
        "photoSpot": "巨大朱紅鳥居仰角構圖、日系傳統洗手舍（手水舍）淨手特寫、綠蔭石燈籠街道",
        "trendyFood": "抽特色神籤（御神籤）、收藏精美刺繡御守",
        "shoppingNightlife": "沉靜日系底片風格街拍，洗滌都市喧囂的心靈角落",
        "vibe": "莊嚴祥和、日系傳統美學、晨間心靈沉澱",
        "keyTip": "參拜禮儀為「二禮、二拍手、一禮」；紅色大鳥居前拍攝全家合照視野極佳"
      },
      "harmony": {
        "score": 9.8,
        "advice": "晨間空氣清新怡人，步調舒緩放鬆，長輩虔誠祈願求平安，年輕人拍攝日系大片，全家同沐神恩。",
        "splitMeetingPoint": "護國神社本殿前方參道廣場"
      }
    }
  },
  {
    "id": "spot-naminoue-shrine",
    "name": "Naminoue Shrine",
    "nameZh": "波上宮 (沖繩總鎮守・懸崖海景神社)",
    "nameJa": "波上宮 (なみのうえぐう)",
    "category": "attraction",
    "categoryLabel": "琉球八社之首",
    "icon": "⛩️",
    "lat": 26.2205,
    "lng": 127.6713,
    "address": "沖縄県那覇市若狭1丁目25-11",
    "mapCode": "33 185 023*22",
    "defaultDurationMinutes": 45,
    "tags": [
      "珊瑚礁斷崖",
      "海景神社",
      "小學生書包御守",
      "波之上海灘"
    ],
    "desc": "琉球第一神社，朱紅本殿矗立在珊瑚斷崖之上！最具代表性的紅黑小學生書包交通御守。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩小斜坡 (<800步)",
        "walkingScore": "green",
        "seatingRest": "境內設有遮蔭長椅，洗手間整潔；避開正門石階可走側邊平緩斜坡直達本殿",
        "foodHighlights": "參拜後至波之上海灘旁茶亭小歇，吹海風品茶",
        "cultureShopping": "琉球八社之首，沖繩總鎮守！最經典紀念品為精緻紅黑「小學生書包交通御守」，送孫兒首選",
        "keyTip": "歷史悠久香火鼎盛，長輩祈求家族世代興旺；走側邊斜坡免爬階梯非常輕鬆"
      },
      "young": {
        "photoSpot": "波之上臨海大橋回望「矗立在懸崖上的朱紅神社」明信片奇蹟視角、神社朱紅廊柱",
        "trendyFood": "紅黑兩色超萌小書包御守打卡、祈求戀愛良緣御守",
        "shoppingNightlife": "懸崖下波之上海灘踏浪、蔚藍大海與神社同框之攝影大景",
        "vibe": "壯麗海崖神社、沖繩最具代表性地標",
        "keyTip": "參拜後年輕人步行2分鐘至若狹海濱大橋上，能拍出神社懸空立於崖壁上的震撼全景"
      },
      "harmony": {
        "score": 9.7,
        "advice": "長輩由無障礙緩坡至殿前虔誠參拜求御守；年輕人可趁空檔至橋上抓拍懸崖全景照，30分鐘各得所願。",
        "splitMeetingPoint": "波上宮本殿前右側御守販售處旁長椅"
      }
    }
  },
  {
    "id": "spot-dfs-okinawa",
    "name": "T Galleria by DFS Okinawa",
    "nameZh": "T 廣場 by DFS 沖繩那霸店",
    "nameJa": "Tギャラリア 沖縄 by DFS",
    "category": "shopping",
    "categoryLabel": "路面免稅旗艦",
    "icon": "💎",
    "lat": 26.2229,
    "lng": 127.6976,
    "address": "沖縄県那覇市おもろまち4-1",
    "mapCode": "33 188 296*33",
    "defaultDurationMinutes": 120,
    "tags": [
      "日本唯一路面免稅",
      "機場免提重物提貨",
      "一線名品專櫃",
      "頂級保養"
    ],
    "desc": "全日本唯一境內路面免稅旗艦店！精品保養品一應俱全，回程直接於那霸機場管制區提貨。",
    "generation": {
      "senior": {
        "walkingLoad": "室內平坦 (1200~1800步)",
        "walkingScore": "yellow",
        "seatingRest": "全日本唯一境內路面免稅旗艦，各專櫃設有頂級皮質沙發與VIP休息區",
        "foodHighlights": "2F美食廣場與精品咖啡座，提供精緻花草茶、養生果汁與點心",
        "cultureShopping": "頂級專櫃保養品（SK-II、雅詩蘭黛、資生堂）、名牌絲巾、頂級手錶免稅大幅折讓",
        "keyTip": "購買之免稅品直接於返台當天「那霸機場管制區」提貨，旅途中「完全不用手提重物」，對長輩極大減負！"
      },
      "young": {
        "photoSpot": "各大國際一線精品旗艦門面奢華造景、時尚都會街拍",
        "trendyFood": "精品咖啡廳、限定甜品",
        "shoppingNightlife": "Chanel、LV、Gucci、Celine、Dior一線精品齊聚，日圓匯率優勢+免稅超划算，彩妝香氛天堂",
        "vibe": "奢華血拼、路面免稅挖寶、機場輕鬆提貨",
        "keyTip": "記得備妥回程航班代碼與護照，結帳即發送提貨券，最後一天出境直接領取"
      },
      "harmony": {
        "score": 9.5,
        "advice": "機場免稅提貨機制讓長輩逛得輕鬆優雅免提袋；館內咖啡沙發舒適，長輩坐沙發品咖啡，年輕人盡情血拼。",
        "splitMeetingPoint": "DFS 2F 中央精品鐘錶區旁服務台沙發"
      }
    }
  },
  {
    "id": "spot-kokusai-dori",
    "name": "Naha Kokusai Dori",
    "nameZh": "那霸國際通商店街",
    "nameJa": "那覇国際通り商店街",
    "category": "shopping",
    "categoryLabel": "繁華熱鬧街區",
    "icon": "🚶",
    "lat": 26.216,
    "lng": 127.6875,
    "address": "沖縄県那覇市牧志",
    "mapCode": "33 157 382*41",
    "defaultDurationMinutes": 90,
    "tags": [
      "奇蹟一英哩",
      "唐吉訶德",
      "紅芋塔現烤",
      "琉球工藝陶器"
    ],
    "desc": "全長1.6公里的沖繩繁華主軸！伴手禮、風獅爺陶藝、現烤紅芋塔、唐吉訶德與巷弄小吃。",
    "generation": {
      "senior": {
        "walkingLoad": "街道漫步 (1500~2000步)",
        "walkingScore": "yellow",
        "seatingRest": "平和通與公設市場周邊有多處室內遮雨棚拱廊與茶座小店",
        "foodHighlights": "御菓子御殿現烤紅芋塔、老字號純手工柴燒黑糖糕、清爽酸橘冰",
        "cultureShopping": "琉球傳統漆器、風獅爺手作陶器、傳統民謠三線琴店、古法泡盛專賣",
        "keyTip": "全長1.6公里，建議長輩漫步精華前半段或至壺屋陶瓷街漫遊，累了進特產店吹冷氣試吃"
      },
      "young": {
        "photoSpot": "奇蹟的一英哩繁華街景、巨大風獅爺塑像、昭和懷舊巷弄、Blue Seal霓虹招牌",
        "trendyFood": "Blue Seal紅芋海鹽冰淇淋、排隊沖繩飯糰（波上宮旁本店）、街頭居酒屋串燒",
        "shoppingNightlife": "唐吉訶德24小時驚安殿堂、文青潮流選物店、搞怪沖繩限定T恤",
        "vibe": "活力四射、霓虹熱鬧、步行探索核心",
        "keyTip": "國際通兩側單行道多，建議將車輛停放在周邊大型付費停車場，純步行逛街最愜意"
      },
      "harmony": {
        "score": 9.2,
        "advice": "長輩重點逛伴手禮名產試吃與傳統工藝，年輕人衝潮店唐吉訶德，約定於平和通拱廊入口集合避開日曬。",
        "splitMeetingPoint": "國際通與平和通商店街拱廊交界處"
      }
    }
  },
  {
    "id": "spot-inaka-soba",
    "name": "Inaka Kosetsuichiba Minami-ten",
    "nameZh": "田舍 沖繩麵 (公設市場南店)",
    "nameJa": "ソーキそば 田舎 公設市場南店",
    "category": "food",
    "categoryLabel": "平民軟骨麵傳奇",
    "icon": "🍜",
    "lat": 26.2142,
    "lng": 127.6882,
    "address": "沖縄県那覇市松尾2丁目10-20",
    "mapCode": "33 157 235*11",
    "defaultDurationMinutes": 30,
    "tags": [
      "400円銅板美食",
      "軟骨入口即化",
      "清醇柴魚湯",
      "市場巷弄"
    ],
    "desc": "隱身市場巷弄的平價傳奇！400円軟骨肉燉至晶瑩透亮、布丁般入口即化，柴魚湯頭清甜甘醇。",
    "generation": {
      "senior": {
        "walkingLoad": "平坦短街 (<400步)",
        "walkingScore": "green",
        "seatingRest": "室內傳統木桌凳，座位緊湊溫馨，出餐極快免久等",
        "foodHighlights": "招牌軟骨肉麵僅400円！深褐色豬軟骨燉煮至晶瑩黏糯、入口即化，極易咀嚼，柴魚高湯清甜甘醇",
        "cultureShopping": "體驗老那霸公設市場窄巷內數十年不變的人情味與庶民老滋味",
        "keyTip": "牙口不好的長輩也能毫無負擔享受的極致軟嫩軟骨肉，湯頭清甜少油，暖心又暖胃"
      },
      "young": {
        "photoSpot": "400円超狂銅板價招牌、鋪滿晶亮軟骨肉的超值沖繩麵、昭和懷舊窄巷店門",
        "trendyFood": "那霸傳奇銅板美食對照組、甘甜柴魚豚骨高湯、桌上特製泡盛辣椒（高麗胡椒）微辣過癮",
        "shoppingNightlife": "巷弄尋寶老店朝聖、與新潮EIBUN形成強烈風格對比",
        "vibe": "復古昭和感、極致CP值、老饕私藏小吃",
        "keyTip": "只收日幣現金；翻桌率極快，15分鐘即可完食，可做為雙麵試吃探險的上半場"
      },
      "harmony": {
        "score": 9.4,
        "advice": "極平價美味小品，軟嫩軟骨深受長輩讚許；若同行年輕人想吃文青EIBUN，兩店相距僅步行4分鐘，極易協調！",
        "splitMeetingPoint": "田舍沖繩麵店門前巷口"
      }
    }
  },
  {
    "id": "spot-eibun-soba",
    "name": "Okinawa Soba EIBUN",
    "nameZh": "沖繩麵 EIBUN (新世代文青話題名店)",
    "nameJa": "OKINAWA SOBA EIBUN",
    "category": "food",
    "categoryLabel": "文青排隊第一天王",
    "icon": "🍲",
    "lat": 26.2117,
    "lng": 127.6908,
    "address": "沖縄県那覇市壺屋1丁目5-14",
    "mapCode": "33 158 135*00",
    "defaultDurationMinutes": 75,
    "tags": [
      "法式技藝跨界",
      "炙燒三層肉",
      "平板線上抽號",
      "柚子胡椒香檬"
    ],
    "desc": "顛覆傳統的當代排隊第一名店！法餐背景主廚打造慢火甘醇高湯、厚切炙燒肉塊與特調佐料。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩短路 (<400步)",
        "walkingScore": "green",
        "seatingRest": "文青木質裝潢、室內冷氣舒適；門口採用平板線上抽號，免曬太陽罰站",
        "foodHighlights": "昆布柴魚慢火高湯清澄回甘、低鈉少負擔，炙燒肉塊酥軟芳香，提供香檬與柚子胡椒增添清爽",
        "cultureShopping": "鄰近壺屋通陶瓷街，等候期間可帶長輩至兩旁平緩散步賞陶瓷藝品",
        "keyTip": "平板抽號後有手機簡訊通知，長輩可在隔壁冷氣陶藝店吹冷氣看瓷器，完全不用久站排隊"
      },
      "young": {
        "photoSpot": "當今那霸第一網紅文青麵！法式擺盤特選BUNSOBA、厚切炙燒肉塊特寫、木質現代裝潢",
        "trendyFood": "法餐主廚跨界研發！特製風味辣油、芥末生拌麵、招牌多重肉品組合、香檸冷麵",
        "shoppingNightlife": "沖繩當前話題度冠軍、排隊名店打卡炫耀、壺屋文青潮店",
        "vibe": "文青美學、料理跨界創新、潮流美食天花板",
        "keyTip": "抵達立即至門口平板登記人數與手機號，留意號碼跳轉，通常需等候30-60分鐘，可順遊壺屋街"
      },
      "harmony": {
        "score": 9.6,
        "advice": "年輕人取號排隊，長輩於隔壁壺屋陶藝老街悠然漫步賞瓷器；顛覆傳統的清爽湯頭長輩也讚不絕口！",
        "splitMeetingPoint": "EIBUN店門口木質等候長凳"
      }
    }
  },
  {
    "id": "spot-sports-depo",
    "name": "Sports Depo Ameku",
    "nameZh": "Sports Depo 天久店 (超大運動用品專賣)",
    "nameJa": "スポーツデポ 天久店",
    "category": "shopping",
    "categoryLabel": "戶外運動露營",
    "icon": "👟",
    "lat": 26.2307,
    "lng": 127.6922,
    "address": "沖縄県那覇市天久1-2-1",
    "mapCode": "33 218 074*74",
    "defaultDurationMinutes": 60,
    "tags": [
      "超大平面商場",
      "Coleman露營裝備",
      "減震健走鞋",
      "免稅退稅"
    ],
    "desc": "那霸規模最大戶外運動量販！超值健走鞋、露營裝備與戶外機能服飾，平面寬敞好逛。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩大賣場 (<1200步)",
        "walkingScore": "green",
        "seatingRest": "試鞋區設有大量軟皮試穿長凳，隨時可坐下休息；走道寬平防滑",
        "foodHighlights": "商場周邊附設平價美食小吃與飲料機",
        "cultureShopping": "挑選極致減震超輕量健走鞋（Skechers、Hoka、Asics）、長輩防風排汗薄夾克，免稅超值",
        "keyTip": "全館平面單層，挑雙好走的日本健走鞋，接下來幾天行程腳步輕盈無負擔"
      },
      "young": {
        "photoSpot": "超大規模露營帳篷展示區、日線限定球鞋展示牆",
        "trendyFood": "商場周邊美食",
        "shoppingNightlife": "The North Face紫標與日線山系服飾、Coleman戶外露營裝備免稅大特賣、限量球鞋",
        "vibe": "山系Outdoor潮流、裝備控天堂、超大運動賣場",
        "keyTip": "免稅手續於專屬免稅收銀台統一辦理，戶外露營用品價格約為台灣專櫃6-7折"
      },
      "harmony": {
        "score": 9.5,
        "advice": "長輩在舒適鞋區試穿好走慢跑鞋，年輕人探索潮流露營裝備，全家在同一商場各取所需，附免費大型停車場。",
        "splitMeetingPoint": "Sports Depo 入口服務台旁休息椅"
      }
    }
  },
  {
    "id": "spot-senagajima",
    "name": "Senagajima Umikaji Terrace",
    "nameZh": "瀨長島 Umikaji Terrace (沖繩小希臘)",
    "nameJa": "瀬長島ウミカジテラス",
    "category": "attraction",
    "categoryLabel": "地中海落日絕景",
    "icon": "🌅",
    "lat": 26.1751,
    "lng": 127.6415,
    "address": "沖縄県豊見城市字瀬長174-6",
    "mapCode": "33 002 602*06",
    "defaultDurationMinutes": 75,
    "tags": [
      "小希臘純白階梯",
      "幸福鬆餅",
      "飛機近距越頂",
      "金色落日海景"
    ],
    "desc": "依傍海島階梯建起的純白地中海聚落！欣賞金色夕陽灑滿海面，客機低空掠過降落的夢幻奇景。",
    "generation": {
      "senior": {
        "walkingLoad": "階梯步道有平緩坡道替代 (800~1200步)",
        "walkingScore": "yellow",
        "seatingRest": "地中海純白階梯各層均設有海景露天遮陽陽傘座，底層步道平坦",
        "foodHighlights": "熱檸檬花草茶、清涼香檸果汁、軟嫩舒芙蕾鬆餅、現烤海鮮串",
        "cultureShopping": "欣賞夕陽染紅東海海平線，海浪輕拍岸邊，感受極致悠閒度假氛圍",
        "keyTip": "階梯旁設有無障礙坡道可繞行；若長輩不想爬階梯，坐在最下層海景第一排露天座位視野最開闊"
      },
      "young": {
        "photoSpot": "沖繩小希臘純白建築階梯大片、落日時分飛機低空掠頂的震撼特寫、夕陽金黃海面剪影",
        "trendyFood": "全沖繩最火排隊名店「幸福鬆餅（幸せのパンケーキ）」舒芙蕾、水果聖代、海景精釀啤酒",
        "shoppingNightlife": "海濱文創露天小店、特色飾品手作、黃昏海景微醺Bar",
        "vibe": "小希臘地中海風、浪漫日落、航空客機絕景",
        "keyTip": "日落前1小時抵達為黃金時刻；幸福鬆餅需提早現場登記，戶外座位拍照最美"
      },
      "harmony": {
        "score": 9.7,
        "advice": "日落絕景人人愛！年輕人先去登記幸福鬆餅，長輩在海邊露天陽傘長椅喝茶看夕陽與飛機，共享南國暮色。",
        "splitMeetingPoint": "Umikaji Terrace 47號店舖旁觀景平台"
      }
    }
  },
  {
    "id": "spot-maxvalu",
    "name": "MaxValu Tomigusuku",
    "nameZh": "MaxValu 豐見城店 (24小時大型超市)",
    "nameJa": "マックスバリュ 豊見城店",
    "category": "shopping",
    "categoryLabel": "24H深夜補給",
    "icon": "🛒",
    "lat": 26.1668,
    "lng": 127.671,
    "address": "沖縄県豊見城市字田頭155-1",
    "mapCode": "33 034 656*33",
    "defaultDurationMinutes": 45,
    "tags": [
      "24小時營業",
      "產地草莓蘋果",
      "晚間特價熟食",
      "生活伴手禮"
    ],
    "desc": "永旺AEON旗下24小時生活超市！採購新鮮日本水果、牛奶、宵夜熟食特價品與日用品。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩小超市 (<600步)",
        "walkingScore": "green",
        "seatingRest": "入口設有休息座椅，推車順手平整",
        "foodHighlights": "新鮮日本產蜜柑、草莓、低糖高鈣鮮乳、無糖綠茶、長輩睡前安神養生飲品",
        "cultureShopping": "日本在地永旺集團連鎖生活超市，價格透明平民化，體驗在地生活節奏",
        "keyTip": "24小時不打烊，回民宿前順路補給，買好隔天早餐水果，省去清晨找早餐的不便"
      },
      "young": {
        "photoSpot": "晚間熟食特價貼紙專區、琳瑯滿目的沖繩限定泡麵零食牆",
        "trendyFood": "晚間半價熟食炸物（炸雞、可樂餅、日式炒麵）、限定泡盛Chu-hi調酒、限定甜點",
        "shoppingNightlife": "宵夜狂歡補給站、整箱伴手禮小點心批發價",
        "vibe": "在地生活超市、深夜尋寶特價熟食",
        "keyTip": "晚間19:00後生鮮熟食區貼滿20%~50%特價標籤，便宜又美味"
      },
      "harmony": {
        "score": 9.6,
        "advice": "回海之樹民宿前的5分鐘快速補給，長輩挑水果牛奶，年輕人挑宵夜炸雞啤酒，15分鐘滿載而歸。",
        "splitMeetingPoint": "超市收銀台旁服務區"
      }
    }
  },
  {
    "id": "spot-daruma-temple",
    "name": "Sairaiin Daruma-dera",
    "nameZh": "西來院 達磨寺 (滿滿開運不倒翁秘境)",
    "nameJa": "西来院 達磨寺 (だるまでら)",
    "category": "attraction",
    "categoryLabel": "首里古道祈福秘境",
    "icon": "🎎",
    "lat": 26.2185,
    "lng": 127.7225,
    "address": "沖縄県那覇市首里赤田町1丁目5",
    "mapCode": "33 162 768*41",
    "defaultDurationMinutes": 45,
    "tags": [
      "達摩不倒翁牆",
      "安產長壽祈願",
      "親手點睛許願",
      "靜謐少階梯"
    ],
    "desc": "首里古寺禪宗秘境！殿前排滿信徒許願的紅色達摩不倒翁，祈求健康長壽、安產開運。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩小庭院 (<400步)",
        "walkingScore": "green",
        "seatingRest": "禪宗寺院環境肅穆幽靜，主殿前設有木質歇腳長椅，清風徐徐",
        "foodHighlights": "自備溫熱開水，享受寺廟古木間的寧靜禪意",
        "cultureShopping": "首里古道歷史禪寺，祈求安產、長壽、闔家平安與諸願成就；開運不倒翁加持",
        "keyTip": "隱密私房景點，無大型遊覽車喧嘩；階梯僅數階且有平緩扶手，長輩參拜非常舒服"
      },
      "young": {
        "photoSpot": "數百尊大大小小紅色開運達摩不倒翁祈願牆、日式石庭院、萌感達摩排排坐特寫",
        "trendyFood": "在達摩身上親自點睛許願、購買迷你可愛達摩御守",
        "shoppingNightlife": "深度私房小眾景點、拍出與眾不同的日式文化感文青照",
        "vibe": "神秘清幽、紅色達摩震撼視覺、開運祈福",
        "keyTip": "買一個開運不倒翁，心中默念願望並親手畫上左眼，待日後願望實現再補點右眼"
      },
      "harmony": {
        "score": 9.8,
        "advice": "鬧中取靜的祈福秘境，步數極少，長輩求健康平安、年輕人拍照許願，全家同獲吉祥好兆頭！",
        "splitMeetingPoint": "達磨寺山門入口古鐘前"
      }
    }
  },
  {
    "id": "spot-seven-eleven-shuri",
    "name": "7-Eleven Shuri Castle Town JA Okinawa",
    "nameZh": "7-Eleven 首里城下町JA沖繩店",
    "nameJa": "セブン-イレブン 首里城下町JAおきなわ店",
    "category": "shopping",
    "categoryLabel": "城下町便利小憩",
    "icon": "🏪",
    "lat": 26.2162,
    "lng": 127.7185,
    "address": "沖縄県那覇市首里当蔵町2丁目",
    "mapCode": "33 161 685*00",
    "defaultDurationMinutes": 20,
    "tags": [
      "首里城瓦頂外觀",
      "洗手間歇腿",
      "熱飲提神冰沙",
      "自駕中繼站"
    ],
    "desc": "融入首里城下町古風的特色門市，中途如廁、熱飲提神小憩，活動筋骨好出發。",
    "generation": {
      "senior": {
        "walkingLoad": "極低 (<100步)",
        "walkingScore": "green",
        "seatingRest": "門市設有洗手間與室內外簡單休憩座位",
        "foodHighlights": "熱騰騰日式黑輪（關東煮）、熱焙茶、熱美式咖啡",
        "cultureShopping": "融入首里琉球城下町古樸風貌的傳統瓦頂特色門市",
        "keyTip": "自駕途中的黃金中繼歇腳點，伸展腿部筋骨、使用洗手間，避免長輩久坐僵硬"
      },
      "young": {
        "photoSpot": "琉球紅瓦風貌7-11店面打卡、沖繩限定商品合照",
        "trendyFood": "現打冰沙機特色思慕昔、沖繩香檸冰棒、自駕提神冰拿鐵",
        "shoppingNightlife": "限定零食補給、日本7-11限定保養品（雪肌粹）",
        "vibe": "快速便利、城下町特色建築",
        "keyTip": "15分鐘迅速快閃，補充足夠水分與提神飲料，準備直奔浦添PARCO CITY"
      },
      "harmony": {
        "score": 9.7,
        "advice": "自駕途中最貼心的中途如廁與伸展點，長輩上洗手間暖胃，年輕人買冰沙，精神奕奕繼續出發。",
        "splitMeetingPoint": "7-Eleven 門口停車場"
      }
    }
  },
  {
    "id": "spot-jojoen",
    "name": "Jojoen Okinawa Urasoe Parco City",
    "nameZh": "敘敘苑 燒肉 浦添PARCO CITY店",
    "nameJa": "叙々苑 沖縄浦添パルコシティ店",
    "category": "food",
    "categoryLabel": "海景第一排頂級燒肉",
    "icon": "🥩",
    "lat": 26.2589,
    "lng": 127.6972,
    "address": "沖縄県浦添市西洲3-1-1 サンエー浦添西海岸 PARCO CITY 3F",
    "mapCode": "33 339 024*42",
    "defaultDurationMinutes": 75,
    "tags": [
      "西海岸無敵海景",
      "東京燒肉王者",
      "特選和牛午間套餐",
      "極品牛舌"
    ],
    "desc": "落地窗面朝無邊蔚藍西海岸！品味油花勻稱的特選和牛五花、薄切牛舌與精緻甜點，尊榮舒適。",
    "generation": {
      "senior": {
        "walkingLoad": "商場室內平坦直達 (<300步)",
        "walkingScore": "green",
        "seatingRest": "落地窗海景高檔皮質包廂沙發，下吸式無煙烤爐，完全無油煙味",
        "foodHighlights": "油花均勻柔嫩的和牛燒肉、招牌特製敘敘苑沙拉、海帶芽清湯、爽口泡菜與餐後冰淇淋",
        "cultureShopping": "享受西海岸海景第一排尊榮用餐體驗，肉質軟嫩多汁完全不費牙力",
        "keyTip": "中午限定超值套餐CP值極高；肉品油花細膩軟嫩，長輩吃得驚喜讚不絕口"
      },
      "young": {
        "photoSpot": "無敵西海岸蔚藍落地窗海景配頂級燒肉同框大片、油花粉嫩牛五花與牛舌特寫",
        "trendyFood": "東京燒肉王者之尊、招牌特選和牛牛五花、薄切蔥鹽牛舌、餐後愛心造型冰淇淋",
        "shoppingNightlife": "頂級奢華味蕾享受、社群打卡必爆人氣話題",
        "vibe": "奢華尊榮、無敵海景、極致美味",
        "keyTip": "海景窗邊席位極度熱門，建議11:00開門即前往排隊候位，或提早透過官網預約"
      },
      "harmony": {
        "score": 9.9,
        "advice": "海景頂級燒肉老少皆陶醉！長輩坐在無煙海景包廂享受入口即化軟嫩和牛，全家同享最奢華午餐時光。",
        "splitMeetingPoint": "PARCO CITY 3F 敘敘苑餐廳門口"
      }
    }
  },
  {
    "id": "spot-parco-city",
    "name": "SAN-A Urasoe West Coast PARCO CITY",
    "nameZh": "SAN-A 浦添西海岸 PARCO CITY",
    "nameJa": "サンエー浦添西海岸 PARCO CITY",
    "category": "shopping",
    "categoryLabel": "全沖繩最大旗艦巨城",
    "icon": "🛍️",
    "lat": 26.2588,
    "lng": 127.6975,
    "address": "沖縄県浦添市西洲3-1-1",
    "mapCode": "33 339 024*42",
    "defaultDurationMinutes": 240,
    "tags": [
      "250間潮流店舖",
      "面海休憩沙發區",
      "無印良品旗艦",
      "外國人退稅中心"
    ],
    "desc": "沖繩規模最大海濱商城！無印良品、Loft、3COINS、流行服飾，每層樓設有海景沙發歇腳。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩寬闊 (依體力自由調整 1500~2500步)",
        "walkingScore": "yellow",
        "seatingRest": "沖繩最大海景商場，每層樓面海側皆設有超大軟皮觀海休憩沙發區，冷氣恆溫舒適",
        "foodHighlights": "美食廣場有道地沖繩料理、熱湯麵、和風綠茶甜點，餐飲選擇超豐富",
        "cultureShopping": "無印良品全沖繩最大旗艦店、特色沖繩產物館、精緻生活雜貨",
        "keyTip": "停留5小時的秘訣：長輩在海景沙發區坐看西海岸波光放鬆，或在無印良品慢步，完全不累"
      },
      "young": {
        "photoSpot": "全落地海景商場廊道、超大潮流店鋪打卡、夕陽西海岸金黃光影",
        "trendyFood": "A&W美式漢堡、一風堂、貢茶、限定甜品手搖飲",
        "shoppingNightlife": "250間名店瘋狂血拼！Loft、3COINS+plus、ABC-MART GRAND STAGE限定鞋、BEAMS、ZARA",
        "vibe": "全沖繩最大最齊全潮流商場、退稅中心一站搞定、5小時買到手軟",
        "keyTip": "2F設有外國旅客退稅中心，統一辦理各店退稅；1F設有免費大型置物櫃可寄存大包小包"
      },
      "harmony": {
        "score": 9.6,
        "advice": "「分流不走散」的最佳示範：長輩在海景沙發喝茶看海或逛無印良品，年輕人衝潮流服飾，約定90分鐘會合一次！",
        "splitMeetingPoint": "PARCO CITY 2F 海景觀景沙發區（退稅櫃台旁）"
      }
    }
  },
  {
    "id": "spot-workman-plus",
    "name": "Workman Plus Urasoe Kyozuka",
    "nameZh": "WORKMAN Plus 浦添經塚店",
    "nameJa": "ワークマンプラス 浦添経塚店",
    "category": "shopping",
    "categoryLabel": "平價極致機能神店",
    "icon": "🧥",
    "lat": 26.241,
    "lng": 127.7208,
    "address": "沖縄県浦添市字前田1064-1",
    "mapCode": "33 253 456*11",
    "defaultDurationMinutes": 60,
    "tags": [
      "平價戶外機能",
      "防風防雨風衣",
      "輕量防滑健走鞋",
      "工裝穿搭"
    ],
    "desc": "日本國民爆紅機能之王！防潑水風衣僅1900-2900円，長輩防風保暖、年輕人工裝露營首選。",
    "generation": {
      "senior": {
        "walkingLoad": "平緩小量販 (<600步)",
        "walkingScore": "green",
        "seatingRest": "店內通道平整，門口即有專屬平面停車場，下車直通",
        "foodHighlights": "周邊有超商與自動販賣機",
        "cultureShopping": "日本國民級平價機能神牌！一件輕便防潑水保暖外套僅1900-2900円，防滑耐磨健走鞋只要1500円",
        "keyTip": "價格便宜到不可思議，長輩挑選防風防雨保暖衣物毫無心理負擔，買得極有成就感"
      },
      "young": {
        "photoSpot": "Urban Outdoor工裝風穿搭鏡前照、超酷機能登山防潑水服飾特寫",
        "trendyFood": "商場周邊美食",
        "shoppingNightlife": "日本爆紅山系潮流穿搭、露營防風外套、超輕工裝機能褲、防水背包",
        "vibe": "平價極致機能、山系穿搭挖寶神店",
        "keyTip": "版型與尺寸容易缺貨，看到合適尺碼建議立即下手；價格是專櫃戶外品牌的四分之一"
      },
      "harmony": {
        "score": 9.6,
        "advice": "高性價比的實用購物點，長輩買防風保暖衣，年輕人買工裝山系潮服，45分鐘滿意結帳。",
        "splitMeetingPoint": "Workman Plus 門口收銀台旁"
      }
    }
  },
  {
    "id": "spot-katsunoya",
    "name": "Katsunoya Naha Main Place",
    "nameZh": "かつ乃屋 那霸Main Place店",
    "nameJa": "かつ乃屋 那覇メインプレイス店",
    "category": "food",
    "categoryLabel": "酥脆金黃日式炸豬排",
    "icon": "🍱",
    "lat": 26.2238,
    "lng": 127.6948,
    "address": "沖縄県那覇市おもろまち4丁目4-9",
    "mapCode": "33 188 560*22",
    "defaultDurationMinutes": 60,
    "tags": [
      "熟成厚切炸豬排",
      "現磨白芝麻香",
      "白飯高麗菜絲免費續",
      "室內停車場直通"
    ],
    "desc": "新都心Main Place內人氣豬排！熟成厚切裹生麵包粉酥脆金黃，白飯味噌湯高麗菜免費續添。",
    "generation": {
      "senior": {
        "walkingLoad": "商場室內平坦 (<300步)",
        "walkingScore": "green",
        "seatingRest": "那霸Main Place商場1F，寬敞舒適皮質沙發卡座，桌距大無壓迫感",
        "foodHighlights": "現磨白芝麻香氣高雅、熟成豬排金黃酥脆不油膩，越光米白飯、熱味噌湯與爽脆高麗菜絲免費續加",
        "cultureShopping": "日式連鎖精緻豬排文化，服務親切有禮，長輩吃得飽足舒心",
        "keyTip": "商場地下附設超大型室內免費停車場，搭乘電梯直達1F餐廳，免除戶外日曬風雨"
      },
      "young": {
        "photoSpot": "卡滋作響的黃金厚切炸豬排特寫、現磨白芝麻香氣蒸騰、大碗堆疊高麗菜絲",
        "trendyFood": "酥脆金黃日式熟成炸豬排、特製甘口/辛口雙醬汁、越光米白飯無限吃到飽",
        "shoppingNightlife": "位於新都心Main Place內，吃飽可順逛商場San-A超市與日系專櫃",
        "vibe": "日式家庭溫馨、經典酥脆豬排饗宴",
        "keyTip": "現磨芝麻混合特製豬排醬蘸著吃最道地；白飯與味噌湯皆可續加，大胃王年輕人首選"
      },
      "harmony": {
        "score": 9.7,
        "advice": "室內停車直通免受風雨，沙發寬大舒適，酥脆好咬的熟成豬排全家皆喜愛，飯後順道逛商場消食。",
        "splitMeetingPoint": "那霸Main Place 1F かつ乃屋門口"
      }
    }
  },
  {
    "id": "spot-tonkatsu-koyaji",
    "name": "Tonkatsu Koyaji Naha",
    "nameZh": "豚かつ 小やじ 那霸店 (隱藏版極品阿古豬)",
    "nameJa": "豚かつ 小やじ (Tonkatsu Koyaji)",
    "category": "food",
    "categoryLabel": "職人低溫粉嫩阿古豬",
    "icon": "🥢",
    "lat": 26.2148,
    "lng": 127.6912,
    "address": "沖縄県那覇市牧志",
    "mapCode": "33 158 544*77",
    "defaultDurationMinutes": 75,
    "tags": [
      "純種阿古豬",
      "低溫慢炸熟成",
      "玫瑰粉嫩肉質",
      "老饕私藏居酒屋"
    ],
    "desc": "老饕才懂的極品炸豬排！純種阿古豬低溫慢炸，肉質粉嫩多汁油脂甜美，蘸海鹽山葵回味無窮。",
    "generation": {
      "senior": {
        "walkingLoad": "短街巷弄 (<300步)",
        "walkingScore": "green",
        "seatingRest": "日式居酒屋精巧原木桌位，溫馨寧靜，環境乾淨雅致",
        "foodHighlights": "嚴選沖繩頂級純種阿古豬，以「低溫慢炸熟成工法」烹調，肉質軟嫩無筋無腥味，油脂清甜化口不油膩",
        "cultureShopping": "體驗沖繩職人對阿古豬的最高敬意與料理極致追求",
        "keyTip": "不同於高溫硬脆炸豬排，低溫慢炸保留了肉質的細嫩水份，非常適合長輩牙口品嚐"
      },
      "young": {
        "photoSpot": "夢幻粉嫩肉質玫瑰色橫切面、日式精緻居酒屋暖簾打卡、阿古豬特上定食全景",
        "trendyFood": "沖繩排隊老饕口袋名單、極品阿古豬特上炸豬排、蘸沖繩海鹽與現磨山葵、沖繩Orion生啤酒",
        "shoppingNightlife": "居酒屋微醺氛圍、隱藏版美食朝聖、夜晚小酌首選",
        "vibe": "職人低溫料理、老饕私藏秘店、微醺溫暖夜",
        "keyTip": "座位較精巧，建議提早於晚餐開始前抵達，推薦搭配一杯沖繩在地生啤酒共度美食之夜"
      },
      "harmony": {
        "score": 9.6,
        "advice": "沖繩最頂級的阿古豬體驗，低溫粉嫩肉質讓長輩驚艷軟嫩，年輕人享受老饕朝聖的儀式感。",
        "splitMeetingPoint": "豚かつ 小やじ 店門口日式暖簾前"
      }
    }
  },
  {
    "id": "spot-toyosaki-roadside",
    "name": "Roadside Station Toyosaki",
    "nameZh": "道之驛 豐崎 (日本最西端道之驛)",
    "nameJa": "道の駅 豊崎 (菜々色畑)",
    "category": "shopping",
    "categoryLabel": "最西端小農市集",
    "icon": "🥭",
    "lat": 26.1585,
    "lng": 127.6575,
    "address": "沖縄県豊見城市字豊崎3-39",
    "mapCode": "232 544 195*55",
    "defaultDurationMinutes": 45,
    "tags": [
      "日本最西端道之驛",
      "農家清晨現摘",
      "柴燒古法黑糖",
      "芒果雪酪冰淇淋"
    ],
    "desc": "日本最西端之道之驛！館內「菜菜色畑」販售清晨採摘生鮮、古法柴燒黑糖、海藻小農伴手禮。",
    "generation": {
      "senior": {
        "walkingLoad": "平坦單層小市集 (<500步)",
        "walkingScore": "green",
        "seatingRest": "館內附設觀光情報中心，設有冷氣休憩桌椅與茶水設備",
        "foodHighlights": "日本最西端之道之驛！農夫清晨現摘新鮮蔬果、柴燒古法黑糖、沖繩海藻、特產小農調味料",
        "cultureShopping": "長輩最愛的「地產地消」在地小農市集，天然純黑糖與手作果醬送禮自用兩相宜",
        "keyTip": "物美價廉，價格遠比市區免稅店親民，清晨新鮮採摘，長輩在此挑選天然食材格外興奮"
      },
      "young": {
        "photoSpot": "日本最西端「道の駅」紀念立牌合影打卡、在地特色小農包裝商品特寫",
        "trendyFood": "現挖沖繩芒果雪酪冰淇淋、道之驛限定手工黑糖小餅乾",
        "shoppingNightlife": "特色地方文創貼紙、道之驛紀念章收集、手作辣油伴手禮",
        "vibe": "質樸在地小農風、日本最西端紀念打卡點",
        "keyTip": "館內設有觀光導覽中心，可免費蓋上日本最西端道之驛紀念戳章留念"
      },
      "harmony": {
        "score": 9.7,
        "advice": "最後一天返台前採買天然小農特產的私房寶地，長輩挑純手工柴燒黑糖，年輕人蓋紀念章吃冰淇淋，收穫豐富。",
        "splitMeetingPoint": "道之驛「菜々色畑」大門入口木造休息區"
      }
    }
  },
  {
    "id": "spot-aeon-naha",
    "name": "AEON Naha Store",
    "nameZh": "永旺 那霸店 (AEON 那霸小祿店)",
    "nameJa": "イオン那覇店",
    "category": "shopping",
    "categoryLabel": "機場前伴手禮總匯",
    "icon": "🛒",
    "lat": 26.1965,
    "lng": 127.6668,
    "address": "沖縄県那覇市金城5丁目10-2",
    "mapCode": "33 095 154*14",
    "defaultDurationMinutes": 120,
    "tags": [
      "單軌小祿站直通",
      "專屬免稅櫃台",
      "沖繩伴手禮總匯",
      "推車直通後車廂"
    ],
    "desc": "離機場僅8分鐘車程！雪鹽餅乾、辣蝦餅、黑糖、泡盛一站免稅購足，室內大型停車場推車方便。",
    "generation": {
      "senior": {
        "walkingLoad": "大型綜合商場 (1200~1800步)",
        "walkingScore": "yellow",
        "seatingRest": "各樓層走道設有沙發座椅，全棟無障礙坡道與直通電梯齊全",
        "foodHighlights": "B1F超大型超市生鮮區，當季日本水果、熟食壽司便當、日式綠茶與保健飲品",
        "cultureShopping": "沖繩名產總匯專區：雪鹽金楚糕、辣蝦餅、黑糖塊、泡盛酒一站購齊，附專屬免稅打包服務",
        "keyTip": "直通單軌小祿站，且備有室內大型免費停車場；推車可直接推至後車廂裝箱，免搬重物"
      },
      "young": {
        "photoSpot": "滿坑滿谷的沖繩伴手禮陳列牆、限定日系零食展示",
        "trendyFood": "超市特大草莓盒、日系甜甜圈、特色飲料、生鮮熟食",
        "shoppingNightlife": "免稅藥妝店最後大掃貨、整箱日系泡麵零食帶回台灣、大創百圓店",
        "vibe": "返台前最終伴手禮大衝刺、一站式購足",
        "keyTip": "專屬外國人退稅櫃台辦理速度快，免稅專用透明袋打包整齊，直接裝進行李箱託運"
      },
      "harmony": {
        "score": 9.8,
        "advice": "返台前最後一站採購，室內停車場不怕風吹日曬，長輩與年輕人把所有送親朋好友的伴手禮在此全數搞定！",
        "splitMeetingPoint": "AEON 那霸店 1F 沖繩特產免稅專區服務台"
      }
    }
  },
  {
    "id": "spot-tondo-ramen",
    "name": "Ryukyu Shinmen Tondo Oroku Honten",
    "nameZh": "琉球新麵 通堂 小祿本店 (男人麵・女人麵)",
    "nameJa": "琉球新麺 通堂 小禄本店",
    "category": "food",
    "categoryLabel": "傳奇拉麵雙饗宴",
    "icon": "🍜",
    "lat": 26.1973,
    "lng": 127.6675,
    "address": "沖縄県那覇市金城5-4-6",
    "mapCode": "33 095 245*88",
    "defaultDurationMinutes": 60,
    "tags": [
      "經典女人麵鹽味清湯",
      "男人麵黑蒜濃豚骨",
      "無限量免費辣豆芽",
      "食券投幣機"
    ],
    "desc": "傳奇拉麵始祖名店！清雅甘甜的久米島天然鹽味「女人麵」與黑蒜濃郁「男人麵」雙重合奏。",
    "generation": {
      "senior": {
        "walkingLoad": "平坦極短 (<100步)",
        "walkingScore": "green",
        "seatingRest": "店內日式桌席座位舒適，出餐神速翻桌快，免去漫長等待",
        "foodHighlights": "招牌「女人麵（おんな味）」：採用久米島天然海鹽與老母雞高湯精心熬煮，金黃清澈甘醇完全不油膩，細麵滑順；桌上無限量特製醃漬辣豆芽爽脆開胃",
        "cultureShopping": "沖繩拉麵界始祖名店，體驗日本拉麵的溫暖職人精神",
        "keyTip": "女人麵的鹽味雞湯清雅甘潤，完全打破長輩對日本拉麵太鹹太油的刻板印象，長輩讚不絕口"
      },
      "young": {
        "photoSpot": "通堂經典招牌雙碗對比、投幣式食券機點餐特寫、滿桌無限量享用辣豆芽小菜罐",
        "trendyFood": "招牌「男人麵（おとこ味）」：黑蒜濃郁豚骨高湯香氣爆棚、溏心蛋、炙燒叉燒肉大口過癮",
        "shoppingNightlife": "就在AEON那霸店斜對面，吃飽直接前往機場還車，動線完美順暢",
        "vibe": "傳奇拉麵雙重奏、濃郁與清爽的完美對決",
        "keyTip": "投幣式食券機可點餐加料；桌上的涼拌辣豆芽是全沖繩拉麵界最著名的小菜，免費無限續加"
      },
      "harmony": {
        "score": 9.9,
        "advice": "男女雙麵設計是跨世代拉麵的完美解法！長輩享用清爽女人麵，年輕人大啖濃醇男人麵，為旅途劃下完美句點！",
        "splitMeetingPoint": "通堂拉麵小祿本店門口長凳"
      }
    }
  },
  {
    "id": "spot-naha-airport",
    "name": "Naha Airport International Terminal",
    "nameZh": "那霸機場 國際線航廈 (返程返台)",
    "nameJa": "那覇空港 国際線ターミナル (OKA)",
    "category": "transport",
    "categoryLabel": "平安賦歸返台",
    "icon": "✈️",
    "lat": 26.2065,
    "lng": 127.6465,
    "address": "沖縄県那覇市鏡水150",
    "mapCode": "33 123 279*00",
    "defaultDurationMinutes": 120,
    "tags": [
      "國際線報到",
      "DFS免稅管制區提貨",
      "機場免稅店生巧",
      "滿載平安返台"
    ],
    "desc": "辦理登機託運，管制區內提領DFS免稅品，採買Royce生巧克力與紅芋塔，攜帶南國蔚藍回憶登機。",
    "generation": {
      "senior": {
        "walkingLoad": "平坦航廈動線 (800~1200步)",
        "walkingScore": "green",
        "seatingRest": "國際線出發大廳與登機候機區設有大量視野極佳的觀景軟椅，無障礙電梯便利",
        "foodHighlights": "機場管制區內茶座、免稅糕點試吃、溫熱熱茶",
        "cultureShopping": "管制區內DFS免稅提貨櫃台「一鍵領取」第3天採購的精品，免隨車搬運；免稅店補買Royce生巧與紅芋塔",
        "keyTip": "動線簡單清晰，各處均有繁體中文標示，長輩推著隨身小行李悠閒登機，平安返台"
      },
      "young": {
        "photoSpot": "候機大廳大片玻璃窗前停機坪客機打卡、登機證與蔚藍跑道合影、滿滿免稅提袋開箱",
        "trendyFood": "自動販賣機最後喝一瓶沖繩香檸氣泡水、Blue Seal最後一支冰淇淋",
        "shoppingNightlife": "免稅店最後衝刺補貨、提領DFS精品戰利品、退稅清點",
        "vibe": "依依不捨的南國蔚藍回憶、滿載而歸的成就感",
        "keyTip": "國際線請於起飛前2至2.5小時抵達；DFS提貨櫃台出示提貨券迅速領貨"
      },
      "harmony": {
        "score": 9.8,
        "advice": "留足2小時從容通關，長輩在登機門前坐著看飛機起降休息，年輕人提領免稅品，全家平平安安快樂返台！",
        "splitMeetingPoint": "那霸機場國際線出發大廳中央服務台"
      }
    }
  }
];

// ============================================================================
// PRESET ITINERARIES (Curated Cross-Generation Templates)
// ============================================================================
const PRESET_ITINERARIES = {
  "official_5d": {
    "title": "官方推薦 5天4夜自駕經典",
    "subtitle": "去趣 ChicTrip 完整 40 個停留時刻，經典自駕全景走透透",
    "badge": "官方精選",
    "days": [
      {
        "day": 1,
        "title": "首日啟程・好市多採購・北谷美國村煙火",
        "startTime": "11:00",
        "spotIds": [
          "spot-toyota",
          "spot-san-a-shiozaki",
          "spot-ocean-tree",
          "spot-costco-nanjo",
          "spot-ocean-tree",
          "spot-american-village",
          "spot-ocean-tree"
        ]
      },
      {
        "day": 2,
        "title": "南部海味・光影水族館・漁民食堂煎魚",
        "startTime": "08:30",
        "spotIds": [
          "spot-ocean-tree",
          "spot-itoman-fish",
          "spot-ocean-tree",
          "spot-iias-toyosaki",
          "spot-dmm-aquarium",
          "spot-chura-sun-beach",
          "spot-itoman-gyomin"
        ]
      },
      {
        "day": 3,
        "title": "雙神社參拜・DFS免稅・文青EIBUN・瀨長島落日",
        "startTime": "08:30",
        "spotIds": [
          "spot-ocean-tree",
          "spot-gokoku-shrine",
          "spot-naminoue-shrine",
          "spot-dfs-okinawa",
          "spot-kokusai-dori",
          "spot-inaka-soba",
          "spot-eibun-soba",
          "spot-sports-depo",
          "spot-senagajima",
          "spot-maxvalu",
          "spot-ocean-tree"
        ]
      },
      {
        "day": 4,
        "title": "達磨寺祈福・敘敘苑海景燒肉・PARCO CITY 5小時・雙豬排巡禮",
        "startTime": "09:00",
        "spotIds": [
          "spot-ocean-tree",
          "spot-daruma-temple",
          "spot-seven-eleven-shuri",
          "spot-jojoen",
          "spot-parco-city",
          "spot-workman-plus",
          "spot-katsunoya",
          "spot-tonkatsu-koyaji",
          "spot-ocean-tree"
        ]
      },
      {
        "day": 5,
        "title": "道之驛小農・永旺免稅衝刺・通堂拉麵經典・還車返台",
        "startTime": "09:00",
        "spotIds": [
          "spot-ocean-tree",
          "spot-toyosaki-roadside",
          "spot-aeon-naha",
          "spot-tondo-ramen",
          "spot-toyota",
          "spot-naha-airport"
        ]
      }
    ]
  },
  "senior_3d": {
    "title": "40~60歲 熟齡舒活・海味祈福 3天慢遊",
    "subtitle": "低步數平緩動線、清雅鮮魚熱湯、心靈古剎祈福與海景休憩沙發",
    "badge": "40~60歲推薦",
    "days": [
      {
        "day": 1,
        "title": "機場接駁・潮崎舒活生鮮・海之樹海景歇息・好市多熱濃湯",
        "startTime": "11:00",
        "spotIds": [
          "spot-toyota",
          "spot-san-a-shiozaki",
          "spot-ocean-tree",
          "spot-costco-nanjo",
          "spot-ocean-tree"
        ]
      },
      {
        "day": 2,
        "title": "糸滿產地鮮甜海鮮・iias海景沙發放鬆・漁民食堂時令煎魚",
        "startTime": "09:00",
        "spotIds": [
          "spot-ocean-tree",
          "spot-itoman-fish",
          "spot-iias-toyosaki",
          "spot-dmm-aquarium",
          "spot-itoman-gyomin",
          "spot-ocean-tree"
        ]
      },
      {
        "day": 3,
        "title": "護國神社晨行・波上宮求平安御守・敘敘苑軟嫩和牛・道之驛純黑糖・還車返台",
        "startTime": "09:00",
        "spotIds": [
          "spot-ocean-tree",
          "spot-gokoku-shrine",
          "spot-naminoue-shrine",
          "spot-jojoen",
          "spot-toyosaki-roadside",
          "spot-tondo-ramen",
          "spot-toyota",
          "spot-naha-airport"
        ]
      }
    ]
  },
  "young_3d": {
    "title": "25~35歲 潮流美拍・巨城爆買 3天極速",
    "subtitle": "IG神級懸崖海景、EIBUN炙燒文青麵、PARCO CITY瘋買、小希臘夕陽客機與阿古豬居酒屋",
    "badge": "25~35歲推薦",
    "days": [
      {
        "day": 1,
        "title": "自駕首航・好市多派對採買・北谷美國村週末煙火首排",
        "startTime": "11:30",
        "spotIds": [
          "spot-toyota",
          "spot-costco-nanjo",
          "spot-ocean-tree",
          "spot-american-village",
          "spot-ocean-tree"
        ]
      },
      {
        "day": 2,
        "title": "糸滿海膽焗烤龍蝦痛風早餐・DMM懸空玻璃水族館・EIBUN炙燒麵・瀨長島飛機日落",
        "startTime": "09:00",
        "spotIds": [
          "spot-itoman-fish",
          "spot-dmm-aquarium",
          "spot-eibun-soba",
          "spot-dfs-okinawa",
          "spot-senagajima",
          "spot-maxvalu"
        ]
      },
      {
        "day": 3,
        "title": "達磨寺紅不倒翁美拍・敘敘苑海景燒肉・PARCO CITY血拼・小やじ阿古豬・通堂男人麵返台",
        "startTime": "09:30",
        "spotIds": [
          "spot-daruma-temple",
          "spot-jojoen",
          "spot-parco-city",
          "spot-workman-plus",
          "spot-tonkatsu-koyaji",
          "spot-tondo-ramen",
          "spot-toyota",
          "spot-naha-airport"
        ]
      }
    ]
  },
  "cross_2d": {
    "title": "跨世代雙贏全家歡樂 2天精華版",
    "subtitle": "精選長幼咸宜高分景點，美食與景觀兼備，零磨擦共融自駕",
    "badge": "跨世代首選",
    "days": [
      {
        "day": 1,
        "title": "取車出發・糸滿現剖海鮮熱魚湯・iias海景觀景台・漁民食堂招牌煎魚",
        "startTime": "10:30",
        "spotIds": [
          "spot-toyota",
          "spot-itoman-fish",
          "spot-iias-toyosaki",
          "spot-dmm-aquarium",
          "spot-itoman-gyomin",
          "spot-ocean-tree"
        ]
      },
      {
        "day": 2,
        "title": "波上宮海景祈願・敘敘苑落地海景頂級燒肉・瀨長島純白落日・通堂雙麵返台",
        "startTime": "09:00",
        "spotIds": [
          "spot-ocean-tree",
          "spot-naminoue-shrine",
          "spot-jojoen",
          "spot-parco-city",
          "spot-senagajima",
          "spot-tondo-ramen",
          "spot-toyota",
          "spot-naha-airport"
        ]
      }
    ]
  }
};

// ============================================================================
// CROSS-GENERATION ROAD TRIP TRAVEL GUIDELINES
// ============================================================================
const CROSS_GEN_GUIDELINES = {
  "title": "40~60歲 × 25~35歲 跨世代自駕共融寶典",
  "subtitle": "解決世代旅遊痛點，讓長輩舒心、年輕人盡興的5大黃金相處法則",
  "rules": [
    {
      "id": "cg-1",
      "title": "⏰ 作息折衷律：晨間9點啟程，午間安排室內空調休整",
      "desc": "長輩通常清晨6-7點即醒，年輕人習慣晚起。約定統一『每日 08:45-09:00 出發』，長輩可先在Villa露台泡茶看海報紙，年輕人充飽睡眠。每日 12:30-14:30 正午時分安排在室內大商場（如PARCO CITY、iias）或景觀餐廳享用午餐，避開高溫紫外線並提供長輩午間小憩。"
    },
    {
      "id": "cg-2",
      "title": "🚻 90分鐘如廁停靠律：自駕逢休息站必停，絕不憋尿",
      "desc": "自駕行程每行駛 60 至 90 分鐘，主動靠站（便利商店、道之驛、超市或景點洗手間）。不需特別問『要不要上廁所』，直接停車宣布『下車活動伸展5分鐘，順便上洗手間』，長輩體面無心理負擔，也能避免長途久坐腿部水腫僵硬。"
    },
    {
      "id": "cg-3",
      "title": "🍜 餐飲雙軌制：選有清爽熱湯又有濃郁肉食的特色名店",
      "desc": "40~60歲忌諱油膩死鹹，偏愛新鮮清甜、軟嫩易咀嚼與溫熱湯品；25~35歲熱愛打卡炙燒、厚切肉食與濃郁香氣。本行程嚴選之『琉球新麵 通堂（男人麵濃豚骨 vs 女人麵清鹽雞湯）』、『糸滿魚市場（焗烤龍蝦 vs 現剖生魚片鮮魚湯）』、『敘敘苑午間海景燒肉』與『EIBUN文青沖繩麵』完美兼顧雙重口味！"
    },
    {
      "id": "cg-4",
      "title": "🛍️ 分流放風不走散：大商場約定會合點，不強求全程綁在一起",
      "desc": "在巨型商城（如PARCO CITY、AEON、DFS），切忌強迫全家跟著同一步調逛。抵達時立即約定『2F面海觀景沙發區或星巴克』為基地，約定90分鐘後碰面。長輩吹海風看海喝茶聊八卦，年輕人快步血拼潮流服飾與免稅品，彼此自由且互不埋怨等待。"
    },
    {
      "id": "cg-5",
      "title": "📸 拍照互相尊重：主動為長輩留影，保留年輕人3分鐘打卡空檔",
      "desc": "在波上宮、美國村、瀨長島等絕景，年輕人主動引導長輩站在光線柔和角度拍攝精神抖擻的紀念照與全家福；長輩也包容年輕人拍攝短影音與網美打卡照。多拍合照、隨時在車上AirDrop分享照片，全家共同創造跨世代珍貴回憶！"
    }
  ]
};
