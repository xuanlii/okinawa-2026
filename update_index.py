import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update navigation in header
nav_search = """          <li><a href="#schedule-section" class="nav-link active">🗓️ 每日行程</a></li>
          <li><a href="#map-section" class="nav-link">🗺️ 路線地圖</a></li>"""

nav_replace = """          <li><a href="#schedule-section" class="nav-link active" id="nav-schedule-link">🗓️ 官方行程</a></li>
          <li><a href="#schedule-section" class="nav-link" id="nav-planner-link">🛠️ 自由客製規劃</a></li>
          <li><a href="#map-section" class="nav-link">🗺️ 路線地圖</a></li>"""

if nav_search in html:
    html = html.replace(nav_search, nav_replace, 1)

# 2. Update Hero Badges and Action buttons
hero_badges_search = """      <div class="hero-badge-group">
        <span class="hero-pill">📅 2026/12/12 (六) - 12/16 (三) · 5天4夜</span>
        <span class="hero-pill">🚗 沖繩南部與中部 自駕探險</span>
        <span class="hero-pill accent">✨ 去趣 ChicTrip 官方精選路線</span>
      </div>"""

hero_badges_replace = """      <div class="hero-badge-group">
        <span class="hero-pill">📅 2026/12/12 (六) - 12/16 (三) · 5天4夜</span>
        <span class="hero-pill">🚗 沖繩南部與中部 自駕探險</span>
        <span class="hero-pill accent">✨ 去趣 ChicTrip 官方精選路線</span>
        <span class="hero-pill accent" style="background:linear-gradient(135deg,#059669,#0284c7);color:#fff;">👥 40~60歲 × 25~35歲 跨世代專屬適配</span>
        <span class="hero-pill" style="border-color:#10b981;color:#059669;">⏱️ 車程時間自動計算</span>
        <span class="hero-pill" style="border-color:#f59e0b;color:#d97706;">🛠️ 自由組合行程 Studio</span>
      </div>"""

if hero_badges_search in html:
    html = html.replace(hero_badges_search, hero_badges_replace, 1)

hero_cta_search = """      <div class="hero-cta-group">
        <a href="https://chictrip-share.app.link/SOyJSS7fi6b" target="_blank" rel="noopener" class="btn btn-chictrip">
          <span>📲 在去趣 App 查看完整行程路線</span>
        </a>
        <a href="#schedule-section" class="btn btn-primary">
          <span>🗓️ 瀏覽每日詳細時程</span>
        </a>
        <button class="btn btn-secondary btn-copy-chictrip">
          <span>🔗 一鍵複製分享連結</span>
        </button>
        <button class="btn btn-secondary btn-print-itinerary hero-print-btn">
          <span>🖨️ 列印行程手冊 (PDF)</span>
        </button>
      </div>"""

hero_cta_replace = """      <div class="hero-cta-group">
        <button class="btn btn-primary" id="hero-btn-planner" style="background:linear-gradient(135deg,#0284c7,#7c3aed);border:none;box-shadow:0 4px 15px rgba(124,58,237,0.35);">
          <span>🛠️ 立即自組客製行程 (自由規劃 Studio)</span>
        </button>
        <a href="#schedule-section" class="btn btn-secondary" id="hero-btn-official">
          <span>🗓️ 瀏覽官方精選 5天4夜時程</span>
        </a>
        <a href="https://chictrip-share.app.link/SOyJSS7fi6b" target="_blank" rel="noopener" class="btn btn-chictrip">
          <span>📲 去趣 App 路線</span>
        </a>
        <button class="btn btn-secondary btn-copy-chictrip">
          <span>🔗 複製分享連結</span>
        </button>
        <button class="btn btn-secondary btn-print-itinerary hero-print-btn">
          <span>🖨️ 列印行程手冊 (PDF)</span>
        </button>
      </div>"""

if hero_cta_search in html:
    html = html.replace(hero_cta_search, hero_cta_replace, 1)

