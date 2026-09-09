/**
 * 2026/12 沖繩 5天4夜自駕行程 - 主應用邏輯
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     Safe Storage Helpers (Guards against SecurityError in Private Browsing/iFrames)
     ========================================================================== */
  const memoryStore = {};

  function safeStorageGet(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch (e) {
      return memoryStore[key] !== undefined ? memoryStore[key] : fallback;
    }
  }

  function safeStorageSet(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {
      memoryStore[key] = String(val);
    }
  }

  /* ==========================================================================
     HTML Sanitizer (Prevents XSS in custom items & expenses)
     ========================================================================== */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     Universal Clipboard Copy with Automatic Textarea Fallback
     ========================================================================== */
  function copyTextToClipboard(text, successMsg = '📋 已複製！') {
    if (navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        showToast(successMsg);
      } else {
        window.prompt('請手動複製以下內容：', text);
      }
    } catch (err) {
      window.prompt('請手動複製以下內容：', text);
    }
  }

  /* ==========================================================================
     Accurate Geodesic Haversine Distance Calculation
     ========================================================================== */
  function calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function formatTransitInfo(fromItem, toItem) {
    const dist = calcDistanceKm(fromItem.lat, fromItem.lng, toItem.lat, toItem.lng);
    if (dist < 0.8) {
      const meters = Math.max(50, Math.round(dist * 1000));
      const mins = Math.max(1, Math.round(meters / 75));
      return `🚶 步行約 ${meters} 公尺 (約 ${mins} 分鐘)`;
    }
    const estMins = Math.max(4, Math.round(dist * 2.2));
    return `🚗 車程約 ${dist.toFixed(1)} 公里 (預估 ${estMins} 分鐘)`;
  }

  // State Management
  const state = {
    activeDay: 0, // 0 = all days, 1..5
    activeCategory: 'all',
    searchQuery: '',
    favorites: JSON.parse(safeStorageGet('okinawa_favorites', '[]')),
    checklist: JSON.parse(safeStorageGet('okinawa_checklist', 'null')),
    expenses: JSON.parse(safeStorageGet('okinawa_expenses', '[]')),
    exchangeRate: parseFloat(safeStorageGet('okinawa_rate', '0.215')),
    theme: safeStorageGet('okinawa_theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')),
    map: null,
    markers: [],
    markerMap: new Map(),
    polyline: null
  };

  // Initialize Theme
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();

  // Initialize Packing Checklist if not in storage
  if (!state.checklist && typeof PACKING_CHECKLIST_DATA !== 'undefined') {
    state.checklist = PACKING_CHECKLIST_DATA.map(item => ({
      ...item,
      checked: false
    }));
    saveChecklist();
  }

  // Initialize Components
  initThemeToggle();
  initCountdown();
  initDayTabs();
  initCategoryPills();
  initSearch();
  initMap();
  renderTimeline();
  initToolkitTabs();
  initChecklist();
  initBudgetTracker();
  initChicTripSharing();
  initModal();
  initScrollspyAndBackToTop();

  /* ==========================================================================
     Theme Toggler
     ========================================================================== */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      safeStorageSet('okinawa_theme', state.theme);
      updateThemeIcon();
      showToast(state.theme === 'dark' ? '🌙 已切換為深色模式' : '☀️ 已切換為淺色模式');
    });
  }

  function updateThemeIcon() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    toggleBtn.innerHTML = state.theme === 'dark' 
      ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
      : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
  }

  /* ==========================================================================
     Departure Countdown
     ========================================================================== */
  function initCountdown() {
    const targetDate = new Date(TRIP_METADATA.departureDate).getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    const wrapEl = document.getElementById('countdown-wrap');

    if (!daysEl) return;
    let timerId = null;

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (wrapEl) {
          wrapEl.innerHTML = '<div class="countdown-val" style="font-size:1.25rem;font-weight:800;color:var(--primary);padding:1rem 0;">🎉 沖繩冬日海風自由行已啟程！祝自駕探險平安順心！</div>';
        }
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    timerId = setInterval(update, 1000);
  }

  /* ==========================================================================
     Day Tabs & Filter Controls
     ========================================================================== */
  function initDayTabs() {
    const container = document.getElementById('day-tabs-container');
    if (!container) return;
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'day-tab-btn active';
    allBtn.dataset.day = '0';
    allBtn.innerHTML = `<span>🗓️ 全部行程 5天總覽</span> <span class="badge-count">${SCHEDULE_ITEMS.length}</span>`;
    container.appendChild(allBtn);

    DAY_SUMMARIES.forEach(d => {
      const btn = document.createElement('button');
      btn.className = 'day-tab-btn';
      btn.dataset.day = String(d.day);
      btn.innerHTML = `<span>Day ${d.day} (${d.date.slice(5)})</span> <span class="badge-count">${d.stopsCount}</span>`;
      container.appendChild(btn);
    });

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.day-tab-btn');
      if (!btn) return;
      container.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeDay = parseInt(btn.dataset.day, 10);
      renderTimeline();
      updateMapMarkers();
      updateCategoryPillCounts();
    });
  }

  function initCategoryPills() {
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.dataset.category;
        renderTimeline();
        updateMapMarkers();
      });
    });
    updateCategoryPillCounts();
  }

  function updateCategoryPillCounts() {
    const dayFiltered = state.activeDay === 0 
      ? SCHEDULE_ITEMS 
      : SCHEDULE_ITEMS.filter(i => i.day === state.activeDay);

    const counts = {
      all: dayFiltered.length,
      food: dayFiltered.filter(i => i.category === 'food').length,
      shopping: dayFiltered.filter(i => i.category === 'shopping').length,
      attraction: dayFiltered.filter(i => i.category === 'attraction').length,
      'transport-hotel': dayFiltered.filter(i => i.category === 'transport' || i.category === 'hotel').length,
      favorites: dayFiltered.filter(i => state.favorites.includes(i.id)).length
    };

    const pillLabels = {
      all: '✨ 全部節點',
      food: '🍣 老饕美食',
      shopping: '🛍️ 購物商場',
      attraction: '⛩️ 景點文化',
      'transport-hotel': '🚗 交通/住宿',
      favorites: '⭐ 我的收藏'
    };

    document.querySelectorAll('.cat-pill').forEach(pill => {
      const cat = pill.dataset.category;
      if (pillLabels[cat] !== undefined) {
        pill.innerHTML = `${pillLabels[cat]} <span class="badge-count" style="margin-left:0.35rem;font-size:0.75rem;opacity:0.85;">${counts[cat]}</span>`;
      }
    });
  }

  function initSearch() {
    const input = document.getElementById('schedule-search-input');
    const clearBtn = document.getElementById('schedule-search-clear');
    if (!input) return;

    input.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderTimeline();
      updateMapMarkers();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        state.searchQuery = '';
        clearBtn.style.display = 'none';
        renderTimeline();
        updateMapMarkers();
      });
    }
  }

  /* ==========================================================================
     Filtering Logic (Enhanced with MapCode, Category, Time, and Day Query)
     ========================================================================== */
  function matchSearchQuery(item, q) {
    if (!q) return true;

    // Direct string match on primary fields
    if (item.name && item.name.toLowerCase().includes(q)) return true;
    if (item.nameZh && item.nameZh.toLowerCase().includes(q)) return true;
    if (item.nameJa && item.nameJa.toLowerCase().includes(q)) return true;
    if (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q)) return true;
    if (item.time && item.time.toLowerCase().includes(q)) return true;
    if (item.duration && item.duration.toLowerCase().includes(q)) return true;
    if (item.desc && item.desc.toLowerCase().includes(q)) return true;
    if (item.tips && item.tips.toLowerCase().includes(q)) return true;
    if (item.address && item.address.toLowerCase().includes(q)) return true;
    if (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) return true;

    // MapCode matching (with & without spaces or asterisk)
    if (item.mapCode) {
      if (item.mapCode.toLowerCase().includes(q)) return true;
      const cleanQ = q.replace(/[\s\*\-]/g, '');
      const cleanMapCode = item.mapCode.replace(/[\s\*\-]/g, '').toLowerCase();
      if (cleanQ.length >= 2 && cleanMapCode.includes(cleanQ)) return true;
    }

    // Day token match (e.g. "day 1", "d1", "第1天")
    if (q.includes(`day ${item.day}`) || q.includes(`d${item.day}`) || q.includes(`第${item.day}天`)) {
      return true;
    }

    return false;
  }

  function getFilteredItems() {
    return SCHEDULE_ITEMS.filter(item => {
      // Day Filter
      if (state.activeDay !== 0 && item.day !== state.activeDay) {
        return false;
      }

      // Category Filter
      if (state.activeCategory === 'favorites') {
        if (!state.favorites.includes(item.id)) return false;
      } else if (state.activeCategory !== 'all') {
        if (state.activeCategory === 'transport-hotel') {
          if (item.category !== 'transport' && item.category !== 'hotel') return false;
        } else if (item.category !== state.activeCategory) {
          return false;
        }
      }

      // Search Query
      if (state.searchQuery && !matchSearchQuery(item, state.searchQuery)) {
        return false;
      }

      return true;
    });
  }

  /* ==========================================================================
     Timeline Rendering (Accurate Distances & Cross-linking)
     ========================================================================== */
  function renderTimeline() {
    const listContainer = document.getElementById('timeline-items-list');
    const bannerContainer = document.getElementById('active-day-banner');
    if (!listContainer) return;

    const filtered = getFilteredItems();

    // Render Active Day Header Banner
    if (bannerContainer) {
      if (state.activeDay === 0) {
        bannerContainer.innerHTML = `
          <div>
            <div class="day-header-title">🌟 5天4夜自駕行程 全景縱覽</div>
            <div class="day-header-tagline">從南城好市多、北谷煙火、那霸市區到浦添PARCO CITY，40個精彩停留時刻！</div>
          </div>
          <div class="day-header-meta">
            <span>📍 顯示 ${filtered.length} 處停靠點</span>
            <span>⭐ 已收藏 ${state.favorites.length} 個最愛</span>
          </div>
        `;
      } else {
        const dayInfo = DAY_SUMMARIES.find(d => d.day === state.activeDay);
        if (dayInfo) {
          bannerContainer.innerHTML = `
            <div>
              <div class="day-header-title">Day ${dayInfo.day} · ${escapeHtml(dayInfo.title)}</div>
              <div class="day-header-tagline">${escapeHtml(dayInfo.tagline)}</div>
            </div>
            <div class="day-header-meta">
              <span>📅 ${dayInfo.date} (${dayInfo.dayOfWeek})</span>
              <span>📍 當日符合條件 ${filtered.length} 個節點</span>
            </div>
          `;
        }
      }
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border: 1px dashed var(--border); border-radius: var(--radius-lg);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">沒有符合條件的行程景點</h3>
          <p style="color: var(--text-muted); font-size: 0.885rem;">試著清除關鍵字搜尋或切換分類篩選標籤。</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach((item, index) => {
      const isFav = state.favorites.includes(item.id);
      const isLast = index === filtered.length - 1;
      const nextItem = filtered[index + 1];

      // Accurate Haversine Transit calculation
      let transitHtml = '';
      if (!isLast && nextItem && item.day === nextItem.day) {
        const transitText = formatTransitInfo(item, nextItem);
        transitHtml = `
          <div class="transit-connector">
            <span>🚗</span>
            <span>前往下一站：<strong>${escapeHtml(nextItem.nameZh)}</strong> (${transitText})</span>
          </div>
        `;
      }

      html += `
        <div class="timeline-item" id="item-${escapeHtml(item.id)}">
          <div class="timeline-node">${item.icon}</div>
          <div class="timeline-card">
            <div class="card-top">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="card-time-badge">⏰ ${item.time}</span>
                <span class="card-duration-badge">⏱️ ${item.duration}</span>
                <span class="tag-badge" style="background: var(--primary-light); color: var(--primary);">${escapeHtml(item.categoryLabel)}</span>
                <span class="tag-badge" style="background: var(--bg-subtle); color: var(--text-muted); font-family: monospace;">MC: ${escapeHtml(item.mapCode)}</span>
              </div>
              <div class="card-actions-top">
                <button class="btn-star-fav ${isFav ? 'favorited' : ''}" data-id="${escapeHtml(item.id)}" title="${isFav ? '取消收藏' : '加入收藏'}">
                  ${isFav ? '★' : '☆'}
                </button>
              </div>
            </div>

            <div class="card-title-group">
              <h3 class="card-title">${escapeHtml(item.nameZh)}</h3>
              <div class="card-subtitle">${escapeHtml(item.name)} · ${escapeHtml(item.nameJa)}</div>
            </div>

            <p class="card-desc">${escapeHtml(item.desc)}</p>

            <div class="card-tags">
              ${item.tags.map(tag => `<span class="tag-badge">#${escapeHtml(tag)}</span>`).join('')}
            </div>

            <div class="card-footer">
              <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem;">
                <span>📍 ${escapeHtml(item.address)}</span>
              </div>
              <div class="card-footer-buttons">
                <button class="btn-card-action primary" data-action="modal" data-id="${escapeHtml(item.id)}">
                  <span>🔍 查看攻略</span>
                </button>
                <button class="btn-card-action locate" data-action="locate" data-id="${escapeHtml(item.id)}">
                  <span>📍 地圖定位</span>
                </button>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.googleQuery || item.name)}" target="_blank" rel="noopener" class="btn-card-action">
                  <span>🗺️ Google 導航</span>
                </a>
              </div>
            </div>
          </div>
          ${transitHtml}
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Attach Event Listeners to cards
    listContainer.querySelectorAll('.btn-star-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFavorite(btn.dataset.id);
      });
    });

    listContainer.querySelectorAll('[data-action="modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.appOpenModal(btn.dataset.id);
      });
    });

    listContainer.querySelectorAll('[data-action="locate"]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.appFocusOnMap(btn.dataset.id);
      });
    });
  }

  function toggleFavorite(id) {
    if (state.favorites.includes(id)) {
      state.favorites = state.favorites.filter(favId => favId !== id);
      showToast('已自最愛清單移除');
    } else {
      state.favorites.push(id);
      showToast('⭐ 已加入最愛清單！');
    }
    safeStorageSet('okinawa_favorites', JSON.stringify(state.favorites));
    renderTimeline();
    updateMapMarkers();
    updateCategoryPillCounts();
  }

  /* ==========================================================================
     Interactive Leaflet Map (Multi-visit Consolidation & Bidirectional Linking)
     ========================================================================== */
  function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') {
      if (mapContainer) {
        renderMapOfflineFallback(mapContainer);
      }
      return;
    }

    try {
      state.map = L.map('map', {
        center: [26.2124, 127.6809],
        zoom: 11,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(state.map);

      updateMapMarkers();
    } catch (e) {
      renderMapOfflineFallback(mapContainer);
    }
  }

  function renderMapOfflineFallback(container) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:2rem;text-align:center;color:var(--text-muted);background:var(--bg-subtle);">
        <div style="font-size:2.5rem;margin-bottom:0.5rem;">🗺️</div>
        <div style="font-weight:700;font-size:1.05rem;color:var(--text-main);margin-bottom:0.35rem;">地圖離線備援模式</div>
        <p style="font-size:0.85rem;line-height:1.5;max-width:320px;margin-bottom:1rem;">所有景點皆附有 MapCode 與 Google Maps 導航連結，可於各卡片中點擊直接啟動外部導航。</p>
        <a href="https://chictrip-share.app.link/SOyJSS7fi6b" target="_blank" rel="noopener" class="btn btn-chictrip" style="font-size:0.85rem;padding:0.45rem 1rem;">📲 在去趣 App 查看路線圖</a>
      </div>
    `;
  }

  function updateMapMarkers() {
    if (!state.map || typeof L === 'undefined') return;

    // Clear existing markers & polyline
    state.markers.forEach(m => state.map.removeLayer(m));
    state.markers = [];
    state.markerMap.clear();

    if (state.polyline) {
      state.map.removeLayer(state.polyline);
      state.polyline = null;
    }

    const filtered = getFilteredItems();
    if (filtered.length === 0) return;

    // Group items by coordinate to resolve identical positions
    const coordGroups = new Map();
    filtered.forEach(item => {
      const key = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
      if (!coordGroups.has(key)) {
        coordGroups.set(key, []);
      }
      coordGroups.get(key).push(item);
    });

    const latlngs = [];

    coordGroups.forEach((itemsAtCoord, key) => {
      const first = itemsAtCoord[0];
      const count = itemsAtCoord.length;
      latlngs.push([first.lat, first.lng]);

      const isMulti = count > 1;
      const pinHtml = isMulti 
        ? `<div class="custom-pin-wrapper">
             <div class="custom-pin ${first.category}" title="${escapeHtml(first.nameZh)} (${count}次停靠)">
               ${first.icon}
             </div>
             <span class="pin-multi-badge">×${count}</span>
           </div>`
        : `<div class="custom-pin ${first.category}" title="${escapeHtml(first.nameZh)}">
             ${first.icon}
           </div>`;

      const pinIcon = L.divIcon({
        className: 'custom-div-icon',
        html: pinHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([first.lat, first.lng], { icon: pinIcon }).addTo(state.map);

      // Popup Content Construction
      let popupHtml = '';
      if (!isMulti) {
        popupHtml = `
          <div style="font-family: inherit; font-size: 0.885rem; padding: 0.2rem; min-width: 190px;">
            <strong style="font-size: 0.98rem; display: block; margin-bottom: 0.25rem;">${escapeHtml(first.nameZh)}</strong>
            <div style="font-size: 0.775rem; margin-bottom: 0.45rem; opacity: 0.85;">⏰ ${first.time} (${first.duration})</div>
            <p style="font-size: 0.825rem; line-height: 1.4; margin-bottom: 0.55rem; opacity: 0.9;">${escapeHtml(first.desc.slice(0, 75))}...</p>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <button onclick="window.appOpenModal('${escapeHtml(first.id)}')" style="background:#0284c7;color:#fff;border:none;padding:0.25rem 0.55rem;border-radius:4px;font-size:0.75rem;cursor:pointer;font-weight:600;">查看攻略</button>
              <button onclick="window.appScrollToCard('${escapeHtml(first.id)}')" style="background:#e0f2fe;color:#0369a1;border:none;padding:0.25rem 0.55rem;border-radius:4px;font-size:0.75rem;cursor:pointer;font-weight:600;">行程卡片</button>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(first.googleQuery || first.name)}" target="_blank" style="padding:0.25rem 0.55rem;border-radius:4px;font-size:0.75rem;text-decoration:none;font-weight:600;">導航</a>
            </div>
          </div>
        `;
      } else {
        popupHtml = `
          <div style="font-family: inherit; font-size: 0.885rem; padding: 0.2rem; min-width: 230px;">
            <strong style="font-size: 0.98rem; display: block; margin-bottom: 0.2rem;">${escapeHtml(first.nameZh)}</strong>
            <div style="font-size: 0.775rem; color: #0284c7; font-weight: 700; margin-bottom: 0.45rem;">
              🏨 本景點共有 ${count} 次停靠節點：
            </div>
            <div style="max-height: 175px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.5rem; padding-right: 0.2rem;">
              ${itemsAtCoord.map(it => `
                <div style="background: rgba(0,0,0,0.04); padding: 0.35rem 0.5rem; border-radius: 6px; font-size: 0.775rem;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>Day ${it.day} · ⏰ ${it.time}</span>
                    <span style="opacity: 0.8;">${it.duration}</span>
                  </div>
                  <div style="opacity: 0.85; margin: 0.15rem 0 0.25rem;">${escapeHtml(it.categoryLabel)}</div>
                  <div style="display: flex; gap: 0.35rem;">
                    <button onclick="window.appOpenModal('${escapeHtml(it.id)}')" style="background:#0284c7;color:#fff;border:none;padding:0.2rem 0.45rem;border-radius:3px;font-size:0.72rem;cursor:pointer;">攻略</button>
                    <button onclick="window.appScrollToCard('${escapeHtml(it.id)}')" style="background:#e0f2fe;color:#0369a1;border:none;padding:0.2rem 0.45rem;border-radius:3px;font-size:0.72rem;cursor:pointer;">卡片</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(first.googleQuery || first.name)}" target="_blank" style="padding:0.25rem 0.55rem;border-radius:4px;font-size:0.75rem;text-decoration:none;font-weight:600;">🗺️ Google 導航</a>
            </div>
          </div>
        `;
      }

      marker.bindPopup(popupHtml);
      state.markers.push(marker);

      itemsAtCoord.forEach(it => {
        state.markerMap.set(it.id, marker);
      });
    });

    // Draw route polyline if single day selected
    if (state.activeDay !== 0 && latlngs.length > 1) {
      state.polyline = L.polyline(latlngs, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8'
      }).addTo(state.map);
    }

    if (latlngs.length > 0) {
      const bounds = L.latLngBounds(latlngs);
      state.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }

  /* ==========================================================================
     Bidirectional Focus Helpers (Timeline <-> Map)
     ========================================================================== */
  window.appFocusOnMap = function(itemId) {
    const item = SCHEDULE_ITEMS.find(s => s.id === itemId);
    if (!item) return;

    const marker = state.markerMap.get(itemId);
    if (state.map && marker) {
      state.map.setView([item.lat, item.lng], Math.max(state.map.getZoom(), 14), { animate: true });
      marker.openPopup();
    }

    // On smaller screens, scroll smoothly to the map section
    if (window.innerWidth <= 1024) {
      const mapSec = document.getElementById('map-section');
      if (mapSec) {
        mapSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    showToast(`📍 已在地圖定位：${item.nameZh}`);
  };

  window.appScrollToCard = function(itemId) {
    let cardEl = document.getElementById(`item-${itemId}`);
    
    // If card is currently hidden due to day filter, switch to that day first
    if (!cardEl) {
      const item = SCHEDULE_ITEMS.find(s => s.id === itemId);
      if (item) {
        state.activeDay = item.day;
        const dayTabs = document.querySelectorAll('.day-tab-btn');
        dayTabs.forEach(b => {
          if (b.dataset.day === String(item.day)) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
        state.activeCategory = 'all';
        document.querySelectorAll('.cat-pill').forEach(p => {
          if (p.dataset.category === 'all') p.classList.add('active');
          else p.classList.remove('active');
        });
        renderTimeline();
        updateMapMarkers();
        updateCategoryPillCounts();
        cardEl = document.getElementById(`item-${itemId}`);
      }
    }

    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cardEl.classList.remove('highlight-pulse');
      void cardEl.offsetWidth; // Trigger reflow
      cardEl.classList.add('highlight-pulse');
      setTimeout(() => cardEl.classList.remove('highlight-pulse'), 2400);
    }
  };

  /* ==========================================================================
     Spot Detail Modal
     ========================================================================== */
  window.appOpenModal = function(id) {
    const item = SCHEDULE_ITEMS.find(s => s.id === id);
    const modalOverlay = document.getElementById('spot-detail-modal');
    if (!item || !modalOverlay) return;

    document.getElementById('modal-title').textContent = item.nameZh;
    document.getElementById('modal-subtitle').textContent = `${item.name} (${item.nameJa})`;
    
    document.getElementById('modal-content').innerHTML = `
      <div style="margin-bottom: 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <span class="card-time-badge">⏰ 行程時間：Day ${item.day} · ${item.time}</span>
        <span class="card-duration-badge">⏱️ 停留時間：${item.duration}</span>
        <span class="tag-badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.8rem;">${escapeHtml(item.categoryLabel)}</span>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.35rem;">景點介紹與特色亮點</h4>
        <p style="font-size: 0.925rem; color: var(--text-muted); line-height: 1.6;">${escapeHtml(item.desc)}</p>
      </div>

      <div style="background: var(--bg-subtle); border-left: 4px solid var(--accent); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">💡 實用攻略與注意事項</h4>
        <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5;">${escapeHtml(item.tips)}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.25rem;">
        <div style="background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">日本車機 MapCode</div>
          <div style="font-family: monospace; font-size: 1rem; font-weight: 700; color: var(--primary); margin-top: 0.2rem;">${escapeHtml(item.mapCode)}</div>
        </div>
        <div style="background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">地址 / 區域</div>
          <div style="font-size: 0.85rem; font-weight: 600; margin-top: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.address)}">${escapeHtml(item.address)}</div>
        </div>
      </div>
    `;

    document.getElementById('modal-nav-link').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.googleQuery || item.name)}`;
    document.getElementById('modal-copy-mapcode-btn').onclick = () => {
      const cleanCode = item.mapCode.replace('*', '').trim();
      copyTextToClipboard(cleanCode, `📋 已複製 MapCode：${cleanCode}`);
    };

    modalOverlay.classList.add('open');
  };

  function initModal() {
    const modalOverlay = document.getElementById('spot-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (!modalCloseBtn || !modalOverlay) return;

    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        modalOverlay.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     Travel Toolkit Tabs
     ========================================================================== */
  function initToolkitTabs() {
    const tabBtns = document.querySelectorAll('.toolkit-tab-btn');
    const panels = document.querySelectorAll('.toolkit-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.dataset.target;
        const panel = document.getElementById(targetId);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ==========================================================================
     Packing Checklist Logic (XSS Safe)
     ========================================================================== */
  function initChecklist() {
    renderChecklist();

    const resetBtn = document.getElementById('checklist-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('確定要重設行李清單嗎？所有勾選將被清除。')) {
          if (typeof PACKING_CHECKLIST_DATA !== 'undefined') {
            state.checklist = PACKING_CHECKLIST_DATA.map(item => ({ ...item, checked: false }));
            saveChecklist();
            renderChecklist();
            showToast('已重設行李清單');
          }
        }
      });
    }

    const addBtn = document.getElementById('checklist-add-btn');
    const input = document.getElementById('checklist-add-input');
    if (addBtn && input) {
      addBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        state.checklist.push({
          id: 'custom-' + Date.now(),
          category: 'convenience',
          categoryName: '自訂項目',
          text: text,
          essential: false,
          checked: false
        });
        input.value = '';
        saveChecklist();
        renderChecklist();
        showToast('已新增自訂項目');
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addBtn.click();
        }
      });
    }
  }

  function saveChecklist() {
    safeStorageSet('okinawa_checklist', JSON.stringify(state.checklist));
  }

  function renderChecklist() {
    const container = document.getElementById('checklist-items-container');
    const progressFill = document.getElementById('checklist-progress-fill');
    const progressText = document.getElementById('checklist-progress-text');
    if (!container) return;

    const total = state.checklist.length;
    const checkedCount = state.checklist.filter(i => i.checked).length;
    const pct = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = `已準備 ${checkedCount} / ${total} 項 (${pct}%)`;

    container.innerHTML = state.checklist.map(item => `
      <label class="checklist-item ${item.checked ? 'checked' : ''}" data-id="${escapeHtml(item.id)}">
        <input type="checkbox" class="checklist-checkbox" ${item.checked ? 'checked' : ''} data-id="${escapeHtml(item.id)}">
        <span style="flex: 1; font-size: 0.925rem;">
          ${escapeHtml(item.text)}
          ${item.essential ? '<span style="color:#ef4444;font-size:0.75rem;font-weight:700;margin-left:0.35rem;">[必備]</span>' : ''}
        </span>
        <span style="font-size: 0.75rem; color: var(--text-subtle);">${escapeHtml(item.categoryName || '')}</span>
      </label>
    `).join('');

    container.querySelectorAll('.checklist-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.dataset.id;
        const target = state.checklist.find(i => i.id === id);
        if (target) {
          target.checked = cb.checked;
          saveChecklist();
          renderChecklist();
        }
      });
    });
  }

  /* ==========================================================================
     Budget Tracker & Currency Calculator (XSS Safe & Responsive)
     ========================================================================== */
  function initBudgetTracker() {
    const rateInput = document.getElementById('currency-rate-input');
    const jpyInput = document.getElementById('calc-jpy-input');
    const twdOutput = document.getElementById('calc-twd-output');

    if (rateInput) {
      rateInput.value = state.exchangeRate;
      rateInput.addEventListener('input', (e) => {
        state.exchangeRate = parseFloat(e.target.value) || 0.215;
        safeStorageSet('okinawa_rate', String(state.exchangeRate));
        updateCalculator();
        renderExpenses();
      });
    }

    if (jpyInput && twdOutput) {
      jpyInput.addEventListener('input', updateCalculator);
    }

    function updateCalculator() {
      const jpy = parseFloat(jpyInput.value) || 0;
      const twd = Math.round(jpy * state.exchangeRate);
      twdOutput.textContent = `約 NT$ ${twd.toLocaleString()}`;
    }

    // Add Expense Entry Form
    const form = document.getElementById('add-expense-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('expense-name-input');
        const catSelect = document.getElementById('expense-cat-select');
        const jpyInputBox = document.getElementById('expense-jpy-input');

        const name = nameInput ? nameInput.value.trim() : '';
        const category = catSelect ? catSelect.value : '其他雜支';
        const jpy = jpyInputBox ? (parseFloat(jpyInputBox.value) || 0) : 0;

        if (!name || jpy <= 0) return;

        state.expenses.unshift({
          id: 'exp-' + Date.now(),
          name,
          category,
          jpy,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        });

        safeStorageSet('okinawa_expenses', JSON.stringify(state.expenses));
        form.reset();
        renderExpenses();
        showToast('💰 已新增記帳記錄！');
      });
    }

    renderExpenses();
  }

  function renderExpenses() {
    const list = document.getElementById('expenses-history-list');
    const totalJpyEl = document.getElementById('expenses-total-jpy');
    const totalTwdEl = document.getElementById('expenses-total-twd');
    if (!list) return;

    let sumJpy = 0;
    state.expenses.forEach(e => sumJpy += e.jpy);
    const sumTwd = Math.round(sumJpy * state.exchangeRate);

    if (totalJpyEl) totalJpyEl.textContent = `¥ ${sumJpy.toLocaleString()}`;
    if (totalTwdEl) totalTwdEl.textContent = `NT$ ${sumTwd.toLocaleString()}`;

    if (state.expenses.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:2rem 0;color:var(--text-muted);font-size:0.875rem;">尚無記帳記錄，可透過上方表單新增</div>';
      return;
    }

    list.innerHTML = state.expenses.map(e => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0; border-bottom: 1px solid var(--border);">
        <div>
          <div style="font-weight: 600; font-size: 0.9rem;">${escapeHtml(e.name)} <span style="font-size:0.75rem;color:var(--text-muted);">(${escapeHtml(e.category)})</span></div>
          <div style="font-size: 0.75rem; color: var(--text-subtle);">${escapeHtml(e.timestamp)}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="text-align: right;">
            <div style="font-weight: 700; color: var(--primary);">¥ ${e.jpy.toLocaleString()}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">NT$ ${Math.round(e.jpy * state.exchangeRate).toLocaleString()}</div>
          </div>
          <button class="btn-delete-expense" data-id="${escapeHtml(e.id)}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:0.25rem;" title="刪除">✕</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.btn-delete-expense').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        state.expenses = state.expenses.filter(e => e.id !== id);
        safeStorageSet('okinawa_expenses', JSON.stringify(state.expenses));
        renderExpenses();
        showToast('已刪除該筆支出');
      });
    });
  }

  /* ==========================================================================
     ChicTrip Official Integration & Share Copy
     ========================================================================== */
  function initChicTripSharing() {
    const copyBtns = document.querySelectorAll('.btn-copy-chictrip');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        copyTextToClipboard(TRIP_METADATA.chictripUrl, '🔗 已複製去趣行程專屬分享連結！');
      });
    });

    const printBtns = document.querySelectorAll('.btn-print-itinerary');
    printBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.print();
      });
    });
  }

  /* ==========================================================================
     Scrollspy & Back to Top Controller
     ========================================================================== */
  function initScrollspyAndBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const sections = [
      document.getElementById('schedule-section'),
      document.getElementById('map-section'),
      document.getElementById('toolkit-section'),
      document.getElementById('chictrip-section')
    ].filter(Boolean);

    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn:not(.chictrip-btn)');

    function setActiveNav(targetId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === '#' + targetId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileNavBtns.forEach(btn => {
        if (btn.dataset.target === targetId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      }, { threshold: 0.25 });

      sections.forEach(s => observer.observe(s));
    }
  }

  /* ==========================================================================
     Toast Notification Helper
     ========================================================================== */
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
});
