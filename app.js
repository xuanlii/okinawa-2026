/**
 * 2026/12 沖繩 5天4夜自駕行程 - 主應用邏輯
 * 具備自由客製組合行程、車程時間自動計算、雙世代需求（40~60歲熟齡 vs 25~35歲年輕）深度適配
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
     Accurate Geodesic Haversine Distance & Transit Engine for Okinawa
     ========================================================================== */
  function calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculates realistic Okinawa transit distance and driving duration
   * Accounts for island winding coastal roads (1.28x factor), downtown Naha vs outer island speeds,
   * walking mode for short distances (<0.8km), and terminal parking buffer.
   */
  function calculateTransit(fromItem, toItem) {
    if (!fromItem || !toItem || typeof fromItem.lat !== 'number' || typeof toItem.lat !== 'number') {
      return { distanceKm: 0, durationMins: 0, isWalk: false, text: '無交通數據' };
    }

    const straightDist = calcDistanceKm(fromItem.lat, fromItem.lng, toItem.lat, toItem.lng);

    // Identical location or same venue within 80m
    if (straightDist < 0.08 || (fromItem.nameZh && fromItem.nameZh === toItem.nameZh) || (fromItem.id && fromItem.id === toItem.id)) {
      return {
        distanceKm: 0,
        durationMins: 0,
        isWalk: true,
        text: '🚶 同地點 / 步行即達 (約 0~2 分鐘)'
      };
    }

    // Island terrain winding factor (coastal highways & city grids): 1.28x
    const roadDist = straightDist * 1.28;

    // Short distance (< 800m) is walking
    if (roadDist < 0.8) {
      const meters = Math.max(50, Math.round(roadDist * 1000));
      const mins = Math.max(1, Math.round(meters / 75)); // 4.5 km/h = 75 m/min
      return {
        distanceKm: Number(roadDist.toFixed(2)),
        durationMins: mins,
        isWalk: true,
        text: `🚶 步行約 ${meters} 公尺 (約 ${mins} 分鐘)`
      };
    }

    // Driving speed profile:
    // Downtown Naha (26.18~26.25 Lat, 127.65~127.72 Lng) has heavy traffic: ~26 km/h
    // Central/Northern coastal highways: ~38 km/h
    const inNaha = (fromItem.lat >= 26.18 && fromItem.lat <= 26.25 && fromItem.lng >= 127.65 && fromItem.lng <= 127.72) ||
                   (toItem.lat >= 26.18 && toItem.lat <= 26.25 && toItem.lng >= 127.65 && toItem.lng <= 127.72);
    const avgSpeed = inNaha ? 26 : 38;
    // 3 minutes parking/intersection buffer
    const estMins = Math.max(4, Math.round(3 + (roadDist / avgSpeed) * 60));

    return {
      distanceKm: Number(roadDist.toFixed(1)),
      durationMins: estMins,
      isWalk: false,
      text: `🚗 車程約 ${roadDist.toFixed(1)} 公里 (預估 ${estMins} 分鐘)`
    };
  }

  function formatTransitInfo(fromItem, toItem) {
    return calculateTransit(fromItem, toItem).text;
  }

  function formatMinutesToTime(totalMins) {
    let daysOffset = Math.floor(totalMins / (24 * 60));
    let mins = totalMins % (24 * 60);
    if (mins < 0) {
      mins += 24 * 60;
      daysOffset -= 1;
    }
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return daysOffset > 0 ? `${timeStr} (+${daysOffset}天)` : timeStr;
  }

  /**
   * Chains and ripples the full day schedule from start time
   * Stop 1: arrival = startTime, departure = arrival + duration
   * Transit to Stop 2: driveMins
   * Stop 2: arrival = departure1 + driveMins, departure = arrival + duration
   * ...
   */
  function calculateDayTimeline(dayObj) {
    if (!dayObj) dayObj = {};
    const startTimeStr = dayObj.startTime || '09:00';
    const parts = startTimeStr.split(':').map(Number);
    const startH = isNaN(parts[0]) ? 9 : parts[0];
    const startM = isNaN(parts[1]) ? 0 : parts[1];
    let currentMins = startH * 60 + startM;

    const rawStops = Array.isArray(dayObj.stops) ? dayObj.stops : [];
    let totalDriveMins = 0;
    let totalDriveKm = 0;
    let totalActivityMins = 0;

    const computedStops = [];
    let prevValidStop = null;

    for (let i = 0; i < rawStops.length; i++) {
      let stop = rawStops[i];
      if (!stop) continue;
      if (typeof stop === 'string') {
        stop = createPlannerStop(stop);
      }
      const duration = Math.max(5, Number(stop.durationMinutes || stop.defaultDurationMinutes) || 60);
      totalActivityMins += duration;

      let transitFromPrev = null;
      if (prevValidStop) {
        transitFromPrev = calculateTransit(prevValidStop, stop);
        totalDriveMins += transitFromPrev.durationMins;
        totalDriveKm += transitFromPrev.distanceKm;
        currentMins += transitFromPrev.durationMins;
      }

      const arrivalMins = currentMins;
      const departureMins = arrivalMins + duration;
      currentMins = departureMins;

      computedStops.push({
        ...stop,
        durationMinutes: duration,
        arrivalMins,
        departureMins,
        arrivalTime: formatMinutesToTime(arrivalMins),
        departureTime: formatMinutesToTime(departureMins),
        transitFromPrev
      });

      prevValidStop = stop;
    }

    // Calculate Dual-Generation Metrics
    let seniorLoadScore = 0;
    let youngPhotoCount = 0;
    let harmonySum = 0;

    for (const stop of computedStops) {
      const gen = stop.generation || {};
      const senior = gen.senior || {};
      const young = gen.young || {};
      const hScore = (gen.harmony && typeof gen.harmony.score === 'number') 
        ? gen.harmony.score 
        : (typeof gen.harmonyScore === 'number' ? gen.harmonyScore : 9.5);
      harmonySum += hScore;

      if (senior.walkingScore === 'red') seniorLoadScore += 3;
      else if (senior.walkingScore === 'amber') seniorLoadScore += 2;
      else seniorLoadScore += 1;

      if (young.photoSpot || young.trendyFood) youngPhotoCount += 1;
    }

    const avgHarmonyScore = computedStops.length > 0 ? Number((harmonySum / computedStops.length).toFixed(1)) : 9.5;
    let seniorLoadLabel = '🟢 平緩舒活';
    if (seniorLoadScore >= 12 || computedStops.length >= 7) {
      seniorLoadLabel = '🔴 步數偏多 (多歇息)';
    } else if (seniorLoadScore >= 8 || computedStops.length >= 5) {
      seniorLoadLabel = '🟡 步調適中';
    }

    return {
      computedStops,
      totalDriveMins,
      totalDriveKm: Number(totalDriveKm.toFixed(1)),
      totalActivityMins,
      finishTime: rawStops.length > 0 ? formatMinutesToTime(currentMins) : '--:--',
      stopsCount: rawStops.length,
      seniorLoadLabel,
      youngPhotoCount,
      avgHarmonyScore
    };
  }

  /* ==========================================================================
     Stop Factory & Catalog Lookups
     ========================================================================== */
  function findCatalogSpot(id) {
    if (!id) return null;

    if (typeof SPOTS_CATALOG !== 'undefined') {
      const found = SPOTS_CATALOG.find(s => s.id === id);
      if (found) return found;
    }

    if (typeof SCHEDULE_ITEMS !== 'undefined') {
      const foundItem = SCHEDULE_ITEMS.find(s => s.id === id);
      if (foundItem) {
        return {
          id: foundItem.id,
          name: foundItem.name,
          nameZh: foundItem.nameZh,
          nameJa: foundItem.nameJa,
          category: foundItem.category,
          categoryLabel: foundItem.categoryLabel,
          icon: foundItem.icon,
          lat: foundItem.lat,
          lng: foundItem.lng,
          address: foundItem.address,
          mapCode: foundItem.mapCode,
          defaultDurationMinutes: foundItem.durationMinutes || 60,
          tags: foundItem.tags || [],
          desc: foundItem.desc || '',
          tips: foundItem.tips || '',
          generation: foundItem.generation || {}
        };
      }
    }

    // Also search active planner custom stops
    if (typeof state !== 'undefined' && state.plannerData && Array.isArray(state.plannerData.days)) {
      for (const d of state.plannerData.days) {
        if (Array.isArray(d.stops)) {
          const foundInPlanner = d.stops.find(s => s.id === id || s.instanceId === id);
          if (foundInPlanner) return foundInPlanner;
        }
      }
    }

    return null;
  }

  function createPlannerStop(spotIdOrObj) {
    let base = null;
    if (typeof spotIdOrObj === 'string') {
      base = findCatalogSpot(spotIdOrObj);
    } else if (typeof spotIdOrObj === 'object' && spotIdOrObj !== null) {
      base = spotIdOrObj;
    }

    const instanceId = 'stop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    if (base) {
      return {
        instanceId,
        id: base.id || instanceId,
        name: base.name || '自訂停靠點',
        nameZh: base.nameZh || base.name || '自訂停靠點',
        nameJa: base.nameJa || '',
        category: base.category || 'attraction',
        categoryLabel: base.categoryLabel || '景點文化',
        icon: base.icon || '📍',
        lat: typeof base.lat === 'number' ? base.lat : 26.2124,
        lng: typeof base.lng === 'number' ? base.lng : 127.6809,
        address: base.address || '沖繩縣',
        mapCode: base.mapCode || '無',
        durationMinutes: base.durationMinutes || base.defaultDurationMinutes || 60,
        tags: Array.isArray(base.tags) ? [...base.tags] : ['自由行程'],
        desc: base.desc || '',
        tips: base.tips || '',
        generation: base.generation ? JSON.parse(JSON.stringify(base.generation)) : {
          senior: { walkingLoad: '平緩輕鬆', walkingScore: 'green', seatingRest: '備有座位可休憩', keyTip: '留意步調與洗手間位置' },
          young: { photoSpot: '特色地標拍照打卡', trendyFood: '周邊特色店家', keyTip: '注意營業時間' },
          harmony: { score: 9.5, advice: '互相協調停留時間，長輩休息與年輕人探索兼顧。' }
        }
      };
    }

    return {
      instanceId,
      id: instanceId,
      name: '自訂私房節點',
      nameZh: '自訂私房節點',
      nameJa: '',
      category: 'attraction',
      categoryLabel: '景點文化',
      icon: '📍',
      lat: 26.2124,
      lng: 127.6809,
      address: '沖繩縣',
      mapCode: '自訂',
      durationMinutes: 60,
      tags: ['自訂'],
      desc: '',
      tips: '',
      generation: {
        senior: { walkingLoad: '平緩舒適', walkingScore: 'green', seatingRest: '請先確認現場座椅', keyTip: '下車先找洗手間' },
        young: { photoSpot: '自訂拍攝視角', trendyFood: '私房美食探索', keyTip: '彈性探索' },
        harmony: { score: 9.2, advice: '自由規劃，隨時依體力調整。' }
      }
    };
  }

  function getInitialPlannerData() {
    const saved = safeStorageGet('okinawa_custom_planner_data', null);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length >= 5) {
          return parsed;
        }
      } catch (e) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('Failed to parse saved planner data, loading default', e);
        }
      }
    }

    // Default initialization from PRESET_ITINERARIES.official_5d
    if (typeof PRESET_ITINERARIES !== 'undefined' && PRESET_ITINERARIES.official_5d) {
      const preset = PRESET_ITINERARIES.official_5d;
      return {
        activeDayIndex: 0,
        days: preset.days.map((d, idx) => ({
          day: idx + 1,
          title: d.title || `第 ${idx + 1} 天行程`,
          startTime: d.startTime || '09:00',
          stops: d.spotIds.map(id => createPlannerStop(id)).filter(Boolean)
        }))
      };
    }

    // Fallback if preset is missing
    return {
      activeDayIndex: 0,
      days: [
        { day: 1, title: '首日啟程・經典行程', startTime: '09:00', stops: [] }
      ]
    };
  }

  /* ==========================================================================
     Application State Management
     ========================================================================== */
  const state = {
    itineraryMode: 'official', // 'official' | 'planner'
    generationPerspective: 'both', // 'both' | 'senior' | 'young'
    activeDay: 0, // 0 = all days, 1..5 for official
    activeCategory: 'all',
    searchQuery: '',
    favorites: JSON.parse(safeStorageGet('okinawa_favorites', '[]')),
    checklist: JSON.parse(safeStorageGet('okinawa_checklist', 'null')),
    expenses: JSON.parse(safeStorageGet('okinawa_expenses', '[]')),
    exchangeRate: parseFloat(safeStorageGet('okinawa_rate', '0.215')),
    theme: safeStorageGet('okinawa_theme', (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')),
    mobileView: 'timeline', // 'timeline' | 'map'
    map: null,
    markers: [],
    markerMap: new Map(),
    polyline: null,
    plannerMarkers: [],
    plannerPolyline: null,
    plannerData: getInitialPlannerData(),
    selectedFlightId: safeStorageGet('okinawa_selected_flight', (typeof DEFAULT_OKINAWA_FLIGHT_ID !== 'undefined' ? DEFAULT_OKINAWA_FLIGHT_ID : 'ci-oka-morning-roundtrip')),
    customFlightData: JSON.parse(safeStorageGet('okinawa_custom_flight_data', 'null')),
    flightFilter: 'all'
  };

  function savePlannerData() {
    safeStorageSet('okinawa_custom_planner_data', JSON.stringify(state.plannerData));
  }

  // Initialize Theme
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
  updateThemeMeta();

  // Initialize Packing Checklist if not in storage
  if (!state.checklist && typeof PACKING_CHECKLIST_DATA !== 'undefined') {
    state.checklist = PACKING_CHECKLIST_DATA.map(item => ({
      ...item,
      checked: false
    }));
    saveChecklist();
  }

  // Initialize UI Components
  initThemeToggle();
  initCountdown();
  initModeSwitcher();
  initPerspectiveSwitcher();
  initDayTabs();
  initCategoryPills();
  initSearch();
  initMobileViewSwitcher();
  initMap();
  renderTimeline();
  initPlannerStudio();
  initSpotPickerModal();
  initToolkitTabs();
  initChecklist();
  initBudgetTracker();
  initChicTripSharing();
  initModal();
  initFlightSelector();
  syncFlightToItinerary(getSelectedFlight(), false);
  initScrollspyAndBackToTop();

  /* ==========================================================================
     Theme Switcher
     ========================================================================== */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      safeStorageSet('okinawa_theme', state.theme);
      updateThemeIcon();
      updateThemeMeta();
      showToast(state.theme === 'dark' ? '🌙 已切換為深色模式' : '☀️ 已切換為淺色模式');
    });
  }

  function updateThemeIcon() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function updateThemeMeta() {
    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', state.theme === 'dark' ? '#0f172a' : '#0284c7');
    }
  }

  /* ==========================================================================
     Countdown Timer
     ========================================================================== */
  function initCountdown() {
    const targetDate = new Date((typeof TRIP_METADATA !== 'undefined' && TRIP_METADATA.departureDate) || '2026-12-12T11:00:00+09:00').getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    const wrapEl = document.getElementById('countdown-wrap');
    if (!daysEl) return;

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (wrapEl) {
          wrapEl.innerHTML = '<div style="font-weight:700;font-size:1.1rem;color:var(--emerald);">🎉 沖繩自駕之旅熱烈出發中！享受冬日海風！</div>';
        }
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     Mode Switcher (Official 5-Day vs Custom Planner Studio)
     ========================================================================== */
  function initModeSwitcher() {
    const btnOfficial = document.getElementById('btn-mode-official');
    const btnPlanner = document.getElementById('btn-mode-planner');
    const navPlannerLink = document.getElementById('nav-planner-link');
    const heroBtnPlanner = document.getElementById('hero-btn-planner');
    const navScheduleLink = document.getElementById('nav-schedule-link');

    if (btnOfficial) {
      btnOfficial.addEventListener('click', () => switchItineraryMode('official'));
    }
    if (btnPlanner) {
      btnPlanner.addEventListener('click', () => switchItineraryMode('planner'));
    }
    if (navPlannerLink) {
      navPlannerLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchItineraryMode('planner');
        scrollToSchedule();
      });
    }
    if (heroBtnPlanner) {
      heroBtnPlanner.addEventListener('click', () => {
        switchItineraryMode('planner');
        scrollToSchedule();
      });
    }
    if (navScheduleLink) {
      navScheduleLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchItineraryMode('official');
        scrollToSchedule();
      });
    }
  }

  function scrollToSchedule() {
    const target = document.getElementById('schedule-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function switchItineraryMode(mode) {
    state.itineraryMode = mode;
    const btnOfficial = document.getElementById('btn-mode-official');
    const btnPlanner = document.getElementById('btn-mode-planner');
    const officialContainer = document.getElementById('official-schedule-container');
    const officialFilterControls = document.getElementById('official-filter-controls');
    const plannerContainer = document.getElementById('custom-planner-container');
    const scrollerWrap = document.getElementById('map-spots-scroller-wrap');

    if (mode === 'official') {
      if (btnOfficial) btnOfficial.classList.add('active');
      if (btnPlanner) btnPlanner.classList.remove('active');
      if (officialContainer) officialContainer.style.display = 'block';
      if (officialFilterControls) officialFilterControls.style.display = 'block';
      if (plannerContainer) plannerContainer.style.display = 'none';
      if (scrollerWrap) scrollerWrap.style.display = 'block';
      renderTimeline();
      updateMapMarkers();
      showToast('🗓️ 已切換為「官方推薦行程」模式');
    } else {
      if (btnOfficial) btnOfficial.classList.remove('active');
      if (btnPlanner) btnPlanner.classList.add('active');
      if (officialContainer) officialContainer.style.display = 'none';
      if (officialFilterControls) officialFilterControls.style.display = 'none';
      if (plannerContainer) plannerContainer.style.display = 'flex';
      if (scrollerWrap) scrollerWrap.style.display = 'none';
      renderPlannerStudio();
      showToast('🛠️ 已切換為「自由客製規劃」模式');
    }

    if (state.map) {
      setTimeout(() => {
        state.map.invalidateSize();
        fitMapToCurrentMarkers();
      }, 150);
    }
  }

  /* ==========================================================================
     Generation Perspective Switcher (Both / Senior 40~60 / Young 25~35)
     ========================================================================== */
  function initPerspectiveSwitcher() {
    const bar = document.getElementById('generation-perspective-bar');
    if (!bar) return;

    const btns = bar.querySelectorAll('.gen-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const gen = btn.dataset.gen;
        if (!gen) return;
        state.generationPerspective = gen;
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (state.itineraryMode === 'official') {
          renderTimeline();
        } else {
          renderPlannerStudio();
        }

        if (gen === 'both') {
          showToast('👥 雙世代全覽：長輩舒活 × 年輕探索雙軌並行');
        } else if (gen === 'senior') {
          showToast('🧓 熟齡舒活視角：聚焦低步數、無障礙動線、座椅空調與清淡海味');
        } else if (gen === 'young') {
          showToast('📸 年輕探索視角：聚焦IG美拍照、排隊話題美食、潮流服飾與夜生活');
        }
      });
    });
  }

  /* ==========================================================================
     Dual-Generation Card Markup Generator
     ========================================================================== */
  function renderGenerationCardHtml(genData) {
    if (!genData) return '';
    const senior = genData.senior || {};
    const young = genData.young || {};
    const harmonyScore = (genData.harmony && typeof genData.harmony.score === 'number') 
      ? genData.harmony.score 
      : (typeof genData.harmonyScore === 'number' ? genData.harmonyScore : 9.5);
    const harmonyAdvice = (genData.harmony && genData.harmony.advice) 
      ? genData.harmony.advice 
      : (genData.harmonyAdvice || '');

    const walkMeterColor = senior.walkingScore === 'green' ? '#10b981' : (senior.walkingScore === 'amber' ? '#f59e0b' : (senior.walkingScore === 'red' ? '#ef4444' : '#10b981'));

    if (state.generationPerspective === 'senior') {
      return `
        <div class="card-dual-gen-wrap">
          <div class="gen-pill-box senior" style="border-left-width: 5px;">
            <div style="width: 100%;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                <span class="gen-pill-label senior-text" style="font-size: 0.9rem;">🧓 40~60歲 熟齡舒活指南</span>
                <span class="walking-meter-pill" style="border: 1px solid ${walkMeterColor}; color: ${walkMeterColor}; font-size: 0.775rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">
                  🚶 步數強度：${escapeHtml(senior.walkingLoad || '平緩舒適')}
                </span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.3rem;">
                <strong>🪑 休憩環境：</strong>${escapeHtml(senior.seatingRest || '備有座椅空調可供休息')}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.3rem;">
                <strong>🍵 食事養生：</strong>${escapeHtml(senior.foodHighlights || '提供清雅在地風味或熱飲')}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.3rem;">
                <strong>⛩️ 文化伴手：</strong>${escapeHtml(senior.cultureShopping || '在地精緻特產與身心祈福')}
              </div>
              <div style="background: rgba(16,185,129,0.12); padding: 0.45rem 0.65rem; border-radius: var(--radius-sm); font-size: 0.825rem; font-weight: 600; color: #065f46;">
                💡 舒活叮嚀：${escapeHtml(senior.keyTip || '出入口多設有平緩坡道與無障礙洗手間，可放慢腳步。')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.generationPerspective === 'young') {
      return `
        <div class="card-dual-gen-wrap">
          <div class="gen-pill-box young" style="border-left-width: 5px;">
            <div style="width: 100%;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                <span class="gen-pill-label young-text" style="font-size: 0.9rem;">📸 25~35歲 年輕探索指南</span>
                <span class="tag-badge" style="background: rgba(245,158,11,0.15); color: #b45309; font-size: 0.775rem;">✨ 潮流打卡必拍</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.3rem;">
                <strong>📷 IG絕景機位：</strong>${escapeHtml(young.photoSpot || '必拍出片取景角度')}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.3rem;">
                <strong>🍜 話題美食：</strong>${escapeHtml(young.trendyFood || '網路爆紅排隊必吃')}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.3rem;">
                <strong>🛍️ 潮流亮點：</strong>${escapeHtml(young.shoppingNightlife || '特色潮流、露營選品或微醺夜生活')}
              </div>
              <div style="background: rgba(245,158,11,0.12); padding: 0.45rem 0.65rem; border-radius: var(--radius-sm); font-size: 0.825rem; font-weight: 600; color: #92400e;">
                ⚡ 探索攻略：${escapeHtml(young.keyTip || '建議提早拍照排隊，兼顧同伴作息。')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Default: 'both'
    return `
      <div class="card-dual-gen-wrap">
        <div class="gen-pill-box senior">
          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
              <span class="gen-pill-label senior-text">🧓 熟齡舒活</span>
              <span style="font-size:0.75rem; color: ${walkMeterColor}; font-weight:700;">${escapeHtml(senior.walkingLoad || '輕鬆')}</span>
            </div>
            <div style="font-size: 0.825rem; color: var(--text-muted); line-height: 1.45;">
              ${escapeHtml(senior.keyTip || senior.seatingRest || '低負擔平坦動線')}
            </div>
          </div>
        </div>

        <div class="gen-pill-box young">
          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
              <span class="gen-pill-label young-text">📸 年輕探索</span>
              <span style="font-size:0.75rem; color: #d97706; font-weight:700;">#打卡話題</span>
            </div>
            <div style="font-size: 0.825rem; color: var(--text-muted); line-height: 1.45;">
              ${escapeHtml(young.photoSpot || young.trendyFood || '必訪特色亮點')}
            </div>
          </div>
        </div>

        <div class="gen-pill-box harmony">
          <div>
            <span class="gen-pill-label harmony-text">🤝 契合度 ${harmonyScore}/10</span>
            <div style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.2rem; line-height: 1.45;">
              ${escapeHtml(harmonyAdvice || '兼顧不同步調，各取所需全家開心。')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     Official Schedule Day Tabs
     ========================================================================== */
  function initDayTabs() {
    const container = document.getElementById('day-tabs-container');
    if (!container || typeof DAY_SUMMARIES === 'undefined') return;

    let html = `
      <button class="day-tab-btn ${state.activeDay === 0 ? 'active' : ''}" data-day="0">
        🌟 完整 5 天全覽
      </button>
    `;

    DAY_SUMMARIES.forEach(d => {
      const activeClass = state.activeDay === d.day ? 'active' : '';
      html += `
        <button class="day-tab-btn ${activeClass}" data-day="${d.day}">
          Day ${d.day} · ${escapeHtml(d.date.split('/')[1])}/${escapeHtml(d.date.split('/')[2])} (${d.dayOfWeek})
        </button>
      `;
    });

    container.innerHTML = html;

    const activeTab = container.querySelector('.day-tab-btn.active');
    if (activeTab) {
      setTimeout(() => {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 50);
    }

    container.querySelectorAll('.day-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        state.activeDay = parseInt(btn.dataset.day, 10);
        renderTimeline();
        updateMapMarkers();
        updateCategoryPillCounts();
      });
    });
  }

  /* ==========================================================================
     Official Schedule Category & Generation Filter Pills
     ========================================================================== */
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
    if (typeof SCHEDULE_ITEMS === 'undefined') return;

    const dayFiltered = state.activeDay === 0 
      ? SCHEDULE_ITEMS 
      : SCHEDULE_ITEMS.filter(i => i.day === state.activeDay);

    const counts = {
      all: dayFiltered.length,
      food: dayFiltered.filter(i => i.category === 'food').length,
      shopping: dayFiltered.filter(i => i.category === 'shopping').length,
      attraction: dayFiltered.filter(i => i.category === 'attraction').length,
      'transport-hotel': dayFiltered.filter(i => i.category === 'transport' || i.category === 'hotel').length,
      senior: dayFiltered.filter(i => i.generation && i.generation.senior && i.generation.senior.walkingScore !== 'red').length,
      young: dayFiltered.filter(i => i.generation && i.generation.young && (i.generation.young.photoSpot || i.generation.young.trendyFood)).length,
      harmony: dayFiltered.filter(i => ((i.generation && i.generation.harmony && i.generation.harmony.score) || (i.generation && i.generation.harmonyScore) || 0) >= 9.0).length,
      favorites: dayFiltered.filter(i => state.favorites.includes(i.id)).length
    };

    const pillLabels = {
      all: '✨ 全部節點',
      food: '🍣 老饕美食',
      shopping: '🛍️ 購物商場',
      attraction: '⛩️ 景點文化',
      'transport-hotel': '🚗 交通/住宿',
      senior: '🧓 40-60長輩首選',
      young: '📸 25-35年輕熱門',
      harmony: '🤝 跨世代全家共融',
      favorites: '⭐ 我的收藏'
    };

    document.querySelectorAll('.cat-pill').forEach(pill => {
      const cat = pill.dataset.category;
      if (pillLabels[cat] !== undefined) {
        pill.innerHTML = `${pillLabels[cat]} <span class="badge-count" style="margin-left:0.35rem;font-size:0.75rem;opacity:0.85;">${counts[cat] !== undefined ? counts[cat] : 0}</span>`;
      }
    });
  }

  /* ==========================================================================
     Search Box Logic
     ========================================================================== */
  function initSearch() {
    const input = document.getElementById('schedule-search-input');
    const clearBtn = document.getElementById('schedule-search-clear');
    if (!input || !clearBtn) return;

    input.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      clearBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderTimeline();
      updateMapMarkers();
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      state.searchQuery = '';
      clearBtn.style.display = 'none';
      renderTimeline();
      updateMapMarkers();
      input.focus();
    });
  }

  /* ==========================================================================
     Mobile View Switcher (Timeline vs Map)
     ========================================================================== */
  function initMobileViewSwitcher() {
    const btnTimeline = document.getElementById('btn-view-timeline');
    const btnMap = document.getElementById('btn-view-map');
    if (!btnTimeline || !btnMap) return;

    btnTimeline.addEventListener('click', () => switchMobileView('timeline'));
    btnMap.addEventListener('click', () => switchMobileView('map'));
  }

  function switchMobileView(mode) {
    state.mobileView = mode;
    const btnTimeline = document.getElementById('btn-view-timeline');
    const btnMap = document.getElementById('btn-view-map');
    const layoutGrid = document.getElementById('main-layout-grid');
    if (!btnTimeline || !btnMap || !layoutGrid) return;

    if (mode === 'timeline') {
      btnTimeline.classList.add('active');
      btnMap.classList.remove('active');
      layoutGrid.classList.remove('view-mode-map');
      layoutGrid.classList.add('view-mode-timeline');
      document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        if (btn.dataset.target) {
          btn.classList.toggle('active', btn.dataset.target === 'schedule-section');
        }
      });
    } else {
      btnMap.classList.add('active');
      btnTimeline.classList.remove('active');
      layoutGrid.classList.remove('view-mode-timeline');
      layoutGrid.classList.add('view-mode-map');
      document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        if (btn.dataset.target) {
          btn.classList.toggle('active', btn.dataset.target === 'map-section');
        }
      });

      // Refresh Leaflet map tile layout when switching views
      setTimeout(() => {
        if (state.map) {
          state.map.invalidateSize();
          fitMapToCurrentMarkers();
          syncMapGestureState();
        }
      }, 200);
    }
  }

  function fitMapToCurrentMarkers() {
    if (!state.map) return;
    if (state.itineraryMode === 'planner') {
      if (state.plannerPolyline) {
        state.map.fitBounds(state.plannerPolyline.getBounds().pad(0.12));
      } else if (state.plannerMarkers.length > 0) {
        state.map.setView(state.plannerMarkers[0].getLatLng(), 14);
      }
      return;
    }

    if (state.markers.length > 0 && typeof L !== 'undefined') {
      const group = (typeof L.featureGroup === 'function') ? L.featureGroup(state.markers) : (L.FeatureGroup ? new L.FeatureGroup(state.markers) : null);
      if (group && typeof group.getBounds === 'function') {
        const bounds = group.getBounds();
        if (bounds && typeof bounds.pad === 'function') {
          state.map.fitBounds(bounds.pad(0.1));
        } else {
          state.map.fitBounds(bounds);
        }
      }
    }
  }

  function syncScrollerActiveChip(itemId) {
    const scroller = document.getElementById('map-spots-scroller');
    if (!scroller) return;
    scroller.querySelectorAll('.map-spot-chip').forEach(chip => {
      if (chip.dataset.id === itemId) {
        chip.classList.add('active');
        chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function renderMapSpotsScroller() {
    const scroller = document.getElementById('map-spots-scroller');
    if (!scroller) return;

    const filtered = getFilteredItems();
    if (filtered.length === 0) {
      scroller.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted);padding:0.25rem 0.5rem;">無符合條件景點</span>';
      return;
    }

    scroller.innerHTML = filtered.map(item => `
      <button class="map-spot-chip" data-id="${escapeHtml(item.id)}" title="${escapeHtml(item.nameZh)}">
        <span>${item.icon}</span>
        <span>${escapeHtml(item.nameZh)}</span>
        <span class="chip-time">${item.time}</span>
      </button>
    `).join('');

    scroller.querySelectorAll('.map-spot-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.id;
        syncScrollerActiveChip(id);
        const item = SCHEDULE_ITEMS.find(s => s.id === id);
        if (item && state.map) {
          const marker = state.markerMap.get(id);
          state.map.setView([item.lat, item.lng], Math.max(state.map.getZoom(), 14), { animate: true });
          if (marker) marker.openPopup();
        }
      });
    });
  }

  /* ==========================================================================
     Official Schedule Filtering
     ========================================================================== */
  function matchSearchQuery(item, q) {
    if (!q) return true;
    if (item.name && item.name.toLowerCase().includes(q)) return true;
    if (item.nameZh && item.nameZh.toLowerCase().includes(q)) return true;
    if (item.nameJa && item.nameJa.toLowerCase().includes(q)) return true;
    if (item.address && item.address.toLowerCase().includes(q)) return true;
    if (item.mapCode && item.mapCode.toLowerCase().includes(q)) return true;
    if (item.desc && item.desc.toLowerCase().includes(q)) return true;
    if (item.tips && item.tips.toLowerCase().includes(q)) return true;
    if (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) return true;
    if (item.generation) {
      if (item.generation.senior && JSON.stringify(item.generation.senior).toLowerCase().includes(q)) return true;
      if (item.generation.young && JSON.stringify(item.generation.young).toLowerCase().includes(q)) return true;
    }
    return false;
  }

  function getFilteredItems() {
    if (typeof SCHEDULE_ITEMS === 'undefined') return [];

    return SCHEDULE_ITEMS.filter(item => {
      // Day Filter
      if (state.activeDay !== 0 && item.day !== state.activeDay) {
        return false;
      }

      // Category Filter
      if (state.activeCategory === 'favorites') {
        if (!state.favorites.includes(item.id)) return false;
      } else if (state.activeCategory === 'transport-hotel') {
        if (item.category !== 'transport' && item.category !== 'hotel') return false;
      } else if (state.activeCategory === 'senior') {
        if (!item.generation || !item.generation.senior || item.generation.senior.walkingScore === 'red') return false;
      } else if (state.activeCategory === 'young') {
        if (!item.generation || !item.generation.young || (!item.generation.young.photoSpot && !item.generation.young.trendyFood)) return false;
      } else if (state.activeCategory === 'harmony') {
        const score = (item.generation && item.generation.harmony && item.generation.harmony.score) || (item.generation && item.generation.harmonyScore) || 0;
        if (score < 9.0) return false;
      } else if (state.activeCategory !== 'all') {
        if (item.category !== state.activeCategory) return false;
      }

      // Search Query
      if (state.searchQuery && !matchSearchQuery(item, state.searchQuery)) {
        return false;
      }

      return true;
    });
  }

  /* ==========================================================================
     Official Schedule Timeline Rendering
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
        const transitInfo = calculateTransit(item, nextItem);
        transitHtml = `
          <div class="transit-connector">
            <span>${transitInfo.isWalk ? '🚶' : '🚗'}</span>
            <span>前往下一站：<strong>${escapeHtml(nextItem.nameZh)}</strong> (${transitInfo.text})</span>
          </div>
        `;
      }

      // Generation Perspective UI
      const genCardsHtml = renderGenerationCardHtml(item.generation);

      html += `
        <div class="timeline-item" id="item-${escapeHtml(item.id)}">
          <div class="timeline-node">${item.icon}</div>
          <div class="timeline-card">
            <div class="card-top">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="card-time-badge">⏰ ${item.time}</span>
                <span class="card-duration-badge">⏱️ ${item.duration}</span>
                <span class="tag-badge" style="background: var(--primary-light); color: var(--primary);">${escapeHtml(item.categoryLabel)}</span>
                <button type="button" class="btn-copy-mc-badge" data-mapcode="${escapeHtml(item.mapCode)}" title="點擊直接複製日本車機 MapCode">📋 MC: ${escapeHtml(item.mapCode)}</button>
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

            ${genCardsHtml}

            <div class="card-tags" style="margin-top:0.75rem;">
              ${item.tags.map(tag => `<span class="tag-badge">#${escapeHtml(tag)}</span>`).join('')}
            </div>

            <div class="card-footer">
              <div class="card-address">
                <span>📍 ${escapeHtml(item.address)}</span>
              </div>
              <div class="card-footer-buttons">
                <button class="btn-card-action primary" data-action="modal" data-id="${escapeHtml(item.id)}" title="查看景點攻略與雙世代指南">
                  <span>🔍 查看攻略</span>
                </button>
                <button class="btn-card-action" data-action="copy-mc" data-mapcode="${escapeHtml(item.mapCode)}" title="複製日本車機 MapCode">
                  <span>📋 複製MC</span>
                </button>
                <button class="btn-card-action locate" data-action="locate" data-id="${escapeHtml(item.id)}" title="在地圖標記定位">
                  <span>📍 地圖定位</span>
                </button>
                <button class="btn-card-action" data-action="add-to-custom" data-id="${escapeHtml(item.id)}" title="將此景點加入自訂行程">
                  <span>➕ 加自訂</span>
                </button>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.googleQuery || item.name)}" target="_blank" rel="noopener" class="btn-card-action" title="啟動 Google Maps 即時導航">
                  <span>🗺️ 導航</span>
                </a>
              </div>
            </div>
          </div>
          ${transitHtml}
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Attach Event Listeners
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

    listContainer.querySelectorAll('[data-action="add-to-custom"]').forEach(btn => {
      btn.addEventListener('click', () => {
        addSpotToCurrentPlannerDay(btn.dataset.id);
      });
    });

    listContainer.querySelectorAll('[data-action="copy-mc"], .btn-copy-mc-badge').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mc = btn.dataset.mapcode;
        if (mc) {
          const cleanCode = mc.trim();
          copyTextToClipboard(cleanCode, `📋 已複製 MapCode：${cleanCode}`);
          const origHtml = btn.innerHTML;
          btn.innerHTML = btn.classList.contains('btn-copy-mc-badge') ? `✓ 已複製 ${escapeHtml(cleanCode)}` : `<span>✓ 已複製</span>`;
          btn.style.borderColor = 'var(--emerald)';
          btn.style.color = 'var(--emerald)';
          setTimeout(() => {
            btn.innerHTML = origHtml;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 1600);
        }
      });
    });
  }

  function toggleFavorite(id) {
    if (state.favorites.includes(id)) {
      state.favorites = state.favorites.filter(favId => favId !== id);
      showToast('已從最愛移除');
    } else {
      state.favorites.push(id);
      showToast('⭐ 已加入最愛！');
    }
    safeStorageSet('okinawa_favorites', JSON.stringify(state.favorites));
    renderTimeline();
    updateCategoryPillCounts();
  }

  /* ==========================================================================
     Leaflet Map System
     ========================================================================== */
  let mapGestureLocked = (typeof window !== 'undefined' && window.innerWidth <= 768);

  function syncMapGestureState() {
    const btn = document.getElementById('btn-map-gesture-toggle');
    if (!state.map) return;

    if (window.innerWidth > 768) {
      state.map.dragging.enable();
      if (state.map.touchZoom) state.map.touchZoom.enable();
      if (btn) btn.style.display = 'none';
      return;
    }

    if (btn) btn.style.display = 'flex';

    if (mapGestureLocked) {
      state.map.dragging.disable();
      if (state.map.touchZoom) state.map.touchZoom.disable();
      if (btn) {
        btn.classList.remove('unlocked');
        btn.innerHTML = `<span class="gesture-icon">🔒</span><span class="gesture-text">地圖已鎖定（滑動不卡手）· 點擊啟用互動</span>`;
      }
    } else {
      state.map.dragging.enable();
      if (state.map.touchZoom) state.map.touchZoom.enable();
      if (btn) {
        btn.classList.add('unlocked');
        btn.innerHTML = `<span class="gesture-icon">🔓</span><span class="gesture-text">地圖互動中 · 點擊鎖定（恢復順暢滑動）</span>`;
      }
    }
  }

  function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (typeof L === 'undefined') {
      renderMapOfflineFallback(mapContainer);
      return;
    }

    try {
      state.map = L.map('map', {
        center: [26.2124, 127.6809],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(state.map);

      const gestureBtn = document.getElementById('btn-map-gesture-toggle');
      if (gestureBtn) {
        gestureBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          mapGestureLocked = !mapGestureLocked;
          syncMapGestureState();
        });
      }

      syncMapGestureState();
      window.addEventListener('resize', syncMapGestureState);

      updateMapMarkers();
    } catch (e) {
      if (typeof console !== 'undefined' && console.error) {
        console.error('Leaflet initialization failed', e);
      }
      renderMapOfflineFallback(mapContainer);
    }
  }

  function renderMapOfflineFallback(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center; background: var(--bg-surface);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🗺️</div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.35rem;">地圖正在離線待命</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 280px; line-height: 1.5;">
          若尚未載入 OpenStreetMap 圖資，您仍可點擊左側列表的「查看攻略」或「Google Maps 導航」按鈕直接啟動手機導航。
        </p>
      </div>
    `;
  }

  function updateMapMarkers() {
    if (!state.map) return;

    // Clear existing official markers & polyline
    state.markers.forEach(m => state.map.removeLayer(m));
    state.markers = [];
    state.markerMap.clear();

    if (state.polyline) {
      state.map.removeLayer(state.polyline);
      state.polyline = null;
    }

    // Clear any planner markers if in official mode
    state.plannerMarkers.forEach(m => state.map.removeLayer(m));
    state.plannerMarkers = [];
    if (state.plannerPolyline) {
      state.map.removeLayer(state.plannerPolyline);
      state.plannerPolyline = null;
    }

    const filtered = getFilteredItems();
    renderMapSpotsScroller();

    if (filtered.length === 0) return;

    const latlngs = [];

    filtered.forEach(item => {
      latlngs.push([item.lat, item.lng]);

      const pinEl = document.createElement('div');
      pinEl.className = 'custom-pin-wrapper';
      pinEl.innerHTML = `
        <div class="custom-pin ${item.category}" style="cursor:pointer;">
          <span>${item.icon}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-pin-container',
        html: pinEl.innerHTML,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const popupContent = `
        <div class="map-popup-card" style="min-width: 200px; padding: 0.25rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">
            <span>Day ${item.day} · ${item.time}</span>
            <span class="tag-badge" style="font-size:0.7rem; padding: 0.1rem 0.4rem;">${escapeHtml(item.categoryLabel)}</span>
          </div>
          <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0 0 0.25rem 0; color: var(--text-main);">${escapeHtml(item.nameZh)}</h4>
          <div style="font-size: 0.775rem; color: var(--text-muted); margin-bottom: 0.4rem;">${escapeHtml(item.name)}</div>
          <div style="font-size: 0.775rem; font-family: monospace; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">🚗 MC: ${escapeHtml(item.mapCode)}</div>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn-card-action primary btn-popup-detail" data-id="${escapeHtml(item.id)}" style="flex: 1; padding: 0.3rem 0.5rem; font-size: 0.75rem;">🔍 攻略</button>
            <button class="btn-card-action btn-popup-locate" data-id="${escapeHtml(item.id)}" style="flex: 1; padding: 0.3rem 0.5rem; font-size: 0.75rem;">📍 定位</button>
          </div>
        </div>
      `;

      const marker = L.marker([item.lat, item.lng], { icon: customIcon })
        .addTo(state.map)
        .bindPopup(popupContent);

      marker.on('click', () => {
        syncScrollerActiveChip(item.id);
      });

      marker.on('popupopen', () => {
        const popupEl = document.querySelector('.leaflet-popup-content');
        if (popupEl) {
          const detailBtn = popupEl.querySelector('.btn-popup-detail');
          const locateBtn = popupEl.querySelector('.btn-popup-locate');
          if (detailBtn) {
            detailBtn.onclick = () => window.appOpenModal(item.id);
          }
          if (locateBtn) {
            locateBtn.onclick = () => window.appScrollToCard(item.id);
          }
        }
      });

      state.markers.push(marker);
      state.markerMap.set(item.id, marker);
    });

    // Draw route polyline if single day is selected and items > 1
    if (state.activeDay !== 0 && latlngs.length > 1) {
      state.polyline = L.polyline(latlngs, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.75,
        dashArray: '8, 8'
      }).addTo(state.map);
    }

    fitMapToCurrentMarkers();
  }

  function updatePlannerMapMarkers(computedStops) {
    if (!state.map) return;

    // Clear official markers & polylines
    state.markers.forEach(m => state.map.removeLayer(m));
    state.markers = [];
    state.markerMap.clear();
    if (state.polyline) {
      state.map.removeLayer(state.polyline);
      state.polyline = null;
    }

    // Clear previous planner markers & polyline
    state.plannerMarkers.forEach(m => state.map.removeLayer(m));
    state.plannerMarkers = [];
    if (state.plannerPolyline) {
      state.map.removeLayer(state.plannerPolyline);
      state.plannerPolyline = null;
    }

    if (!computedStops || computedStops.length === 0) return;

    const latlngs = [];

    computedStops.forEach((stop, idx) => {
      if (typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;

      latlngs.push([stop.lat, stop.lng]);

      const pinHtml = `<div class="custom-route-marker">${idx + 1}</div>`;
      const customIcon = L.divIcon({
        className: 'custom-route-marker-wrap',
        html: pinHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const popupContent = `
        <div style="min-width: 190px; padding: 0.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary); margin-bottom:0.2rem;">站點 #${idx + 1}</div>
          <h4 style="font-size:0.95rem; font-weight:800; margin:0 0 0.25rem 0;">${escapeHtml(stop.nameZh || stop.name)}</h4>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.35rem;">⏰ ${stop.arrivalTime} ~ ${stop.departureTime} (${stop.durationMinutes} 分)</div>
          <div style="font-size:0.75rem; font-family:monospace; color:#0284c7; margin-bottom:0.4rem;">🚗 MC: ${escapeHtml(stop.mapCode || '無')}</div>
          <button class="btn btn-primary btn-sm btn-planner-popup-info" style="width:100%; font-size:0.75rem; padding:0.3rem;">🔍 查看景點攻略</button>
        </div>
      `;

      const marker = L.marker([stop.lat, stop.lng], { icon: customIcon })
        .addTo(state.map)
        .bindPopup(popupContent);

      marker.on('popupopen', () => {
        const popupEl = document.querySelector('.leaflet-popup-content');
        if (popupEl) {
          const infoBtn = popupEl.querySelector('.btn-planner-popup-info');
          if (infoBtn) {
            infoBtn.onclick = () => window.appOpenModal(stop.id);
          }
        }
      });

      state.plannerMarkers.push(marker);
    });

    if (latlngs.length > 1) {
      state.plannerPolyline = L.polyline(latlngs, {
        color: '#7c3aed',
        weight: 5,
        opacity: 0.85,
        dashArray: '6, 8'
      }).addTo(state.map);
    }

    fitMapToCurrentMarkers();
  }

  /* ==========================================================================
     Custom Planner Studio Implementation
     ========================================================================== */
  function initPlannerStudio() {
    const addDayBtn = document.getElementById('btn-planner-add-day');
    const delDayBtn = document.getElementById('btn-planner-del-day');
    const startTimeInput = document.getElementById('planner-day-start-time');
    const presetSelect = document.getElementById('planner-preset-select');
    const openPickerBtn = document.getElementById('btn-planner-open-spot-picker');
    const copyTextBtn = document.getElementById('btn-planner-copy-text');
    const printBtn = document.getElementById('btn-planner-print');
    const exportJsonBtn = document.getElementById('btn-planner-export-json');
    const importJsonBtn = document.getElementById('btn-planner-import-json-btn');
    const importFileInput = document.getElementById('planner-import-file-input');
    const clearDayBtn = document.getElementById('btn-planner-clear-day');

    if (addDayBtn) {
      addDayBtn.addEventListener('click', () => {
        const newDayNum = state.plannerData.days.length + 1;
        state.plannerData.days.push({
          day: newDayNum,
          title: `自訂第 ${newDayNum} 天行程`,
          startTime: '09:00',
          stops: []
        });
        state.plannerData.activeDayIndex = state.plannerData.days.length - 1;
        savePlannerData();
        renderPlannerStudio();
        showToast(`➕ 已新增第 ${newDayNum} 天行程！`);
      });
    }

    if (delDayBtn) {
      delDayBtn.addEventListener('click', () => {
        if (state.plannerData.days.length <= 1) {
          alert('至少需保留 1 天自訂行程，無法全數刪除。若需重新編排可點擊「清空當日」。');
          return;
        }
        const curDay = state.plannerData.activeDayIndex + 1;
        if (confirm(`確定要刪除「第 ${curDay} 天」的所有景點節點嗎？此動作無法復原。`)) {
          state.plannerData.days.splice(state.plannerData.activeDayIndex, 1);
          // Renumber days
          state.plannerData.days.forEach((d, idx) => d.day = idx + 1);
          state.plannerData.activeDayIndex = Math.max(0, state.plannerData.activeDayIndex - 1);
          savePlannerData();
          renderPlannerStudio();
          showToast(`🗑️ 已刪除第 ${curDay} 天行程`);
        }
      });
    }

    if (startTimeInput) {
      startTimeInput.addEventListener('change', (e) => {
        const activeDay = state.plannerData.days[state.plannerData.activeDayIndex];
        if (activeDay) {
          activeDay.startTime = e.target.value || '09:00';
          savePlannerData();
          renderPlannerStudio();
          showToast(`⏰ 已將第 ${activeDay.day} 天出發時間更新為 ${activeDay.startTime}`);
        }
      });
    }

    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const presetKey = e.target.value;
        if (!presetKey || typeof PRESET_ITINERARIES === 'undefined' || !PRESET_ITINERARIES[presetKey]) return;

        const preset = PRESET_ITINERARIES[presetKey];
        if (confirm(`確定載入範本【${preset.title}】嗎？這將會取代目前自訂規劃中的行程天數。`)) {
          state.plannerData.days = preset.days.map((d, idx) => ({
            day: idx + 1,
            title: d.title || `第 ${idx + 1} 天行程`,
            startTime: d.startTime || '09:00',
            stops: d.spotIds.map(id => createPlannerStop(id)).filter(Boolean)
          }));
          state.plannerData.activeDayIndex = 0;
          savePlannerData();
          renderPlannerStudio();
          showToast(`🌟 已成功載入【${preset.title}】！`);
        }
        presetSelect.value = '';
      });
    }

    if (openPickerBtn) {
      openPickerBtn.addEventListener('click', () => {
        openSpotPickerModal();
      });
    }

    if (copyTextBtn) {
      copyTextBtn.addEventListener('click', () => {
        exportPlannerAsText();
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.plannerData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', `okinawa-trip-custom-plan-${Date.now()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        showToast('📤 已匯出自訂行程 JSON 備份檔！');
      });
    }

    if (importJsonBtn && importFileInput) {
      importJsonBtn.addEventListener('click', () => {
        importFileInput.click();
      });

      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (imported && Array.isArray(imported.days) && imported.days.length > 0) {
              const sanitizedDays = imported.days.map((day, dIdx) => {
                const stops = Array.isArray(day.stops) ? day.stops.map(s => createPlannerStop(s)) : [];
                return {
                  day: (typeof day.day === 'number') ? day.day : (dIdx + 1),
                  title: day.title || `第 ${dIdx + 1} 天自訂行程`,
                  startTime: (typeof day.startTime === 'string' && /^\d{1,2}:\d{2}$/.test(day.startTime)) ? day.startTime : '09:00',
                  stops: stops
                };
              });
              let activeDayIndex = parseInt(imported.activeDayIndex, 10);
              if (isNaN(activeDayIndex) || activeDayIndex < 0 || activeDayIndex >= sanitizedDays.length) {
                activeDayIndex = 0;
              }
              state.plannerData = {
                activeDayIndex: activeDayIndex,
                days: sanitizedDays
              };
              savePlannerData();
              renderPlannerStudio();
              showToast('📥 成功匯入自訂行程備份！');
            } else {
              alert('匯入失敗：JSON 格式不符合行程結構。');
            }
          } catch (err) {
            alert('檔案讀取解析錯誤，請確認上傳有效的 JSON 檔案。');
          }
          importFileInput.value = '';
        };
        reader.readAsText(file);
      });
    }

    if (clearDayBtn) {
      clearDayBtn.addEventListener('click', () => {
        const activeDay = state.plannerData.days[state.plannerData.activeDayIndex];
        if (!activeDay) return;
        if (confirm(`確定要清空第 ${activeDay.day} 天的所有景點嗎？`)) {
          activeDay.stops = [];
          savePlannerData();
          renderPlannerStudio();
          showToast(`🗑️ 已清空第 ${activeDay.day} 天所有景點`);
        }
      });
    }
  }

  function renderPlannerStudio() {
    const days = state.plannerData.days;
    if (!days || days.length === 0) return;

    if (state.plannerData.activeDayIndex >= days.length) {
      state.plannerData.activeDayIndex = 0;
    }

    const activeDay = days[state.plannerData.activeDayIndex];

    // 1. Render Planner Day Navigation Tabs
    const tabsContainer = document.getElementById('planner-day-tabs');
    if (tabsContainer) {
      tabsContainer.innerHTML = days.map((d, idx) => `
        <button class="planner-day-tab-btn ${idx === state.plannerData.activeDayIndex ? 'active' : ''}" data-day-index="${idx}">
          Day ${d.day} (${d.stops.length} 站)
        </button>
      `).join('');

      const activeTab = tabsContainer.querySelector('.planner-day-tab-btn.active');
      if (activeTab) {
        setTimeout(() => {
          activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 50);
      }

      tabsContainer.querySelectorAll('.planner-day-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.plannerData.activeDayIndex = parseInt(btn.dataset.dayIndex, 10);
          renderPlannerStudio();
        });
      });
    }

    // 2. Set Start Time Input
    const startTimeInput = document.getElementById('planner-day-start-time');
    if (startTimeInput) {
      startTimeInput.value = activeDay.startTime || '09:00';
    }

    // 3. Ripple Timeline Propagation Calculation
    const timeline = calculateDayTimeline(activeDay);

    // 4. Update Dashboard Stats
    const statDriveTime = document.getElementById('stat-drive-time');
    const statDriveDist = document.getElementById('stat-drive-dist');
    const statActivityTime = document.getElementById('stat-activity-time');
    const statFinishTime = document.getElementById('stat-finish-time');
    const statStopsCount = document.getElementById('stat-stops-count');
    const statSeniorLoad = document.getElementById('stat-senior-load');
    const statYoungScore = document.getElementById('stat-young-score');
    const statHarmonyScore = document.getElementById('stat-harmony-score');

    if (statDriveTime) {
      if (timeline.totalDriveMins >= 60) {
        const dh = Math.floor(timeline.totalDriveMins / 60);
        const dm = timeline.totalDriveMins % 60;
        statDriveTime.textContent = `${dh} 時 ${dm} 分`;
      } else {
        statDriveTime.textContent = `${timeline.totalDriveMins} 分`;
      }
    }
    if (statDriveDist) statDriveDist.textContent = `${timeline.totalDriveKm} km`;
    if (statActivityTime) {
      if (timeline.totalActivityMins >= 60) {
        const ah = Math.floor(timeline.totalActivityMins / 60);
        const am = timeline.totalActivityMins % 60;
        statActivityTime.textContent = `${ah} 時 ${am} 分`;
      } else {
        statActivityTime.textContent = `${timeline.totalActivityMins} 分`;
      }
    }
    if (statFinishTime) statFinishTime.textContent = timeline.finishTime;
    if (statStopsCount) statStopsCount.textContent = `${timeline.stopsCount} 處`;

    if (statSeniorLoad) {
      statSeniorLoad.textContent = timeline.seniorLoadLabel;
      if (timeline.seniorLoadLabel.startsWith('🟢')) statSeniorLoad.style.color = '#059669';
      else if (timeline.seniorLoadLabel.startsWith('🟡')) statSeniorLoad.style.color = '#d97706';
      else statSeniorLoad.style.color = '#ef4444';
    }
    if (statYoungScore) statYoungScore.textContent = `${timeline.youngPhotoCount} 處必拍`;
    if (statHarmonyScore) statHarmonyScore.textContent = `${timeline.avgHarmonyScore} / 10`;

    // 5. Update Alert Box
    const alertBox = document.getElementById('planner-alert-box');
    if (alertBox) {
      const alerts = [];

      // Check long drive transit segments (>45m)
      const longTransit = timeline.computedStops.find(s => s.transitFromPrev && s.transitFromPrev.durationMins >= 45);
      if (longTransit) {
        alerts.push(`⚠️ <strong>長途行車如廁提醒：</strong> 前往「${escapeHtml(longTransit.nameZh || longTransit.name)}」車程預估 ${longTransit.transitFromPrev.durationMins} 分鐘。依據「90分鐘如廁律」，強烈建議在中途之道之驛（道の駅）或超商停靠5分鐘，維護40~60歲長輩膝關節與如廁舒適。`);
      }

      // Check late return time (>21:00)
      if (timeline.finishTime !== '--:--') {
        const finishH = parseInt(timeline.finishTime.split(':')[0], 10);
        if (finishH >= 21 || finishH < 4) {
          alerts.push(`🌙 <strong>熟齡晚間作息提醒：</strong> 預計 ${timeline.finishTime} 返宿，行程偏晚。40~60歲熟齡族群易感體力透支，建議適度精簡最後一站或提早返宿休息。`);
        }
      }

      if (timeline.stopsCount === 0) {
        alerts.push(`📍 <strong>目前此日尚未安排景點：</strong> 請點擊上方「➕ 新增景點」瀏覽30處精選景點或新增自訂停靠站！`);
      }

      if (alerts.length > 0) {
        alertBox.innerHTML = alerts.join('<br style="margin-bottom:0.4rem;">');
        alertBox.style.display = 'block';
        alertBox.style.borderColor = '#ef4444';
        alertBox.style.background = 'rgba(239,68,68,0.08)';
        alertBox.style.color = '#b91c1c';
      } else {
        alertBox.innerHTML = `✨ <strong>行程節奏極佳：</strong> 步調兼顧40~60歲長輩舒活休憩與25~35歲年輕探索打卡！`;
        alertBox.style.display = 'block';
        alertBox.style.borderColor = '#10b981';
        alertBox.style.background = 'rgba(16,185,129,0.08)';
        alertBox.style.color = '#065f46';
      }
    }

    // 6. Render Ordered Stops Stream
    const streamContainer = document.getElementById('planner-stops-stream');
    if (streamContainer) {
      if (timeline.computedStops.length === 0) {
        streamContainer.innerHTML = `
          <div style="text-align:center; padding:3.5rem 1.5rem; background:var(--bg-surface); border:2px dashed var(--border); border-radius:var(--radius-lg);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">🏖️</div>
            <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.35rem;">第 ${activeDay.day} 天尚未加入任何行程</h3>
            <p style="color:var(--text-muted); font-size:0.875rem; margin-bottom:1.25rem;">可直接從 30 處沖繩精選節點挑選，或快速載入經典範本。</p>
            <button class="btn btn-primary" onclick="document.getElementById('btn-planner-open-spot-picker').click()">
              ➕ 立即瀏覽景點庫並加入
            </button>
          </div>
        `;
      } else {
        let streamHtml = '';
        timeline.computedStops.forEach((stop, idx) => {
          // Transit connector before this stop
          let transitConnectorHtml = '';
          if (idx > 0 && stop.transitFromPrev) {
            transitConnectorHtml = `
              <div class="planner-transit-connector">
                <div class="planner-transit-left">
                  <span>${stop.transitFromPrev.isWalk ? '🚶' : '🚗'}</span>
                  <span>${stop.transitFromPrev.text}</span>
                </div>
                <div class="planner-transit-right">
                  <span>路段：第 ${idx} 站 ➜ 第 ${idx + 1} 站</span>
                </div>
              </div>
            `;
          }

          // Generation highlights
          const genCardsHtml = renderGenerationCardHtml(stop.generation);

          // Duration options
          const durations = [15, 30, 45, 60, 90, 120, 150, 180, 240];
          const optionsHtml = durations.map(d => `
            <option value="${d}" ${stop.durationMinutes === d ? 'selected' : ''}>停留 ${d} 分</option>
          `).join('');

          streamHtml += `
            <div class="planner-stop-item" data-index="${idx}" draggable="true">
              ${transitConnectorHtml}
              <div class="planner-stop-card">
                <div class="planner-stop-header">
                  <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                    <span class="stop-drag-handle" title="按住拖曳可自由調換站點前後順序">⠿</span>
                    <span class="stop-order-badge">${idx + 1}</span>
                    <h3 style="font-size:1.05rem; font-weight:800; margin:0; color:var(--text-main);">
                      ${stop.icon || '📍'} ${escapeHtml(stop.nameZh || stop.name)}
                    </h3>
                    <span class="stop-time-chip">⏰ ${stop.arrivalTime} ~ ${stop.departureTime}</span>
                    <div class="stop-duration-stepper">
                      <button type="button" class="btn-stop-dur-step btn-stop-dur-minus" data-index="${idx}" title="減少15分鐘" aria-label="減少15分鐘">－</button>
                      <select class="stop-duration-select" data-index="${idx}" title="調整此景點預計停留時間">
                        ${optionsHtml}
                      </select>
                      <button type="button" class="btn-stop-dur-step btn-stop-dur-plus" data-index="${idx}" title="增加15分鐘" aria-label="增加15分鐘">＋</button>
                    </div>
                    ${days.length > 1 ? `
                      <select class="stop-move-day-select" data-index="${idx}" title="將此景點移動至其他天">
                        <option value="">移至其他天...</option>
                        ${days.map((d, dIdx) => dIdx !== state.plannerData.activeDayIndex ? `<option value="${dIdx}">移至 Day ${d.day}</option>` : '').join('')}
                      </select>
                    ` : ''}
                  </div>
                  <div class="stop-reorder-btns">
                    <button class="btn-stop-ctrl" data-action="stop-up" data-index="${idx}" ${idx === 0 ? 'disabled' : ''} title="上移">⬆️</button>
                    <button class="btn-stop-ctrl" data-action="stop-down" data-index="${idx}" ${idx === timeline.computedStops.length - 1 ? 'disabled' : ''} title="下移">⬇️</button>
                    <button class="btn-stop-ctrl btn-stop-delete" data-action="stop-delete" data-index="${idx}" title="刪除此站">✕</button>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; font-size:0.8rem; color:var(--text-muted);">
                  <span>${escapeHtml(stop.name)} · ${escapeHtml(stop.nameJa || '')}</span>
                  <span class="tag-badge" style="background:var(--primary-light); color:var(--primary); font-size:0.75rem;">${escapeHtml(stop.categoryLabel || '景點')}</span>
                  <span style="font-family:monospace; font-weight:700; color:#0284c7;">MC: ${escapeHtml(stop.mapCode || '無')}</span>
                </div>

                ${genCardsHtml}

                <div class="card-footer" style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--border);">
                  <div class="card-address" style="font-size:0.8rem;">
                    <span>📍 ${escapeHtml(stop.address || '沖繩縣')}</span>
                  </div>
                  <div class="card-footer-buttons">
                    <button class="btn-card-action primary" data-action="view-stop-modal" data-id="${escapeHtml(stop.id)}">
                      <span>🔍 景點攻略</span>
                    </button>
                    <button class="btn-card-action" data-action="locate-planner-stop" data-index="${idx}">
                      <span>📍 地圖定位</span>
                    </button>
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.nameZh || stop.name)}" target="_blank" rel="noopener" class="btn-card-action">
                      <span>🗺️ 導航</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        streamContainer.innerHTML = streamHtml;

        // Attach HTML5 Drag & Drop reordering
        let draggedIndex = null;
        streamContainer.querySelectorAll('.planner-stop-item').forEach(itemEl => {
          itemEl.addEventListener('dragstart', (e) => {
            draggedIndex = parseInt(itemEl.dataset.index, 10);
            itemEl.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(draggedIndex));
          });

          itemEl.addEventListener('dragend', () => {
            itemEl.classList.remove('dragging');
            streamContainer.querySelectorAll('.planner-stop-item').forEach(el => el.classList.remove('drag-over'));
          });

          itemEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            itemEl.classList.add('drag-over');
          });

          itemEl.addEventListener('dragleave', () => {
            itemEl.classList.remove('drag-over');
          });

          itemEl.addEventListener('drop', (e) => {
            e.preventDefault();
            itemEl.classList.remove('drag-over');
            const targetIdx = parseInt(itemEl.dataset.index, 10);
            if (draggedIndex !== null && !isNaN(targetIdx) && draggedIndex !== targetIdx && activeDay.stops[draggedIndex]) {
              const moved = activeDay.stops.splice(draggedIndex, 1)[0];
              activeDay.stops.splice(targetIdx, 0, moved);
              savePlannerData();
              renderPlannerStudio();
              showToast(`🔀 已調整行程順序：【${moved.nameZh || moved.name}】移至第 ${targetIdx + 1} 站`);
            }
          });
        });

        // Attach Inter-day move select
        streamContainer.querySelectorAll('.stop-move-day-select').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const stopIdx = parseInt(e.target.dataset.index, 10);
            const targetDayIdx = parseInt(e.target.value, 10);
            if (!isNaN(targetDayIdx) && targetDayIdx >= 0 && targetDayIdx < days.length && activeDay.stops[stopIdx]) {
              const movedStop = activeDay.stops.splice(stopIdx, 1)[0];
              days[targetDayIdx].stops.push(movedStop);
              savePlannerData();
              renderPlannerStudio();
              showToast(`🚚 已將【${movedStop.nameZh || movedStop.name}】移至第 ${days[targetDayIdx].day} 天！`);
            }
          });
        });

        // Attach listeners to stop controls
        streamContainer.querySelectorAll('.stop-duration-select').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const stopIdx = parseInt(e.target.dataset.index, 10);
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && activeDay.stops[stopIdx]) {
              activeDay.stops[stopIdx].durationMinutes = val;
              savePlannerData();
              renderPlannerStudio();
            }
          });
        });

        // Duration Stepper (- / +)
        const durSteps = [15, 30, 45, 60, 90, 120, 150, 180, 240];

        streamContainer.querySelectorAll('.btn-stop-dur-minus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const stopIdx = parseInt(btn.dataset.index, 10);
            if (activeDay.stops[stopIdx]) {
              const cur = parseInt(activeDay.stops[stopIdx].durationMinutes, 10) || 60;
              let next = cur - 15;
              for (let i = durSteps.length - 1; i >= 0; i--) {
                if (durSteps[i] < cur) {
                  next = durSteps[i];
                  break;
                }
              }
              activeDay.stops[stopIdx].durationMinutes = Math.max(15, next);
              savePlannerData();
              renderPlannerStudio();
            }
          });
        });

        streamContainer.querySelectorAll('.btn-stop-dur-plus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const stopIdx = parseInt(btn.dataset.index, 10);
            if (activeDay.stops[stopIdx]) {
              const cur = parseInt(activeDay.stops[stopIdx].durationMinutes, 10) || 60;
              let next = cur + 15;
              for (let i = 0; i < durSteps.length; i++) {
                if (durSteps[i] > cur) {
                  next = durSteps[i];
                  break;
                }
              }
              activeDay.stops[stopIdx].durationMinutes = Math.min(240, next);
              savePlannerData();
              renderPlannerStudio();
            }
          });
        });

        streamContainer.querySelectorAll('[data-action="stop-up"]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index, 10);
            if (idx > 0) {
              const temp = activeDay.stops[idx];
              activeDay.stops[idx] = activeDay.stops[idx - 1];
              activeDay.stops[idx - 1] = temp;
              savePlannerData();
              renderPlannerStudio();
            }
          });
        });

        streamContainer.querySelectorAll('[data-action="stop-down"]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index, 10);
            if (idx < activeDay.stops.length - 1) {
              const temp = activeDay.stops[idx];
              activeDay.stops[idx] = activeDay.stops[idx + 1];
              activeDay.stops[idx + 1] = temp;
              savePlannerData();
              renderPlannerStudio();
            }
          });
        });

        streamContainer.querySelectorAll('[data-action="stop-delete"]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index, 10);
            const removed = activeDay.stops[idx];
            activeDay.stops.splice(idx, 1);
            savePlannerData();
            renderPlannerStudio();
            showToast(`🗑️ 已移除停靠站：${removed.nameZh || removed.name}`);
          });
        });

        streamContainer.querySelectorAll('[data-action="view-stop-modal"]').forEach(btn => {
          btn.addEventListener('click', () => {
            window.appOpenModal(btn.dataset.id);
          });
        });

        streamContainer.querySelectorAll('[data-action="locate-planner-stop"]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index, 10);
            const stop = timeline.computedStops[idx];
            if (stop && state.map) {
              state.map.setView([stop.lat, stop.lng], 15, { animate: true });
              if (state.plannerMarkers[idx]) {
                state.plannerMarkers[idx].openPopup();
              }
              const targetEl = document.getElementById('map-section') || document.getElementById('main-layout-grid');
              if (targetEl && window.innerWidth <= 900) {
                switchMobileView('map');
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              showToast(`📍 地圖已定位至第 ${idx + 1} 站：${stop.nameZh || stop.name}`);
            }
          });
        });
      }
    }

    // 7. Update Map Markers for Planner Mode
    updatePlannerMapMarkers(timeline.computedStops);
  }

  function addSpotToPlannerDay(spotIdOrObj, dayIndex) {
    if (!state.plannerData.days || state.plannerData.days.length === 0) {
      state.plannerData.days = [{ day: 1, title: '第 1 天自訂行程', startTime: '09:00', stops: [] }];
      state.plannerData.activeDayIndex = 0;
    }

    const targetIdx = (typeof dayIndex === 'number' && dayIndex >= 0 && dayIndex < state.plannerData.days.length)
      ? dayIndex
      : state.plannerData.activeDayIndex;

    const targetDay = state.plannerData.days[targetIdx];
    const newStop = createPlannerStop(spotIdOrObj);
    targetDay.stops.push(newStop);

    savePlannerData();

    if (state.itineraryMode === 'planner') {
      renderPlannerStudio();
    }

    showToast(`✅ 已將【${newStop.nameZh || newStop.name}】加入第 ${targetDay.day} 天行程！`);
  }

  function addSpotToCurrentPlannerDay(spotIdOrObj) {
    addSpotToPlannerDay(spotIdOrObj, state.plannerData.activeDayIndex);
  }

  function exportPlannerAsText() {
    const days = state.plannerData.days;
    if (!days || days.length === 0) {
      showToast('尚無任何行程可複製');
      return;
    }

    let text = '🚗 2026 沖繩自由客製自駕行程手冊\n';
    text += '================================\n';

    days.forEach(day => {
      const timeline = calculateDayTimeline(day);
      text += `\n📅 第 ${day.day} 天 (${day.title || '當日行程'})\n`;
      text += `⏰ 出發時刻：${day.startTime} | 🏁 返宿結束：${timeline.finishTime}\n`;
      text += `🛣️ 總行駛里程：${timeline.totalDriveKm} km | 總行車時間：${timeline.totalDriveMins} 分鐘\n`;
      text += `⏱️ 景點活動時長：${timeline.totalActivityMins} 分鐘 | 停靠點數：${timeline.stopsCount} 處\n`;
      text += '--------------------------------\n';

      if (timeline.computedStops.length === 0) {
        text += '(當日尚未安排景點)\n';
      } else {
        timeline.computedStops.forEach((stop, idx) => {
          if (idx > 0 && stop.transitFromPrev) {
            text += `   ⬇️  ${stop.transitFromPrev.text}\n`;
          }
          text += `${idx + 1}. [${stop.arrivalTime} ~ ${stop.departureTime}] 【${stop.nameZh || stop.name}】 (停留 ${stop.durationMinutes} 分)\n`;
          text += `   - 日本車機 MapCode: ${stop.mapCode || '無'}\n`;
          text += `   - 地點/地址: ${stop.address || '沖繩'}\n`;
          if (stop.generation) {
            if (stop.generation.senior && stop.generation.senior.keyTip) {
              text += `   - 🧓 熟齡舒活指南: ${stop.generation.senior.keyTip}\n`;
            }
            if (stop.generation.young && stop.generation.young.photoSpot) {
              text += `   - 📸 年輕探索重點: ${stop.generation.young.photoSpot}\n`;
            }
          }
        });
      }
    });

    text += '\n================================\n';
    text += '👥 跨世代共融黃金律：每 60~90 分鐘主動停靠道之驛或超商如廁活動筋骨，全家出遊零負擔！';

    copyTextToClipboard(text, '📋 已複製自訂行程時間表至剪貼簿！');
  }

  /* ==========================================================================
     Spot Picker Modal
     ========================================================================== */
  const pickerState = {
    category: 'all',
    gen: 'all',
    query: ''
  };

  function attachModalBottomSheetGestures(modalEl, closeFn) {
    if (!modalEl) return;
    const dialog = modalEl.querySelector('.modal-dialog');
    const dragHandle = modalEl.querySelector('.modal-drag-handle');
    const header = modalEl.querySelector('.modal-header');
    if (!dialog) return;

    let startY = 0;
    let currentY = 0;
    let isSwiping = false;

    const onStart = (e) => {
      if (window.innerWidth > 768) return;
      const modalBody = modalEl.querySelector('.modal-body') || modalEl.querySelector('.picker-modal-body');
      if (modalBody && modalBody.scrollTop > 0 && e.target.closest('.modal-body, .picker-modal-body')) {
        return;
      }
      startY = e.touches[0].clientY;
      currentY = startY;
      isSwiping = true;
      dialog.style.transition = 'none';
    };

    const onMove = (e) => {
      if (!isSwiping) return;
      currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      if (diffY > 0) {
        dialog.style.transform = `translateY(${diffY}px)`;
      }
    };

    const onEnd = () => {
      if (!isSwiping) return;
      isSwiping = false;
      dialog.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      const diffY = currentY - startY;
      if (diffY > 70) {
        dialog.style.transform = 'translateY(100%)';
        setTimeout(() => {
          closeFn();
          dialog.style.transform = '';
        }, 220);
      } else {
        dialog.style.transform = '';
      }
    };

    [dragHandle, header].forEach(el => {
      if (el) {
        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchmove', onMove, { passive: true });
        el.addEventListener('touchend', onEnd, { passive: true });
        el.addEventListener('touchcancel', onEnd, { passive: true });
      }
    });
  }

  function initSpotPickerModal() {
    const modal = document.getElementById('spot-picker-modal');
    const closeBtn = document.getElementById('picker-modal-close-btn');
    const searchInput = document.getElementById('picker-search-input');
    const toggleCustomBtn = document.getElementById('btn-toggle-custom-stop-form');
    const customForm = document.getElementById('custom-stop-form');
    const submitCustomBtn = document.getElementById('btn-submit-custom-stop');

    function closePicker() {
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', closePicker);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closePicker();
        }
      });
      attachModalBottomSheetGestures(modal, closePicker);
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        pickerState.query = e.target.value.trim().toLowerCase();
        renderPickerCatalog();
      });
    }

    // Category pills in picker
    const catPills = document.querySelectorAll('[data-picker-cat]');
    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        pickerState.category = pill.dataset.pickerCat;
        renderPickerCatalog();
      });
    });

    // Gen pills in picker
    const genPills = document.querySelectorAll('[data-picker-gen]');
    genPills.forEach(pill => {
      pill.addEventListener('click', () => {
        genPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        pickerState.gen = pill.dataset.pickerGen;
        renderPickerCatalog();
      });
    });

    // Custom Stop toggle & submit
    if (toggleCustomBtn && customForm) {
      toggleCustomBtn.addEventListener('click', () => {
        customForm.style.display = customForm.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (submitCustomBtn) {
      submitCustomBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('custom-spot-name');
        const catSelect = document.getElementById('custom-spot-category');
        const durInput = document.getElementById('custom-spot-duration');
        const addrInput = document.getElementById('custom-spot-address');
        const regionSelect = document.getElementById('custom-spot-region');

        const name = nameInput ? nameInput.value.trim() : '';
        if (!name) {
          alert('請輸入景點或自訂地點名稱');
          return;
        }

        const category = catSelect ? catSelect.value : 'attraction';
        const duration = durInput ? (parseInt(durInput.value, 10) || 60) : 60;
        const address = addrInput ? addrInput.value.trim() : '沖繩自訂地點';
        const selectedRegion = regionSelect ? regionSelect.value : 'naha';

        const catIcons = {
          food: '🍣',
          shopping: '🛍️',
          attraction: '⛩️',
          hotel: '🏡',
          transport: '🚗'
        };

        const regionCoords = {
          naha: { lat: 26.2124, lng: 127.6809 },
          south: { lat: 26.1360, lng: 127.6780 },
          central_west: { lat: 26.3167, lng: 127.7570 },
          central_north: { lat: 26.4950, lng: 127.8550 },
          north: { lat: 26.6940, lng: 127.8780 },
          east: { lat: 26.3350, lng: 127.9150 }
        };

        let targetCoords = regionCoords[selectedRegion] || regionCoords.naha;
        const textToCheck = (name + ' ' + address).toLowerCase();
        if (textToCheck.includes('名護') || textToCheck.includes('本部') || textToCheck.includes('美麗海') || textToCheck.includes('古宇利') || textToCheck.includes('今歸仁')) {
          targetCoords = regionCoords.north;
        } else if (textToCheck.includes('恩納') || textToCheck.includes('讀谷') || textToCheck.includes('殘波')) {
          targetCoords = regionCoords.central_north;
        } else if (textToCheck.includes('北谷') || textToCheck.includes('美國村') || textToCheck.includes('宜野灣') || textToCheck.includes('浦添') || textToCheck.includes('parco')) {
          targetCoords = regionCoords.central_west;
        } else if (textToCheck.includes('糸滿') || textToCheck.includes('南城') || textToCheck.includes('豐見城') || textToCheck.includes('八重瀨') || textToCheck.includes('奧武島')) {
          targetCoords = regionCoords.south;
        } else if (textToCheck.includes('宇流麻') || textToCheck.includes('海中道路') || textToCheck.includes('勝連') || textToCheck.includes('伊計')) {
          targetCoords = regionCoords.east;
        }

        const customObj = {
          id: 'custom-' + Date.now(),
          name: name,
          nameZh: name,
          nameJa: '',
          category: category,
          categoryLabel: getCategoryLabel(category),
          icon: catIcons[category] || '📍',
          lat: targetCoords.lat + (Math.random() - 0.5) * 0.01,
          lng: targetCoords.lng + (Math.random() - 0.5) * 0.01,
          address: address || '沖繩自訂地點',
          mapCode: '自訂私房地點',
          durationMinutes: duration,
          tags: ['自訂私房點', getCategoryLabel(category)],
          desc: `旅客自訂私房節點：${name} (${address})`,
          tips: '私房自選景點，請依現場開放時間靈活調整。',
          generation: {
            senior: {
              walkingLoad: '平緩舒適',
              walkingScore: 'green',
              seatingRest: '設有休憩環境，可依自身步調放鬆歇息',
              foodHighlights: '品嚐沖繩在地風味小吃或茶飲',
              cultureShopping: '深入體驗在地南國海島氛圍',
              keyTip: '抵達時先確認洗手間動線，長輩放慢腳步'
            },
            young: {
              photoSpot: '私房特色取景點，記錄專屬沖繩打卡美照',
              trendyFood: '發掘巷弄私房美味與潮流亮點',
              shoppingNightlife: '彈性探索自由拍照',
              keyTip: '注意營業時間與出發動線'
            },
            harmony: {
              score: 9.3,
              advice: '自由調配停留時間，長輩舒適品茶、年輕人拍照探索，皆大歡喜。',
              splitMeetingPoint: '景點大門或就近咖啡沙發座'
            }
          }
        };

        addSpotToCurrentPlannerDay(customObj);
        nameInput.value = '';
        if (addrInput) addrInput.value = '';
        if (customForm) customForm.style.display = 'none';
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }

  function getCategoryLabel(cat) {
    const labels = {
      food: '老饕美食',
      shopping: '購物商場',
      attraction: '景點文化',
      hotel: '住宿基地',
      transport: '交通租還'
    };
    return labels[cat] || '景點文化';
  }

  function openSpotPickerModal() {
    const modal = document.getElementById('spot-picker-modal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderPickerCatalog();
  }

  function renderPickerCatalog() {
    const grid = document.getElementById('picker-spots-grid');
    if (!grid || typeof SPOTS_CATALOG === 'undefined') return;

    const filtered = SPOTS_CATALOG.filter(spot => {
      // Category filter
      if (pickerState.category !== 'all') {
        if (spot.category !== pickerState.category) return false;
      }

      // Gen filter
      if (pickerState.gen === 'senior') {
        if (!spot.generation || !spot.generation.senior || spot.generation.senior.walkingScore === 'red') return false;
      } else if (pickerState.gen === 'young') {
        if (!spot.generation || !spot.generation.young || (!spot.generation.young.photoSpot && !spot.generation.young.trendyFood)) return false;
      } else if (pickerState.gen === 'harmony') {
        const score = (spot.generation && spot.generation.harmony && spot.generation.harmony.score) || (spot.generation && spot.generation.harmonyScore) || 0;
        if (score < 9.0) return false;
      }

      // Query filter
      if (pickerState.query) {
        const q = pickerState.query;
        const match = (spot.nameZh && spot.nameZh.toLowerCase().includes(q)) ||
                      (spot.name && spot.name.toLowerCase().includes(q)) ||
                      (spot.nameJa && spot.nameJa.toLowerCase().includes(q)) ||
                      (spot.address && spot.address.toLowerCase().includes(q)) ||
                      (spot.mapCode && spot.mapCode.toLowerCase().includes(q)) ||
                      (spot.tags && spot.tags.some(t => t.toLowerCase().includes(q)));
        if (!match) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:3rem 1rem; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:0.4rem;">🔍</div>
          <div style="font-weight:700;">查無符合條件的景點</div>
          <div style="font-size:0.8rem; margin-top:0.25rem;">請更換分類標籤或清除關鍵字搜尋</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(spot => {
      const senior = spot.generation ? spot.generation.senior : null;
      const young = spot.generation ? spot.generation.young : null;
      const walkScore = senior && senior.walkingScore === 'green' ? '🟢 輕鬆低步數' : (senior && senior.walkingScore === 'amber' ? '🟡 中度平坦' : '🔴 坡度較多');

      return `
        <div class="picker-spot-card">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
              <span style="font-size:1.4rem;">${spot.icon}</span>
              <span class="tag-badge" style="background:var(--primary-light); color:var(--primary); font-size:0.75rem;">${escapeHtml(spot.categoryLabel)}</span>
            </div>
            <div class="picker-spot-title">${escapeHtml(spot.nameZh)}</div>
            <div class="picker-spot-cat">${escapeHtml(spot.name)} · 建議 ${spot.defaultDurationMinutes || 60} 分</div>
            
            <div style="margin-top:0.5rem; font-size:0.775rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.25rem;">
              <div>🧓 <strong>熟齡：</strong><span style="color:#059669;">${walkScore}</span></div>
              <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(young && young.photoSpot ? young.photoSpot : '')}">
                📸 <strong>年輕：</strong>${escapeHtml(young && young.photoSpot ? young.photoSpot : '打卡勝地')}
              </div>
            </div>
          </div>

          <div class="picker-spot-footer">
            <button class="btn btn-secondary btn-sm btn-picker-preview" data-id="${escapeHtml(spot.id)}" style="font-size:0.75rem; padding:0.25rem 0.6rem;">
              🔍 攻略
            </button>
            <button class="btn-picker-add" data-id="${escapeHtml(spot.id)}">
              ➕ 加入此日
            </button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-picker-add').forEach(btn => {
      btn.addEventListener('click', () => {
        addSpotToCurrentPlannerDay(btn.dataset.id);
        const modal = document.getElementById('spot-picker-modal');
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    grid.querySelectorAll('.btn-picker-preview').forEach(btn => {
      btn.addEventListener('click', () => {
        window.appOpenModal(btn.dataset.id);
      });
    });
  }

  /* ==========================================================================
     Spot Detail Modal with 3-Perspective Tabs & Planner Action
     ========================================================================== */
  window.appOpenModal = function(id) {
    const item = findCatalogSpot(id);
    const modalOverlay = document.getElementById('spot-detail-modal');
    if (!item || !modalOverlay) return;

    document.getElementById('modal-title').textContent = item.nameZh;
    document.getElementById('modal-subtitle').textContent = `${item.name} (${item.nameJa || ''})`;

    const gen = item.generation || {};
    const senior = gen.senior || {};
    const young = gen.young || {};
    const harmonyScore = (gen.harmony && typeof gen.harmony.score === 'number') ? gen.harmony.score : (gen.harmonyScore || 9.5);
    const harmonyAdvice = (gen.harmony && gen.harmony.advice) ? gen.harmony.advice : (gen.harmonyAdvice || '');

    const walkColor = senior.walkingScore === 'green' ? '#10b981' : (senior.walkingScore === 'amber' ? '#f59e0b' : '#ef4444');

    document.getElementById('modal-content').innerHTML = `
      <div style="margin-bottom: 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <span class="card-duration-badge">⏱️ 建議停留：${item.defaultDurationMinutes || item.duration || '60'} 分鐘</span>
        <span class="tag-badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.8rem;">${escapeHtml(item.categoryLabel || '沖繩精選')}</span>
        <button class="btn btn-primary btn-sm btn-modal-quick-add" style="margin-left:auto; font-size:0.8rem;">
          ➕ 快速加入 (Day ${(state.plannerData.activeDayIndex || 0) + 1})
        </button>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.35rem;">景點介紹與特色亮點</h4>
        <p style="font-size: 0.925rem; color: var(--text-muted); line-height: 1.6;">${escapeHtml(item.desc)}</p>
      </div>

      <!-- 3 Structured Generation Perspective Cards -->
      <div style="display:flex; flex-direction:column; gap:0.85rem; margin-bottom:1.25rem;">
        
        <!-- Senior Perspective Card -->
        <div style="background: rgba(16,185,129,0.06); border-left: 4px solid #10b981; border-radius: var(--radius-sm); padding: 0.85rem 1rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem; flex-wrap:wrap;">
            <h4 style="font-size: 0.925rem; font-weight: 800; color: #059669; margin:0;">🧓 40~60歲 熟齡舒活指南</h4>
            <span style="font-size:0.775rem; font-weight:700; color:${walkColor}; border:1px solid ${walkColor}; padding:0.1rem 0.45rem; border-radius:var(--radius-full);">
              🚶 步數強度：${escapeHtml(senior.walkingLoad || '輕鬆舒適')}
            </span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.25rem;">
            <strong>🪑 座椅空調：</strong>${escapeHtml(senior.seatingRest || '設有座位環境可供歇息')}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.25rem;">
            <strong>🍵 餐飲解渴：</strong>${escapeHtml(senior.foodHighlights || '提供清淡海鮮、熱茶或在地小點')}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.35rem;">
            <strong>⛩️ 文化伴手：</strong>${escapeHtml(senior.cultureShopping || '在地身心祈福與精選特產')}
          </div>
          <div style="background:rgba(16,185,129,0.12); padding:0.4rem 0.6rem; border-radius:var(--radius-sm); font-size:0.8rem; color:#065f46; font-weight:600;">
            💡 舒活實戰對策：${escapeHtml(senior.keyTip || '下車可先確認洗手間與電梯動線，放慢遊覽步調。')}
          </div>
        </div>

        <!-- Young Perspective Card -->
        <div style="background: rgba(245,158,11,0.06); border-left: 4px solid #f59e0b; border-radius: var(--radius-sm); padding: 0.85rem 1rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
            <h4 style="font-size: 0.925rem; font-weight: 800; color: #d97706; margin:0;">📸 25~35歲 年輕探索指南</h4>
            <span class="tag-badge" style="background: rgba(245,158,11,0.15); color: #b45309; font-size: 0.75rem;">#打卡熱點</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.25rem;">
            <strong>📷 IG絕景拍照：</strong>${escapeHtml(young.photoSpot || '熱門出片打卡取景點')}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.25rem;">
            <strong>🍜 話題必吃：</strong>${escapeHtml(young.trendyFood || '網路排隊熱門美食')}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.35rem;">
            <strong>🛍️ 潮流亮點：</strong>${escapeHtml(young.shoppingNightlife || '特色服飾、露營戶外選品或夜間氛圍')}
          </div>
          <div style="background:rgba(245,158,11,0.12); padding:0.4rem 0.6rem; border-radius:var(--radius-sm); font-size:0.8rem; color:#92400e; font-weight:600;">
            ⚡ 探索實戰攻略：${escapeHtml(young.keyTip || '把握自然光最佳時間拍照，分流採購更加高效。')}
          </div>
        </div>

        <!-- Cross-Gen Harmony Advice -->
        <div style="background: rgba(124,58,237,0.06); border-left: 4px solid #7c3aed; border-radius: var(--radius-sm); padding: 0.85rem 1rem;">
          <h4 style="font-size: 0.925rem; font-weight: 800; color: #7c3aed; margin-bottom: 0.25rem;">
            🤝 跨世代共榮契合度：${harmonyScore} / 10
          </h4>
          <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin:0;">
            ${escapeHtml(harmonyAdvice || '全體各取所需，長輩在舒適座位喝茶看海，年輕人前往打卡拍照，約定集合時間皆大歡喜。')}
          </p>
        </div>

      </div>

      <div style="background: var(--bg-subtle); border-left: 4px solid var(--accent); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">💡 實用攻略與注意事項</h4>
        <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5;">${escapeHtml(item.tips || '自駕導航請優先輸入MapCode，進入停車場請遵從引導。')}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.25rem;">
        <div style="background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">日本車機 MapCode</div>
          <div style="font-family: monospace; font-size: 1rem; font-weight: 700; color: var(--primary); margin-top: 0.2rem;">${escapeHtml(item.mapCode || '無')}</div>
        </div>
        <div style="background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">地址 / 區域</div>
          <div style="font-size: 0.85rem; font-weight: 600; margin-top: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.address)}">${escapeHtml(item.address)}</div>
        </div>
      </div>
    `;

    document.getElementById('modal-nav-link').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.nameZh || item.name)}`;

    const copyBtn = document.getElementById('modal-copy-mapcode-btn');
    if (copyBtn) {
      copyBtn.textContent = '📋 複製 MapCode';
      copyBtn.onclick = () => {
        const cleanCode = (item.mapCode || '').trim();
        copyTextToClipboard(cleanCode, `📋 已複製 MapCode：${cleanCode}`);
        copyBtn.textContent = '✓ 已複製！';
        setTimeout(() => { copyBtn.textContent = '📋 複製 MapCode'; }, 1600);
      };
    }

    // Setup day selector in modal footer
    const daySelect = document.getElementById('modal-select-planner-day');
    if (daySelect && state.plannerData && Array.isArray(state.plannerData.days)) {
      daySelect.innerHTML = state.plannerData.days.map((d, dIdx) => `
        <option value="${dIdx}" ${dIdx === state.plannerData.activeDayIndex ? 'selected' : ''}>Day ${d.day} (${(d.stops || []).length} 站)</option>
      `).join('');
    }

    const addPlannerBtn = document.getElementById('btn-modal-add-to-custom');
    if (addPlannerBtn) {
      addPlannerBtn.onclick = () => {
        const selectedDayIdx = daySelect ? parseInt(daySelect.value, 10) : state.plannerData.activeDayIndex;
        addSpotToPlannerDay(item, selectedDayIdx);
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
      };
    }

    const quickAddBtn = modalOverlay.querySelector('.btn-modal-quick-add');
    if (quickAddBtn) {
      quickAddBtn.onclick = () => {
        addSpotToCurrentPlannerDay(item);
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
      };
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function initModal() {
    const modalOverlay = document.getElementById('spot-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const dragHandle = modalOverlay ? modalOverlay.querySelector('.modal-drag-handle') : null;
    const modalHeader = modalOverlay ? modalOverlay.querySelector('.modal-header') : null;
    if (!modalCloseBtn || !modalOverlay) return;

    function closeSpotModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    modalCloseBtn.addEventListener('click', closeSpotModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeSpotModal();
      }
    });

    attachModalBottomSheetGestures(modalOverlay, closeSpotModal);

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeSpotModal();
      }
    });
  }

  /* ==========================================================================
     Global Coordinate Helpers
     ========================================================================== */
  window.appFocusOnMap = function(itemId) {
    const item = findCatalogSpot(itemId);
    if (!item) return;

    if (window.innerWidth <= 900) {
      switchMobileView('map');
    }

    const marker = state.markerMap.get(itemId);
    if (state.map) {
      state.map.setView([item.lat, item.lng], Math.max(state.map.getZoom(), 15), { animate: true });
      if (marker) {
        setTimeout(() => marker.openPopup(), 150);
      }
    }

    syncScrollerActiveChip(itemId);

    const targetEl = document.getElementById('map-section') || document.getElementById('main-layout-grid');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast(`📍 已在地圖定位：${item.nameZh}`);
  };

  window.appScrollToCard = function(itemId) {
    if (window.innerWidth <= 900) {
      switchMobileView('timeline');
    }

    let cardEl = document.getElementById(`item-${itemId}`);
    
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
        if (typeof TRIP_METADATA !== 'undefined') {
          copyTextToClipboard(TRIP_METADATA.chictripUrl, '🔗 已複製去趣行程專屬分享連結！');
        }
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
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveNav(sectionId);
        }
      });
    }

    function setActiveNav(targetId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          if (href.substring(1) === targetId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
      document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        const href = btn.getAttribute('href');
        const target = btn.dataset.target || (href && href.startsWith('#') ? href.substring(1) : null);
        if (target) {
          btn.classList.toggle('active', target === targetId);
        }
      });
    }

    const mobileNavBtns = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn');
    mobileNavBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.dataset.target;
        if (!target) return;
        e.preventDefault();

        if (target === 'schedule-section') {
          if (window.innerWidth <= 900) {
            switchMobileView('timeline');
          }
          const sec = document.getElementById('schedule-section');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          setActiveNav('schedule-section');
        } else if (target === 'map-section') {
          if (window.innerWidth <= 900) {
            switchMobileView('map');
          }
          const sec = document.getElementById('map-section');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            if (state.map) state.map.invalidateSize();
          }, 250);
          setActiveNav('map-section');
        } else if (target === 'toolkit-section') {
          const sec = document.getElementById('toolkit-section');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          setActiveNav('toolkit-section');
        }
      });
    });

    const bottomSpotsBtn = document.getElementById('bottom-nav-open-spots');
    if (bottomSpotsBtn) {
      bottomSpotsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSpotPickerModal();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth Anchor Scroll
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const headerOffset = 70;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /* ==========================================================================
     Flight Selector & Dynamic Time Sync Module (華航/星宇/長榮)
     ========================================================================== */
  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const match = String(timeStr).match(/(\d{1,2}):(\d{2})/);
    if (!match) return 0;
    return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  }

  function getSelectedFlight() {
    if (state.selectedFlightId === 'custom' && state.customFlightData) {
      return state.customFlightData;
    }
    const flights = (typeof OKINAWA_FLIGHTS !== 'undefined') ? OKINAWA_FLIGHTS : (window.OKINAWA_FLIGHTS || []);
    const found = flights.find(f => f.id === state.selectedFlightId);
    return found || flights[0] || null;
  }

  function updateFlightUI(flight) {
    if (!flight) flight = getSelectedFlight();
    if (!flight) return;

    // 更新頂部 Hero 晶片
    const heroFlightName = document.getElementById('hero-flight-name');
    if (heroFlightName) {
      const outNo = flight.outbound ? flight.outbound.flightNo : '';
      const inNo = flight.inbound ? flight.inbound.flightNo : '';
      heroFlightName.textContent = `${flight.airline} ${outNo}/${inNo}`;
    }

    // 更新規劃區工具列晶片
    const plannerFlightLabel = document.getElementById('planner-flight-label');
    if (plannerFlightLabel) {
      const outNo = flight.outbound ? flight.outbound.flightNo : '';
      const inNo = flight.inbound ? flight.inbound.flightNo : '';
      plannerFlightLabel.textContent = `${outNo}/${inNo}`;
    }
  }

  function syncFlightToItinerary(flight, showToastMsg = true) {
    if (!flight) return;

    state.selectedFlightId = flight.id;
    safeStorageSet('okinawa_selected_flight', flight.id);

    // 1. 同步 Day 1 (入境取車：保留約 60 分鐘通關、提行李與接駁取車手續)
    const day1Items = (typeof SCHEDULE_ITEMS !== 'undefined') ? SCHEDULE_ITEMS.filter(it => it.day === 1) : [];
    if (day1Items.length > 0 && flight.outbound) {
      const arrTime = flight.outbound.arrTime || '10:45';
      const arrMins = parseTimeToMinutes(arrTime);
      const pickupMins = arrMins + 60; // 落地後預留 60 分鐘入境與租車手續

      // Day 1 首站：d1-1 (Toyota租車 沖繩那霸機場店)
      day1Items[0].time = formatMinutesToTime(pickupMins);
      day1Items[0].desc = `搭乘 ${flight.airline} ${flight.outbound.flightNo} (${flight.outbound.depTime} ➔ ${flight.outbound.arrTime}) 抵達沖繩那霸機場。落地預留約 60 分鐘入境通關、提領行李與接駁取車手續。完成手續後展開自駕旅程！`;

      // 連鎖推算 Day 1 後續所有景點抵達時刻
      for (let i = 1; i < day1Items.length; i++) {
        const prev = day1Items[i - 1];
        const curr = day1Items[i];
        const prevMins = parseTimeToMinutes(prev.time);
        const prevDur = (prev.durationMinutes !== undefined) ? prev.durationMinutes : 60;
        const transit = calculateTransit(prev, curr);
        const transitMins = (transit && transit.durationMins) ? transit.durationMins : 20;
        curr.time = formatMinutesToTime(prevMins + prevDur + transitMins);
      }
    }

    // 2. 同步 Day 5 (機場還車報到：起飛前約 120 分鐘抵達租車營業所還車)
    let isEarlyDay5Departure = false;
    const day5Items = (typeof SCHEDULE_ITEMS !== 'undefined') ? SCHEDULE_ITEMS.filter(it => it.day === 5) : [];
    if (day5Items.length > 0 && flight.inbound) {
      const depTime = flight.inbound.depTime || '11:55';
      const depMins = parseTimeToMinutes(depTime);
      const targetReturnMins = depMins - 120; // 起飛前 120 分鐘抵達營業所還車

      let returnIdx = day5Items.findIndex(it => it.id === 'd5-5');
      if (returnIdx < 0) returnIdx = Math.max(0, day5Items.length - 2);

      // 倒推計算 Day 5 出發時間：使還車處正好在 targetReturnMins 抵達
      let elapsedBeforeReturn = 0;
      for (let i = 0; i < returnIdx; i++) {
        const it = day5Items[i];
        const dur = (it.durationMinutes !== undefined) ? it.durationMinutes : 60;
        elapsedBeforeReturn += dur;
        const transit = calculateTransit(it, day5Items[i + 1]);
        elapsedBeforeReturn += (transit && transit.durationMins ? transit.durationMins : 20);
      }

      let computedDay5Start = targetReturnMins - elapsedBeforeReturn;
      while (computedDay5Start < 0) computedDay5Start += 24 * 60;
      computedDay5Start = computedDay5Start % (24 * 60);
      if (computedDay5Start < 390) isEarlyDay5Departure = true; // 06:30 前出發

      // 設定 Day 5 第一站時間
      day5Items[0].time = formatMinutesToTime(computedDay5Start);

      // 順推連鎖更新 Day 5 所有站點時刻
      for (let i = 1; i < day5Items.length; i++) {
        const prev = day5Items[i - 1];
        const curr = day5Items[i];
        const prevMins = parseTimeToMinutes(prev.time);
        const prevDur = (prev.durationMinutes !== undefined) ? prev.durationMinutes : 60;
        const transit = calculateTransit(prev, curr);
        const transitMins = (transit && transit.durationMins) ? transit.durationMins : 20;
        curr.time = formatMinutesToTime(prevMins + prevDur + transitMins);
      }

      // 更新還車處與航廈註記
      if (day5Items[returnIdx]) {
        day5Items[returnIdx].desc = `搭乘 ${flight.airline} ${flight.inbound.flightNo} (${flight.inbound.depTime} ➔ ${flight.inbound.arrTime}) 返台。起飛前 120 分鐘抵達豐田租車站，辦理驗車與油單核對，搭乘免費接駁車前往航廈。`;
      }

      const airportItem = day5Items[day5Items.length - 1];
      if (airportItem) {
        airportItem.nameZh = `那霸機場 國際線航廈 (${flight.inbound.flightNo} 登機返台)`;
        airportItem.desc = `抵達那霸機場辦理航空公司登機報到與行李託運手續（${flight.inbound.flightNo} ${flight.inbound.depTime}起飛）。通關後至DFS免稅提貨櫃台領貨，候機準備返台！`;
      }
    }

    // 3. 同步 Planner 自訂行程資料庫
    if (state.plannerData && Array.isArray(state.plannerData.days)) {
      // Day 1
      if (state.plannerData.days.length >= 1 && flight.outbound) {
        const arrTime = flight.outbound.arrTime || '10:45';
        const arrMins = parseTimeToMinutes(arrTime);
        state.plannerData.days[0].startTime = formatMinutesToTime(arrMins + 60);
      }

      // Day 5
      if (state.plannerData.days.length >= 5 && flight.inbound) {
        const depTime = flight.inbound.depTime || '11:55';
        const depMins = parseTimeToMinutes(depTime);
        const targetReturnMins = depMins - 120;

        const day5Stops = state.plannerData.days[4].stops || [];
        if (day5Stops.length > 0) {
          let elapsedBeforeLast = 0;
          for (let i = 0; i < day5Stops.length - 1; i++) {
            const s = day5Stops[i];
            const dur = (s.durationMinutes !== undefined) ? s.durationMinutes : 60;
            elapsedBeforeLast += dur;
            const transit = calculateTransit(s, day5Stops[i + 1]);
            elapsedBeforeLast += (transit && transit.durationMins ? transit.durationMins : 20);
          }
          let day5StartMins = targetReturnMins - elapsedBeforeLast;
          while (day5StartMins < 0) day5StartMins += 24 * 60;
          day5StartMins = day5StartMins % (24 * 60);
          state.plannerData.days[4].startTime = formatMinutesToTime(day5StartMins);
        }
      }
      savePlannerData();
    }

    // 4. 更新 UI 與重繪時間軸
    updateFlightUI(flight);
    if (typeof renderTimeline === 'function') renderTimeline();
    if (typeof renderPlannerStudio === 'function') renderPlannerStudio();

    if (showToastMsg) {
      if (isEarlyDay5Departure) {
        showToast(`✈️ 已切換為【${flight.name}】！⚠️ 回程為早班機，Day 5 出發較早，建議適度精簡當日景點停留。`);
      } else {
        showToast(`✈️ 已成功切換為【${flight.name}】！Day 1 抵達與 Day 5 機場還車時間已智慧同步連鎖推算。`);
      }
    }
  }

  function renderFlightCards(filter = 'all') {
    const container = document.getElementById('flight-cards-container');
    const customForm = document.getElementById('custom-flight-form-card');
    if (!container) return;

    if (filter === 'custom') {
      container.style.display = 'none';
      if (customForm) customForm.style.display = 'block';
      return;
    }

    container.style.display = 'flex';
    if (customForm) customForm.style.display = 'none';

    const flights = (typeof OKINAWA_FLIGHTS !== 'undefined') ? OKINAWA_FLIGHTS : (window.OKINAWA_FLIGHTS || []);
    let filtered = flights;
    if (filter === 'CI') filtered = flights.filter(f => f.airlineCode === 'CI');
    else if (filter === 'JX') filtered = flights.filter(f => f.airlineCode === 'JX');
    else if (filter === 'BR') filtered = flights.filter(f => f.airlineCode === 'BR');
    else if (filter === 'all' && state.customFlightData) {
      filtered = [state.customFlightData, ...flights];
    }

    const currentFlight = getSelectedFlight();

    container.innerHTML = filtered.map(flight => {
      const isCurrent = currentFlight && (currentFlight.id === flight.id);
      return `
        <div class="flight-card ${isCurrent ? 'active-flight' : ''}" style="border-left-color: ${flight.airlineColor || '#0284c7'};" data-flight-id="${flight.id}">
          <div class="flight-card-header">
            <div class="flight-card-airline-title">
              <span style="font-size:1.3rem;">${flight.airlineLogo || '✈️'}</span>
              <span class="flight-airline-badge" style="color:${flight.airlineColor || '#0f172a'};">${escapeHtml(flight.name)}</span>
            </div>
            <div class="flight-card-tags">
              <span class="badge ${flight.badgeClass || 'badge-primary'}">${escapeHtml(flight.badge || flight.tag)}</span>
              ${isCurrent ? '<span class="badge badge-success" style="font-weight:700;">✓ 當前套用中</span>' : ''}
            </div>
          </div>

          <div class="flight-legs-grid">
            <div class="flight-leg-box">
              <span class="flight-leg-label">🛫 去程班機 (${flight.outbound.flightNo})</span>
              <div class="flight-leg-route">
                <span>${escapeHtml(flight.outbound.from)}</span>
                <span class="flight-route-arrow">➔</span>
                <span>${escapeHtml(flight.outbound.to)}</span>
              </div>
              <div class="flight-leg-timing">
                <span>起降：<strong>${flight.outbound.depTime}</strong> 起飛 ➔ <strong>${flight.outbound.arrTime}</strong> 抵達</span>
                <span style="color:var(--text-muted); font-size:0.75rem;">(${flight.outbound.duration})</span>
              </div>
            </div>

            <div class="flight-leg-box">
              <span class="flight-leg-label">🛬 回程班機 (${flight.inbound.flightNo})</span>
              <div class="flight-leg-route">
                <span>${escapeHtml(flight.inbound.from)}</span>
                <span class="flight-route-arrow">➔</span>
                <span>${escapeHtml(flight.inbound.to)}</span>
              </div>
              <div class="flight-leg-timing">
                <span>起降：<strong>${flight.inbound.depTime}</strong> 起飛 ➔ <strong>${flight.inbound.arrTime}</strong> 抵達</span>
                <span style="color:var(--text-muted); font-size:0.75rem;">(${flight.inbound.duration})</span>
              </div>
            </div>
          </div>

          <div class="flight-card-footer">
            <div class="flight-notes-text">
              💡 ${escapeHtml(flight.notes || '')}
            </div>
            <div>
              <button type="button" class="btn-apply-flight ${isCurrent ? 'is-current' : 'btn-primary'}" data-flight-id="${flight.id}">
                ${isCurrent ? '✓ 當前航班' : '✈️ 選擇此航班'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 綁定卡片整張點擊與按鈕選擇 (支援行動端單手直接輕觸切換)
    container.querySelectorAll('.flight-card').forEach(card => {
      card.addEventListener('click', () => {
        const fId = card.dataset.flightId;
        let targetFlight = (state.customFlightData && state.customFlightData.id === fId) ? state.customFlightData : flights.find(f => f.id === fId);
        if (targetFlight) {
          syncFlightToItinerary(targetFlight, true);
          renderFlightCards(state.flightFilter);
          closeFlightModal();
        }
      });
    });

    container.querySelectorAll('.btn-apply-flight').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fId = btn.dataset.flightId;
        let targetFlight = (state.customFlightData && state.customFlightData.id === fId) ? state.customFlightData : flights.find(f => f.id === fId);
        if (targetFlight) {
          syncFlightToItinerary(targetFlight, true);
          renderFlightCards(state.flightFilter);
          closeFlightModal();
        }
      });
    });
  }

  function openFlightModal() {
    const modal = document.getElementById('flight-modal-overlay');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }, 10);
    renderFlightCards(state.flightFilter);
  }

  function closeFlightModal() {
    const modal = document.getElementById('flight-modal-overlay');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 250);
  }

  function initFlightSelector() {
    const triggerBtn = document.getElementById('btn-flight-selector');
    if (triggerBtn) triggerBtn.addEventListener('click', openFlightModal);

    const heroPill = document.getElementById('hero-flight-pill');
    if (heroPill) heroPill.addEventListener('click', openFlightModal);

    const plannerChangeBtn = document.getElementById('btn-planner-change-flight');
    if (plannerChangeBtn) plannerChangeBtn.addEventListener('click', openFlightModal);

    const plannerBadge = document.getElementById('planner-flight-badge');
    if (plannerBadge) plannerBadge.addEventListener('click', openFlightModal);

    const closeBtn = document.getElementById('btn-close-flight-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeFlightModal);

    const modalOverlay = document.getElementById('flight-modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeFlightModal();
      });
    }

    // Filter tabs
    const filterTabs = document.getElementById('flight-filter-tabs');
    if (filterTabs) {
      filterTabs.querySelectorAll('.flight-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterTabs.querySelectorAll('.flight-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.flightFilter = btn.dataset.filter || 'all';
          renderFlightCards(state.flightFilter);
        });
      });
    }

    // Custom flight form buttons
    const btnCancelCustom = document.getElementById('btn-custom-flight-cancel');
    if (btnCancelCustom) {
      btnCancelCustom.addEventListener('click', () => {
        state.flightFilter = 'all';
        if (filterTabs) {
          filterTabs.querySelectorAll('.flight-filter-btn').forEach(b => b.classList.remove('active'));
          const allBtn = filterTabs.querySelector('.flight-filter-btn[data-filter="all"]');
          if (allBtn) allBtn.classList.add('active');
        }
        renderFlightCards('all');
      });
    }

    const btnSaveCustom = document.getElementById('btn-custom-flight-save');
    if (btnSaveCustom) {
      btnSaveCustom.addEventListener('click', () => {
        const airline = (document.getElementById('custom-flight-airline') && document.getElementById('custom-flight-airline').value.trim()) || '自訂航班';
        const outNo = (document.getElementById('custom-flight-outbound-no') && document.getElementById('custom-flight-outbound-no').value.trim()) || '自訂去程';
        const outFrom = (document.getElementById('custom-flight-outbound-from') && document.getElementById('custom-flight-outbound-from').value.trim()) || 'TPE 桃園 (T2)';
        const outTo = (document.getElementById('custom-flight-outbound-to') && document.getElementById('custom-flight-outbound-to').value.trim()) || 'OKA 那霸 (國際線)';
        const outDep = (document.getElementById('custom-flight-outbound-deptime') && document.getElementById('custom-flight-outbound-deptime').value) || '08:15';
        const outArr = (document.getElementById('custom-flight-outbound-arrtime') && document.getElementById('custom-flight-outbound-arrtime').value) || '10:45';

        const inNo = (document.getElementById('custom-flight-inbound-no') && document.getElementById('custom-flight-inbound-no').value.trim()) || '自訂回程';
        const inFrom = (document.getElementById('custom-flight-inbound-from') && document.getElementById('custom-flight-inbound-from').value.trim()) || 'OKA 那霸 (國際線)';
        const inTo = (document.getElementById('custom-flight-inbound-to') && document.getElementById('custom-flight-inbound-to').value.trim()) || 'TPE 桃園 (T2)';
        const inDep = (document.getElementById('custom-flight-inbound-deptime') && document.getElementById('custom-flight-inbound-deptime').value) || '11:55';
        const inArr = (document.getElementById('custom-flight-inbound-arrtime') && document.getElementById('custom-flight-inbound-arrtime').value) || '12:35';

        const customObj = {
          id: 'custom',
          airline: airline,
          airlineEn: airline,
          airlineCode: 'CUSTOM',
          airlineColor: '#8b5cf6',
          airlineLogo: '✈️',
          name: `${airline} · 自訂班機`,
          routeType: 'tpe-oka',
          badge: '自訂航班',
          badgeClass: 'badge-secondary',
          tag: '自訂',
          outbound: {
            flightNo: outNo,
            airline: airline,
            from: outFrom,
            to: outTo,
            airportCode: 'OKA',
            depTime: outDep,
            arrTime: outArr,
            duration: '自訂時長'
          },
          inbound: {
            flightNo: inNo,
            airline: airline,
            from: inFrom,
            to: inTo,
            airportCode: 'OKA',
            depTime: inDep,
            arrTime: inArr,
            duration: '自訂時長'
          },
          notes: '使用者自訂航班與起降時刻，已智慧同步 Day 1 入境與 Day 5 機場還車時間。'
        };

        state.selectedFlightId = 'custom';
        state.customFlightData = customObj;
        safeStorageSet('okinawa_selected_flight', 'custom');
        safeStorageSet('okinawa_custom_flight_data', JSON.stringify(customObj));
        syncFlightToItinerary(customObj, true);
        closeFlightModal();
      });
    }
  }

  /* ==========================================================================
     Toast Notification System
     ========================================================================== */
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = msg;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s forwards ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3200);
  }

  /* Expose internal engine for testing and programmatic automation */
  window.__okinawaApp__ = {
    calcDistanceKm,
    calculateTransit,
    formatMinutesToTime,
    parseTimeToMinutes,
    calculateDayTimeline,
    createPlannerStop,
    findCatalogSpot,
    addSpotToPlannerDay,
    addSpotToCurrentPlannerDay,
    getSelectedFlight,
    syncFlightToItinerary,
    state
  };
});