# 3. Mode Switcher & Generation Perspective Bar right at top of schedule control bar
schedule_bar_search = """  <section class="schedule-control-bar" id="schedule-section">
    <div class="container">
      <!-- Day Switcher Tabs -->
      <div class="day-tabs-scroll" id="day-tabs-container">
        <!-- Dynamically injected via JS -->
      </div>

      <!-- Secondary Filters & Search -->
      <div class="filter-row">
        <div class="category-pills">
          <button class="cat-pill active" data-category="all">✨ 全部節點</button>
          <button class="cat-pill" data-category="food">🍣 老饕美食</button>
          <button class="cat-pill" data-category="shopping">🛍️ 購物商場</button>
          <button class="cat-pill" data-category="attraction">⛩️ 景點文化</button>
          <button class="cat-pill" data-category="transport-hotel">🚗 交通/住宿</button>
          <button class="cat-pill" data-category="favorites">⭐ 我的收藏</button>
        </div>"""

schedule_bar_replace = """  <section class="schedule-control-bar" id="schedule-section">
    <div class="container">
      
      <!-- Itinerary Mode Switcher (Official 5-Day vs Custom Planner Studio) -->
      <div class="itinerary-mode-tabs-container">
        <button class="mode-tab-btn active" id="btn-mode-official" data-mode="official">
          <span class="mode-icon">🗓️</span>
          <span class="mode-text">官方推薦 5天4夜行程</span>
        </button>
        <button class="mode-tab-btn" id="btn-mode-planner" data-mode="planner">
          <span class="mode-icon">🛠️</span>
          <span class="mode-text">自由客製行程規劃器 (自組行程 Studio)</span>
          <span class="mode-badge">✨ 自由組合</span>
        </button>
      </div>

      <!-- Generation Perspective Switcher Bar (Dual-Generation Mode) -->
      <div class="generation-perspective-bar" id="generation-perspective-bar">
        <div class="gen-bar-left">
          <span class="gen-bar-icon">👥</span>
          <span class="gen-bar-title">世代需求導航：</span>
        </div>
        <div class="gen-bar-buttons">
          <button class="gen-btn active" data-gen="both" title="全覽：同時展開40~60歲熟齡長輩與25~35歲年輕族群雙向需求與共處錦囊">
            <span>👥 跨世代雙視角全覽</span>
          </button>
          <button class="gen-btn" data-gen="senior" title="熟齡舒活：聚焦低步數負擔、無障礙動線、座椅空調、清淡海味、身心祈福">
            <span>🧓 40~60歲 熟齡舒活視角</span>
          </button>
          <button class="gen-btn" data-gen="young" title="年輕探索：聚焦IG美拍照、排隊話題美食、潮流服飾、戶外露營、深夜微醺">
            <span>📸 25~35歲 年輕探索視角</span>
          </button>
        </div>
      </div>

      <!-- Official Schedule Filter Controls (Shown in official mode) -->
      <div id="official-filter-controls">
        <!-- Day Switcher Tabs -->
        <div class="day-tabs-scroll" id="day-tabs-container">
          <!-- Dynamically injected via JS -->
        </div>

        <!-- Secondary Filters & Search -->
        <div class="filter-row">
          <div class="category-pills">
            <button class="cat-pill active" data-category="all">✨ 全部節點</button>
            <button class="cat-pill" data-category="food">🍣 老饕美食</button>
            <button class="cat-pill" data-category="shopping">🛍️ 購物商場</button>
            <button class="cat-pill" data-category="attraction">⛩️ 景點文化</button>
            <button class="cat-pill" data-category="transport-hotel">🚗 交通/住宿</button>
            <button class="cat-pill" data-category="senior">🧓 40-60長輩首選</button>
            <button class="cat-pill" data-category="young">📸 25-35年輕熱門</button>
            <button class="cat-pill" data-category="harmony">🤝 跨世代全家共融</button>
            <button class="cat-pill" data-category="favorites">⭐ 我的收藏</button>
          </div>"""

if schedule_bar_search in html:
    html = html.replace(schedule_bar_search, schedule_bar_replace, 1)

# Ensure official-filter-controls closes cleanly before section ends
old_search_block = """        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="schedule-search-input" class="search-input" placeholder="搜尋景點、美食、MapCode...">
          <button id="schedule-search-clear" class="search-clear">✕</button>
        </div>
      </div>
    </div>
  </section>"""

new_search_block = """        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="schedule-search-input" class="search-input" placeholder="搜尋景點、美食、MapCode...">
          <button id="schedule-search-clear" class="search-clear">✕</button>
        </div>
        </div>
      </div>
    </div>
  </section>"""

if old_search_block in html:
    html = html.replace(old_search_block, new_search_block, 1)

# 4. In timeline-column: add custom-planner-container
timeline_col_search = """        <!-- Left: Timeline Stream Column -->
        <div class="timeline-column">
          <!-- Active Day Header Banner -->
          <div id="active-day-banner" class="day-header-banner">
            <!-- Injected by app.js -->
          </div>

          <!-- Timeline Items Container -->
          <div class="timeline-stream" id="timeline-items-list">
            <!-- Injected by app.js -->
          </div>
        </div>"""

timeline_col_replace = """        <!-- Left: Timeline Stream Column -->
        <div class="timeline-column">
          
          <!-- OFFICIAL SCHEDULE CONTAINER -->
          <div id="official-schedule-container">
            <!-- Active Day Header Banner -->
            <div id="active-day-banner" class="day-header-banner">
              <!-- Injected by app.js -->
            </div>

            <!-- Timeline Items Container -->
            <div class="timeline-stream" id="timeline-items-list">
              <!-- Injected by app.js -->
            </div>
          </div>

          <!-- CUSTOM ITINERARY PLANNER STUDIO CONTAINER -->
          <div id="custom-planner-container" class="planner-studio-container" style="display: none;">
            
            <!-- Planner Day Navigation -->
            <div class="planner-day-nav">
              <div class="planner-day-tabs" id="planner-day-tabs">
                <!-- Injected dynamically by app.js -->
              </div>
              <div class="planner-day-actions">
                <button id="btn-planner-add-day" class="btn btn-secondary btn-sm" title="增加自組行程天數">➕ 新增天數</button>
                <button id="btn-planner-del-day" class="btn btn-secondary btn-sm" style="color:#ef4444;" title="刪除目前選取的天數">✕ 刪除當日</button>
              </div>
            </div>

            <!-- Planner Actions & Presets Control Card -->
            <div class="planner-control-card">
              <div class="planner-control-row">
                <div class="planner-time-box">
                  <span>⏰ 當日啟程：</span>
                  <input type="time" id="planner-day-start-time" class="form-control-time" value="09:00" title="設定此日出發時間，系統將自動推算全日各景點抵達與出發時刻">
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <select id="planner-preset-select" class="form-control-select" aria-label="載入經典範本">
                    <option value="">⚡ 載入經典範本...</option>
                    <option value="official_5d">🌟 官方推薦 5天4夜自駕經典</option>
                    <option value="senior_3d">🧓 40~60歲 熟齡舒活・海味祈福 3天慢遊</option>
                    <option value="young_3d">📸 25~35歲 潮流美拍・巨城爆買 3天極速</option>
                    <option value="cross_2d">🤝 跨世代雙贏全家歡樂 2天精華版</option>
                  </select>
                  <button id="btn-planner-open-spot-picker" class="btn btn-primary btn-sm">➕ 新增景點</button>
                </div>
              </div>

              <div class="planner-control-row">
                <div class="planner-btn-group">
                  <button id="btn-planner-copy-text" class="btn btn-secondary btn-sm" title="複製完整行程時間表至剪貼簿">📋 複製行程文字</button>
                  <button id="btn-planner-print" class="btn btn-secondary btn-sm" title="列印或另存為PDF行程手冊">🖨️ 列印/PDF</button>
                  <button id="btn-planner-export-json" class="btn btn-secondary btn-sm" title="備份下載JSON格式行程">📤 匯出備份</button>
                  <button id="btn-planner-import-json-btn" class="btn btn-secondary btn-sm" title="匯入已備份的行程檔案">📥 匯入行程</button>
                  <input type="file" id="planner-import-file-input" accept=".json" style="display:none;">
                  <button id="btn-planner-clear-day" class="btn btn-secondary btn-sm" style="color:#ef4444;" title="清空當日已排節點">🗑️ 清空當日</button>
                </div>
                <span style="font-size:0.775rem; color:var(--text-subtle);">※ 異動即時自動儲存於瀏覽器</span>
              </div>
            </div>

            <!-- Dynamic Live Driving & Activity Statistics Dashboard -->
            <div class="planner-dashboard" id="planner-dashboard">
              <div class="planner-stat-card">
                <div class="planner-stat-icon">🚗</div>
                <div>
                  <div class="planner-stat-val" id="stat-drive-time">0 分</div>
                  <div class="planner-stat-label">預估總行車時間</div>
                </div>
              </div>
              <div class="planner-stat-card">
                <div class="planner-stat-icon">🛣️</div>
                <div>
                  <div class="planner-stat-val" id="stat-drive-dist">0.0 km</div>
                  <div class="planner-stat-label">預估總行駛里程</div>
                </div>
              </div>
              <div class="planner-stat-card">
                <div class="planner-stat-icon">⏱️</div>
                <div>
                  <div class="planner-stat-val" id="stat-activity-time">0 分</div>
                  <div class="planner-stat-label">景點活動總時長</div>
                </div>
              </div>
              <div class="planner-stat-card">
                <div class="planner-stat-icon">🏁</div>
                <div>
                  <div class="planner-stat-val" id="stat-finish-time">--:--</div>
                  <div class="planner-stat-label">預計結束返宿時間</div>
                </div>
              </div>
              <div class="planner-stat-card">
                <div class="planner-stat-icon">📍</div>
                <div>
                  <div class="planner-stat-val" id="stat-stops-count">0 處</div>
                  <div class="planner-stat-label">當日停靠節點</div>
                </div>
              </div>
            </div>

            <!-- Alert Notification Box -->
            <div class="planner-alert-box" id="planner-alert-box" style="display:none;"></div>

            <!-- Ordered Stops Stream -->
            <div class="planner-stops-stream" id="planner-stops-stream">
              <!-- Dynamically populated by app.js -->
            </div>
          </div>

        </div>"""

if timeline_col_search in html:
    html = html.replace(timeline_col_search, timeline_col_replace, 1)

# 5. Add Spot Picker Modal before spot-detail-modal
spot_picker_modal = """  <!-- ==========================================================================
       Spot Picker Modal Dialog (For Custom Itinerary Builder)
       ========================================================================== -->
  <div class="modal-overlay" id="spot-picker-modal">
    <div class="modal-dialog modal-dialog-wide">
      <div class="modal-drag-handle" aria-hidden="true"></div>
      <div class="modal-header">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800;">📍 選擇景點加入當日行程</h3>
          <div style="font-size: 0.825rem; color: var(--text-muted);">瀏覽 30 處沖繩精選節點或新增自訂景點，系統將自動計算車程</div>
        </div>
        <button class="modal-close-btn" id="picker-modal-close-btn" aria-label="關閉">✕</button>
      </div>

      <div class="picker-filter-bar">
        <div class="search-box" style="width:100%;">
          <span class="search-icon">🔍</span>
          <input type="text" id="picker-search-input" class="search-input" placeholder="搜尋景點名稱、MapCode、特色標籤...">
        </div>

        <div class="picker-cat-pills" id="picker-cat-pills">
          <button class="cat-pill active" data-picker-cat="all">✨ 全部類別</button>
          <button class="cat-pill" data-picker-cat="food">🍣 老饕美食</button>
          <button class="cat-pill" data-picker-cat="shopping">🛍️ 購物商場</button>
          <button class="cat-pill" data-picker-cat="attraction">⛩️ 景點文化</button>
          <button class="cat-pill" data-picker-cat="hotel">🏡 住宿基地</button>
          <button class="cat-pill" data-picker-cat="transport">🚗 交通租還</button>
        </div>

        <div class="picker-gen-pills" id="picker-gen-pills">
          <button class="pill-badge active" data-picker-gen="all">👥 全部年齡</button>
          <button class="pill-badge" data-picker-gen="senior">🧓 40~60歲 長輩首選</button>
          <button class="pill-badge" data-picker-gen="young">📸 25~35歲 年輕熱門</button>
          <button class="pill-badge" data-picker-gen="harmony">🤝 跨世代高契合</button>
        </div>
      </div>

      <div class="picker-modal-body" id="picker-spots-grid">
        <!-- Injected dynamically from SPOTS_CATALOG by app.js -->
      </div>

      <div class="picker-custom-add-toggle">
        <button class="btn btn-secondary btn-sm" id="btn-toggle-custom-stop-form">➕ 新增自訂私房景點 (如自訂飯店、特色餐廳)</button>
        <div id="custom-stop-form" class="custom-stop-form" style="display:none;">
          <div class="form-grid-2">
            <input type="text" id="custom-spot-name" class="form-control" placeholder="景點/地點名稱 (如：名護居酒屋)" required>
            <select id="custom-spot-category" class="form-control">
              <option value="food">🍣 美食餐廳</option>
              <option value="attraction">⛩️ 景觀景點</option>
              <option value="shopping">🛍️ 購物商場</option>
              <option value="hotel">🏡 旅宿基地</option>
              <option value="transport">🚗 交通中繼</option>
            </select>
          </div>
          <div class="form-grid-2" style="margin-top:0.5rem;">
            <input type="number" id="custom-spot-duration" class="form-control" placeholder="預計停留時間 (分鐘，如：60)" value="60">
            <input type="text" id="custom-spot-address" class="form-control" placeholder="地址或備註 (例：沖繩縣恩納村)">
          </div>
          <button id="btn-submit-custom-stop" class="btn btn-primary btn-sm" style="margin-top:0.5rem;">加入當日行程</button>
        </div>
      </div>
    </div>
  </div>

"""

detail_modal_search = """  <!-- ==========================================================================
       Spot Detail Modal Dialog
       ========================================================================== -->"""

if detail_modal_search in html:
    html = html.replace(detail_modal_search, spot_picker_modal + detail_modal_search, 1)

# 6. Add Cross-Gen Guide tab in Toolkit
toolkit_tabs_search = """      <div class="toolkit-tabs-nav">
        <button class="toolkit-tab-btn active" data-target="panel-weather">🌤️ 12月氣候穿搭</button>
        <button class="toolkit-tab-btn" data-target="panel-driving">🚗 日本右駕守則</button>
        <button class="toolkit-tab-btn" data-target="panel-checklist">🎒 必備行李清單</button>
        <button class="toolkit-tab-btn" data-target="panel-budget">💴 日圓記帳計算機</button>
        <button class="toolkit-tab-btn" data-target="panel-food">🍱 老饕必吃指南</button>
      </div>"""

toolkit_tabs_replace = """      <div class="toolkit-tabs-nav">
        <button class="toolkit-tab-btn active" data-target="panel-crossgen">👥 跨世代共融寶典</button>
        <button class="toolkit-tab-btn" data-target="panel-weather">🌤️ 12月氣候穿搭</button>
        <button class="toolkit-tab-btn" data-target="panel-driving">🚗 日本右駕守則</button>
        <button class="toolkit-tab-btn" data-target="panel-checklist">🎒 必備行李清單</button>
        <button class="toolkit-tab-btn" data-target="panel-budget">💴 日圓記帳計算機</button>
        <button class="toolkit-tab-btn" data-target="panel-food">🍱 老饕必吃指南</button>
      </div>

      <!-- Tab: Cross-Generation Travel Handbook -->
      <div class="toolkit-panel active" id="panel-crossgen">
        <div style="background: linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(124, 58, 237, 0.08)); padding: 1.5rem; border-radius: var(--radius-md); border-left: 5px solid #7c3aed; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.2rem; font-weight: 800; color: #7c3aed; margin-bottom: 0.35rem;">👥 40~60歲 × 25~35歲 跨世代自駕共融寶典</h3>
          <p style="font-size: 0.925rem; color: var(--text-main); line-height: 1.6;">
            帶父母出遊如何皆大歡喜？掌握5大黃金相處法則，兼顧長輩的體力作息與年輕人的探索打卡，讓全家共創零磨擦的南國自駕美好回憶！
          </p>
        </div>

        <div class="driving-rules-grid">
          <div class="driving-rule-card" style="border-top: 4px solid #0284c7;">
            <h4>⏰ 1. 作息折衷律</h4>
            <p>長輩習慣早起，年輕人夜間活躍。約定<strong>每日 08:45-09:00 統一出發</strong>；長輩清晨可在Villa露台泡茶看海，正午 12:30-14:30 安排在大型室內商場吹冷氣享用午餐與小憩，避開烈日與疲憊。</p>
          </div>
          <div class="driving-rule-card" style="border-top: 4px solid #059669;">
            <h4>🚻 2. 90分鐘如廁停靠律</h4>
            <p>自駕每行駛 <strong>60 至 90 分鐘主動靠站</strong>（超商、道之驛、超市或景點洗手間）。不需詢問，直接停車宣布「下車活動筋骨5分鐘順便如廁」，長輩體面無心理負擔，更能預防腿部水腫。</p>
          </div>
          <div class="driving-rule-card" style="border-top: 4px solid #f59e0b;">
            <h4>🍜 3. 餐飲雙軌制</h4>
            <p>嚴選<strong>兼具清淡熱湯與濃郁肉食</strong>的特色名店！如通堂拉麵（清雅女人麵 vs 濃郁男人麵）、糸滿魚市場（清甜鮮魚湯 vs 焗烤龍蝦生蠔）、敘敘苑（軟嫩無煙和牛）與EIBUN沖繩麵，滿足各年齡味蕾。</p>
          </div>
          <div class="driving-rule-card" style="border-top: 4px solid #8b5cf6;">
            <h4>🛍️ 4. 分流放風不走散</h4>
            <p>在巨型商城（PARCO CITY、iias、AEON、DFS），抵達時立即約定<strong>「面海觀景沙發區或咖啡廳」為基地</strong>，約定90分鐘後碰面。長輩悠閒品茗看海，年輕人快步血拼，互不牽絆等待。</p>
          </div>
          <div class="driving-rule-card" style="border-top: 4px solid #ec4899;">
            <h4>📸 5. 拍照互相尊重</h4>
            <p>主動引導長輩在柔和光線下拍攝精神端莊的紀念照與全家福；長輩也包容年輕人拍攝網美短影音。隨時透過手機<strong>AirDrop即時分享照片</strong>，讓長輩傳給親友群組分享喜悅！</p>
          </div>
          <div class="driving-rule-card" style="border-top: 4px solid #10b981;">
            <h4>🚗 6. 車座艙舒適律</h4>
            <p>長輩畏寒怕冷風直吹，將冷氣出風口朝上或隨車備薄毛毯；播放經典放鬆的中日輕音樂，車速平穩過彎減速，讓全車乘客安心小憩。</p>
          </div>
        </div>
      </div>"""

if toolkit_tabs_search in html:
    html = html.replace(toolkit_tabs_search, toolkit_tabs_replace, 1)

# Ensure panel-weather is no longer active
weather_active = '<div class="toolkit-panel active" id="panel-weather">'
weather_inactive = '<div class="toolkit-panel" id="panel-weather">'
if weather_active in html:
    html = html.replace(weather_active, weather_inactive, 1)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("index.html successfully updated!")
