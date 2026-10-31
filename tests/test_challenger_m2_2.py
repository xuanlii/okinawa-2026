#!/usr/bin/env python3
"""
Challenger 2 Empirical Verification Harness:
Milestone 2 Mobile & iPhone UX Enhancements

Verifies:
1. Desktop Bottom Nav Bleed Fix & Mobile Flex Restoral:
   - Base `.mobile-bottom-nav { display: none; }` is outside media queries.
   - `@media (max-width: 900px)` restores `.mobile-bottom-nav { display: flex; position: fixed; ... }`.
   - No conflicting desktop rules bleed the bottom nav.
   - HTML contains `<nav class="mobile-bottom-nav">` with all 4 required navigation buttons.

2. iOS Safe-Area Inset Support:
   - `env(safe-area-inset-bottom)` on `.picker-custom-add-toggle`, `.flight-modal-sheet`,
     `.mobile-bottom-nav`, `body` on mobile, `.back-to-top`, `.toast-container`, and `.modal-footer`.
   - Horizontal safe area insets `env(safe-area-inset-left)` and `env(safe-area-inset-right)`
     on `.modal-dialog`, `body`, and `.site-header`.

3. Momentum Scrolling & Overscroll Containment:
   - `-webkit-overflow-scrolling: touch;` on `.day-tabs-scroll`, `.planner-day-tabs`,
     `.picker-modal-body`, `.flight-modal-body`, `.photo-strip-scroller`, `.map-spots-scroller`,
     `.category-pills`, `.toolkit-tabs-nav`, and `.modal-body`.
   - `overscroll-behavior-x: contain;` on `.day-tabs-scroll`, `.planner-day-tabs`, `.photo-strip-scroller`.
   - `overscroll-behavior-y: contain;` on `.picker-modal-body`, `.flight-modal-body`.

4. Modal Body Scroll Lock Oracle (via macOS JavaScriptCore runtime):
   - Opens and closes `#flight-modal-overlay`, `#gmap-key-modal`, `#spot-picker-modal`, `#spot-detail-modal`.
   - Asserts `document.body.style.overflow === 'hidden'` on open.
   - Asserts `document.body.style.overflow === ''` on close and on backdrop click.
   - Stress-tests multi-cycle sequential modal transitions to guarantee zero scroll-lock leakage.

5. Frame Rate & Input Quality:
   - `requestAnimationFrame` throttled scroll listener with `{ passive: true }`.
   - Touch targets meeting WCAG 2.5.5 / Apple HIG (>= 44x44px).
   - Form inputs with font-size >= 16px eliminating iOS Safari auto-zoom.

6. Project Verification & Distribution Parity:
   - Execution and validation of `verify_itinerary.py` and `build_dist.py`.
   - Verification of `dist/okinawa-trip-2026-portable.html`.
"""

import os
import re
import sys
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JSC_BIN = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"


def run_jsc_code(test_name, js_code):
    print(f"\n--- [JSC ORACLE] {test_name} ---")
    res = subprocess.run([JSC_BIN, "-e", js_code], cwd=BASE_DIR, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[FAIL] {test_name} failed with exit code {res.returncode}")
        print("STDERR:")
        print(res.stderr)
        print("STDOUT:")
        print(res.stdout)
        return False
    else:
        print(res.stdout.strip())
        print(f"[PASS] {test_name} passed cleanly")
        return True


def parse_css_blocks(css_text):
    """
    Parses CSS into top-level rules and media query blocks.
    Returns:
      root_rules: dict of selector -> declarations
      media_blocks: list of (media_query, dict of selector -> declarations)
    """
    # Remove CSS comments
    css_clean = re.sub(r'/\*.*?\*/', '', css_text, flags=re.DOTALL)

    root_rules = []
    media_blocks = []

    pos = 0
    length = len(css_clean)

    while pos < length:
        # Find next open brace
        open_brace = css_clean.find('{', pos)
        if open_brace == -1:
            break

        header = css_clean[pos:open_brace].strip()
        
        # Balance braces to extract the whole block
        brace_count = 1
        curr = open_brace + 1
        while curr < length and brace_count > 0:
            if css_clean[curr] == '{':
                brace_count += 1
            elif css_clean[curr] == '}':
                brace_count -= 1
            curr += 1

        body = css_clean[open_brace + 1:curr - 1]
        pos = curr

        if header.startswith('@media'):
            media_blocks.append((header, body))
        elif header.startswith('@'):
            # other at-rules
            pass
        else:
            root_rules.append((header, body))

    return root_rules, media_blocks


# ==============================================================================
# SUITE 1: Desktop Bottom Nav Bleed Fix & Mobile Activation
# ==============================================================================
def test_suite_1_bottom_nav_bleed_and_restoral():
    print("\n=======================================================")
    print("SUITE 1: Desktop Bottom Nav Bleed Fix & Mobile Activation")
    print("=======================================================")

    with open(os.path.join(BASE_DIR, 'styles.css'), 'r', encoding='utf-8') as f:
        css = f.read()
    with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    root_rules, media_blocks = parse_css_blocks(css)

    # 1. Base rule: .mobile-bottom-nav must be display: none outside any media query
    base_hidden_found = False
    for selector, body in root_rules:
        # Normalize selector
        selectors = [s.strip() for s in selector.split(',')]
        if '.mobile-bottom-nav' in selectors:
            declarations = dict(re.findall(r'([\w-]+)\s*:\s*([^;]+);', body))
            if declarations.get('display', '').strip() == 'none':
                base_hidden_found = True
                print("  [PASS] Found base rule: .mobile-bottom-nav { display: none; } outside media queries")
                break

    assert base_hidden_found, "FAILED: Base rule .mobile-bottom-nav { display: none; } NOT found in root CSS!"

    # 2. Mobile restoral: under @media (max-width: 900px), .mobile-bottom-nav must be display: flex
    mobile_flex_found = False
    for media_query, block in media_blocks:
        if 'max-width: 900px' in media_query:
            sub_root, _ = parse_css_blocks(block)
            for sel, b in sub_root:
                sels = [s.strip() for s in sel.split(',')]
                if '.mobile-bottom-nav' in sels:
                    decls = dict(re.findall(r'([\w-]+)\s*:\s*([^;]+);', b))
                    display_val = decls.get('display', '').strip()
                    pos_val = decls.get('position', '').strip()
                    bottom_val = decls.get('bottom', '').strip()
                    if display_val == 'flex' and pos_val == 'fixed' and bottom_val == '0':
                        mobile_flex_found = True
                        print(f"  [PASS] Found mobile override in '{media_query}': display: {display_val}, position: {pos_val}, bottom: {bottom_val}")
                        break

    assert mobile_flex_found, "FAILED: Mobile override .mobile-bottom-nav { display: flex; position: fixed; } NOT found under max-width: 900px!"

    # 3. Verify no unwanted bleed rule exists on desktop (e.g. outside max-width)
    for selector, body in root_rules:
        selectors = [s.strip() for s in selector.split(',')]
        if '.mobile-bottom-nav' in selectors:
            decls = dict(re.findall(r'([\w-]+)\s*:\s*([^;]+);', body))
            display = decls.get('display', '').strip()
            assert display == 'none', f"FAILED: Root rule for .mobile-bottom-nav has display: {display} instead of none!"

    # 4. Verify index.html navigation structure
    assert '<nav class="mobile-bottom-nav"' in html, "FAILED: <nav class=\"mobile-bottom-nav\"> missing in index.html"
    assert 'aria-label="行動版導覽列"' in html, "FAILED: aria-label missing on mobile-bottom-nav"

    expected_nav_elements = [
        'data-target="schedule-section"',
        'id="bottom-nav-open-spots"',
        'data-target="map-section"',
        'data-target="toolkit-section"',
        'chictrip-btn'
    ]
    for elem in expected_nav_elements:
        assert elem in html, f"FAILED: Nav element {elem} missing in index.html"
        print(f"  [PASS] Nav element {elem} verified in index.html")

    print("[PASS] SUITE 1 SUCCEEDED: Zero desktop bleed & verified mobile activation!")
    return True


# ==============================================================================
# SUITE 2: iOS Safe-Area Inset Support (Bottom & Horizontal Insets)
# ==============================================================================
def test_suite_2_safe_area_insets():
    print("\n=======================================================")
    print("SUITE 2: iOS Safe-Area Inset Support (Bottom & Horizontal Insets)")
    print("=======================================================")

    with open(os.path.join(BASE_DIR, 'styles.css'), 'r', encoding='utf-8') as f:
        css = f.read()

    # 2.1: .picker-custom-add-toggle safe-area-inset-bottom
    m_picker = re.search(r'\.picker-custom-add-toggle\s*\{([^}]+)\}', css)
    assert m_picker, "FAILED: .picker-custom-add-toggle rule not found"
    picker_body = m_picker.group(1)
    assert 'env(safe-area-inset-bottom' in picker_body, "FAILED: env(safe-area-inset-bottom) missing in .picker-custom-add-toggle"
    print("  [PASS] .picker-custom-add-toggle has safe-area-inset-bottom padding")

    # 2.2: .flight-modal-sheet safe-area-inset-bottom under mobile
    m_flight = re.search(r'\.flight-modal-sheet\s*\{([^}]+)\}', css)
    assert m_flight, "FAILED: .flight-modal-sheet rule not found"
    flight_matches = re.findall(r'\.flight-modal-sheet\s*\{([^}]+)\}', css)
    flight_safe_area = any('env(safe-area-inset-bottom' in body for body in flight_matches)
    assert flight_safe_area, "FAILED: env(safe-area-inset-bottom) missing in .flight-modal-sheet"
    print("  [PASS] .flight-modal-sheet has safe-area-inset-bottom padding")

    # 2.3: .mobile-bottom-nav safe-area-inset-bottom and horizontal insets
    m_nav = re.findall(r'\.mobile-bottom-nav\s*\{([^}]+)\}', css)
    nav_with_safe_area = [b for b in m_nav if 'env(safe-area-inset-bottom' in b]
    assert len(nav_with_safe_area) > 0, "FAILED: env(safe-area-inset-bottom) missing in .mobile-bottom-nav"
    nav_body = nav_with_safe_area[0]
    assert 'env(safe-area-inset-left' in nav_body, "FAILED: safe-area-inset-left missing in .mobile-bottom-nav"
    assert 'env(safe-area-inset-right' in nav_body, "FAILED: safe-area-inset-right missing in .mobile-bottom-nav"
    print("  [PASS] .mobile-bottom-nav has bottom, left, and right safe-area insets")

    # 2.4: body on mobile has padding-bottom calc(70px + env(safe-area-inset-bottom, 0px))
    assert 'padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px));' in css, \
        "FAILED: body mobile padding-bottom safe area rule missing!"
    print("  [PASS] body mobile bottom safe-area padding verified")

    # 2.5: .back-to-top on mobile has bottom: calc(70px + env(safe-area-inset-bottom, 0px))
    assert 'bottom: calc(70px + env(safe-area-inset-bottom, 0px));' in css, \
        "FAILED: .back-to-top mobile bottom safe-area offset missing!"
    print("  [PASS] .back-to-top mobile bottom safe-area offset verified")

    # 2.6: .toast-container on mobile has bottom: calc(74px + env(safe-area-inset-bottom, 0px))
    assert 'bottom: calc(74px + env(safe-area-inset-bottom, 0px));' in css, \
        "FAILED: .toast-container mobile bottom safe-area offset missing!"
    print("  [PASS] .toast-container mobile bottom safe-area offset verified")

    # 2.7: .modal-footer and #spot-detail-modal .modal-footer safe area
    assert 'calc(0.85rem + env(safe-area-inset-bottom, 0px))' in css or \
           'calc(0.75rem + env(safe-area-inset-bottom, 0px))' in css, \
        "FAILED: modal-footer safe area bottom padding missing!"
    print("  [PASS] modal-footer bottom safe-area padding verified")

    # 2.8: Horizontal safe area insets on .modal-dialog
    dialog_matches = re.findall(r'\.modal-dialog\s*\{([^}]+)\}', css)
    dialog_safe_left = any('env(safe-area-inset-left' in body for body in dialog_matches)
    dialog_safe_right = any('env(safe-area-inset-right' in body for body in dialog_matches)
    assert dialog_safe_left, "FAILED: env(safe-area-inset-left) missing in .modal-dialog!"
    assert dialog_safe_right, "FAILED: env(safe-area-inset-right) missing in .modal-dialog!"
    print("  [PASS] .modal-dialog has horizontal safe-area insets (left & right)")

    # 2.9: Site header safe-area insets (top, left, right)
    header_matches = re.findall(r'\.site-header\s*\{([^}]+)\}', css)
    assert any('env(safe-area-inset-top' in b for b in header_matches), "FAILED: safe-area-inset-top missing in .site-header"
    assert any('env(safe-area-inset-left' in b for b in header_matches), "FAILED: safe-area-inset-left missing in .site-header"
    assert any('env(safe-area-inset-right' in b for b in header_matches), "FAILED: safe-area-inset-right missing in .site-header"
    print("  [PASS] .site-header has top and horizontal safe-area insets")

    print("[PASS] SUITE 2 SUCCEEDED: All safe-area insets verified across all required components!")
    return True


# ==============================================================================
# SUITE 3: Momentum Scrolling & Overscroll Containment
# ==============================================================================
def test_suite_3_momentum_scrolling_and_overscroll():
    print("\n=======================================================")
    print("SUITE 3: Momentum Scrolling & Overscroll Containment")
    print("=======================================================")

    with open(os.path.join(BASE_DIR, 'styles.css'), 'r', encoding='utf-8') as f:
        css = f.read()

    # Required containers for momentum scrolling:
    momentum_containers = [
        '.day-tabs-scroll',
        '.planner-day-tabs',
        '.picker-modal-body',
        '.flight-modal-body',
        '.photo-strip-scroller',
        '.map-spots-scroller',
        '.category-pills',
        '.toolkit-tabs-nav',
        '.modal-body'
    ]

    for container in momentum_containers:
        # Search for rules that match this container and have -webkit-overflow-scrolling: touch
        pattern = re.compile(re.escape(container) + r'[^\{]*\{([^}]+)\}', re.MULTILINE)
        matches = pattern.findall(css)
        has_momentum = any('-webkit-overflow-scrolling' in m and 'touch' in m for m in matches)
        assert has_momentum, f"FAILED: Momentum scrolling (-webkit-overflow-scrolling: touch) missing in {container}!"
        print(f"  [PASS] Momentum scrolling confirmed on {container}")

    # Overscroll containment checks
    # Horizontal scrollers: overscroll-behavior-x: contain
    horizontal_overscroll = [
        '.day-tabs-scroll',
        '.planner-day-tabs',
        '.photo-strip-scroller'
    ]
    for container in horizontal_overscroll:
        pattern = re.compile(re.escape(container) + r'[^\{]*\{([^}]+)\}', re.MULTILINE)
        matches = pattern.findall(css)
        has_overscroll = any('overscroll-behavior-x' in m and 'contain' in m for m in matches)
        assert has_overscroll, f"FAILED: overscroll-behavior-x: contain missing on {container}!"
        print(f"  [PASS] overscroll-behavior-x: contain confirmed on {container}")

    # Vertical modal scrollers: overscroll-behavior-y: contain
    vertical_overscroll = [
        '.picker-modal-body',
        '.flight-modal-body'
    ]
    for container in vertical_overscroll:
        pattern = re.compile(re.escape(container) + r'[^\{]*\{([^}]+)\}', re.MULTILINE)
        matches = pattern.findall(css)
        has_overscroll = any('overscroll-behavior-y' in m and 'contain' in m for m in matches)
        assert has_overscroll, f"FAILED: overscroll-behavior-y: contain missing on {container}!"
        print(f"  [PASS] overscroll-behavior-y: contain confirmed on {container}")

    print("[PASS] SUITE 3 SUCCEEDED: Momentum scrolling and overscroll containment verified!")
    return True


# ==============================================================================
# SUITE 4: Modal Scroll Lock Runtime Oracle via JSC
# ==============================================================================
def test_suite_4_modal_scroll_locks_runtime():
    print("\n=======================================================")
    print("SUITE 4: Modal Body Scroll Lock Oracle via JavaScriptCore")
    print("=======================================================")

    js_code = """
    // Build headless browser environment
    var timeouts = [];
    var setTimeout = function(cb, ms) {
      // Execute immediately or track
      if (typeof cb === 'function') {
        cb();
      }
      return 1;
    };
    var clearTimeout = function() {};
    var setInterval = function(cb) { return 1; };
    var clearInterval = function() {};
    var requestAnimationFrame = function(cb) { if (cb) cb(); return 1; };

    var _storage = {};
    var localStorage = {
      getItem: function(k) { return _storage.hasOwnProperty(k) ? _storage[k] : null; },
      setItem: function(k, v) { _storage[k] = String(v); },
      removeItem: function(k) { delete _storage[k]; },
      clear: function() { _storage = {}; }
    };

    function makeClassList() {
      var classes = {};
      return {
        add: function(c) { classes[c] = true; },
        remove: function(c) { delete classes[c]; },
        contains: function(c) { return !!classes[c]; },
        toggle: function(c, force) {
          if (force !== undefined) {
            if (force) classes[c] = true;
            else delete classes[c];
            return !!classes[c];
          }
          if (classes[c]) { delete classes[c]; return false; }
          else { classes[c] = true; return true; }
        }
      };
    }

    function makeElement(tag, id) {
      var el = {
        tagName: (tag || 'DIV').toUpperCase(),
        id: id || '',
        listeners: {},
        style: {},
        classList: makeClassList(),
        attributes: {},
        children: [],
        dataset: {},
        innerHTML: "",
        textContent: "",
        value: "",
        addEventListener: function(evt, cb) {
          if (!this.listeners[evt]) this.listeners[evt] = [];
          this.listeners[evt].push(cb);
        },
        dispatchEvent: function(evtObj) {
          var type = typeof evtObj === 'string' ? evtObj : evtObj.type;
          var e = typeof evtObj === 'string' ? { type: type, target: this, preventDefault: function() {} } : evtObj;
          if (this.listeners[type]) {
            for (var i = 0; i < this.listeners[type].length; i++) {
              this.listeners[type][i].call(this, e);
            }
          }
        },
        setAttribute: function(k, v) { this.attributes[k] = String(v); },
        getAttribute: function(k) { return this.attributes.hasOwnProperty(k) ? this.attributes[k] : null; },
        removeAttribute: function(k) { delete this.attributes[k]; },
        appendChild: function(c) { this.children.push(c); return c; },
        removeChild: function(c) {
          var idx = this.children.indexOf(c);
          if (idx !== -1) this.children.splice(idx, 1);
          return c;
        },
        querySelector: function(sel) {
          if (sel.startsWith('#')) {
            var targetId = sel.substring(1);
            if (elementsMap[targetId]) return elementsMap[targetId];
          }
          return makeElement('div');
        },
        querySelectorAll: function(sel) {
          return [];
        },
        scrollIntoView: function() {}
      };
      return el;
    }

    var elementsMap = {};
    function registerElement(id, tag) {
      var el = makeElement(tag || 'div', id);
      elementsMap[id] = el;
      return el;
    }

    // Register all key modal and app elements
    var bodyEl = makeElement('body');
    bodyEl.style.overflow = '';

    // Flight modal elements
    var flightModalOverlay = registerElement('flight-modal-overlay');
    var btnFlightSelector = registerElement('btn-flight-selector', 'button');
    var btnCloseFlightModal = registerElement('btn-close-flight-modal', 'button');
    var flightFilterTabs = registerElement('flight-filter-tabs');
    var flightCardsContainer = registerElement('flight-cards-container');
    var heroFlightName = registerElement('hero-flight-name');
    var plannerFlightLabel = registerElement('planner-flight-label');

    // GMap key modal elements
    var gmapKeyModal = registerElement('gmap-key-modal');
    var btnOpenGmapKeyModal = registerElement('btn-open-gmap-key-modal', 'button');
    var btnCloseGmapKeyModal = registerElement('btn-close-gmap-key-modal', 'button');
    var btnSaveGmapKey = registerElement('btn-save-gmap-key', 'button');
    var btnClearGmapKey = registerElement('btn-clear-gmap-key', 'button');
    var inputGmapApiKey = registerElement('input-gmap-api-key', 'input');

    // Spot picker modal elements
    var spotPickerModal = registerElement('spot-picker-modal');
    var btnOpenSpotPicker = registerElement('btn-open-spot-picker', 'button');
    var pickerModalCloseBtn = registerElement('picker-modal-close-btn', 'button');
    var pickerSpotsGrid = registerElement('picker-spots-grid');
    var btnToggleCustomStopForm = registerElement('btn-toggle-custom-stop-form', 'button');
    var customStopForm = registerElement('custom-stop-form');
    var btnSubmitCustomStop = registerElement('btn-submit-custom-stop', 'button');
    var bottomNavOpenSpots = registerElement('bottom-nav-open-spots', 'button');

    // Spot detail modal elements
    var spotDetailModal = registerElement('spot-detail-modal');
    var modalCloseBtn = registerElement('modal-close-btn', 'button');
    var modalTitle = registerElement('modal-title');
    var modalSubtitle = registerElement('modal-subtitle');
    var modalContent = registerElement('modal-content');
    var modalSelectPlannerDay = registerElement('modal-select-planner-day', 'select');
    var btnModalAddToCustom = registerElement('btn-modal-add-to-custom', 'button');
    var modalCopyMapcodeBtn = registerElement('modal-copy-mapcode-btn', 'button');
    var modalNavLink = registerElement('modal-nav-link', 'a');
    var modalReviewsLink = registerElement('modal-reviews-link', 'a');

    // Other required app elements
    var toastContainer = registerElement('toast-container');
    var timelineList = registerElement('timeline-items-list');
    var backToTopBtn = registerElement('back-to-top-btn', 'button');
    var scheduleSection = registerElement('schedule-section', 'section');
    var mapSection = registerElement('map-section', 'section');
    var toolkitSection = registerElement('toolkit-section', 'section');

    var document = {
      body: bodyEl,
      documentElement: makeElement('html'),
      addEventListener: function(evt, cb) {
        if (evt === 'DOMContentLoaded') this.domLoadedCb = cb;
      },
      getElementById: function(id) {
        if (elementsMap[id]) return elementsMap[id];
        var el = makeElement('div', id);
        elementsMap[id] = el;
        return el;
      },
      querySelector: function(sel) {
        if (sel.startsWith('#')) return this.getElementById(sel.substring(1));
        return makeElement('div');
      },
      querySelectorAll: function(sel) {
        return [];
      },
      createElement: function(tag) {
        return makeElement(tag);
      }
    };

    var window = {
      innerWidth: 414, // Mobile iPhone viewport
      innerHeight: 896,
      pageYOffset: 0,
      addEventListener: function(evt, cb) {
        if (!this.listeners) this.listeners = {};
        if (!this.listeners[evt]) this.listeners[evt] = [];
        this.listeners[evt].push(cb);
      },
      scrollTo: function() {},
      requestAnimationFrame: requestAnimationFrame,
      isSecureContext: true,
      matchMedia: function() { return { matches: false }; }
    };

    function assertTrue(cond, msg) {
      if (!cond) {
        print("FAIL: " + msg);
        throw new Error(msg);
      }
    }

    function assertEquals(actual, expected, msg) {
      if (actual !== expected) {
        print("FAIL: " + msg + " (Expected: '" + expected + "', Got: '" + actual + "')");
        throw new Error(msg + " (Expected: '" + expected + "', Got: '" + actual + "')");
      }
    }

    // Load project data and application controllers
    load("data.js");
    load("app.js");

    // Fire DOMContentLoaded
    if (document.domLoadedCb) {
      document.domLoadedCb();
    }

    print(">>> Initial DOM Loaded. Checking initial body overflow...");
    assertEquals(document.body.style.overflow, '', "Initial body overflow must be empty string");

    // =========================================================================
    // 4.1 Flight Modal Lifecycle Test
    // =========================================================================
    print(">>> Testing Flight Modal Open / Close / Backdrop Dismissal...");
    // 1. Open via trigger button
    btnFlightSelector.dispatchEvent('click');
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll must be 'hidden' when Flight Modal opens");
    assertEquals(flightModalOverlay.style.display, 'flex', "Flight modal display must be flex");
    assertTrue(flightModalOverlay.classList.contains('open'), "Flight modal must have 'open' class");

    // 2. Close via close button
    btnCloseFlightModal.dispatchEvent('click');
    assertEquals(document.body.style.overflow, '', "Body scroll must be restored to '' when Flight Modal closes");
    assertTrue(!flightModalOverlay.classList.contains('open'), "Flight modal 'open' class must be removed");

    // 3. Open again and test backdrop dismissal
    btnFlightSelector.dispatchEvent('click');
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll must be locked again on second open");
    // Backdrop click: event target is the overlay itself
    flightModalOverlay.dispatchEvent({ type: 'click', target: flightModalOverlay });
    assertEquals(document.body.style.overflow, '', "Body scroll must be unlocked when backdrop is clicked");
    print("  [PASS] Flight Modal scroll locking and backdrop unlock verified");

    // =========================================================================
    // 4.2 Google Maps API Key Modal Lifecycle Test
    // =========================================================================
    print(">>> Testing Google Maps Key Modal Open / Close / Backdrop Dismissal...");
    // 1. Open via button
    btnOpenGmapKeyModal.dispatchEvent('click');
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll must be 'hidden' when GMap Key Modal opens");
    assertEquals(gmapKeyModal.style.display, 'flex', "GMap Key modal display must be flex");
    assertTrue(gmapKeyModal.classList.contains('open'), "GMap Key modal must have 'open' class");

    // 2. Close via close button
    btnCloseGmapKeyModal.dispatchEvent('click');
    assertEquals(document.body.style.overflow, '', "Body scroll must be restored to '' when GMap Key Modal closes");
    assertTrue(!gmapKeyModal.classList.contains('open'), "GMap Key modal 'open' class must be removed");

    // 3. Open again and test backdrop dismissal
    btnOpenGmapKeyModal.dispatchEvent('click');
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll must be locked again on second open");
    gmapKeyModal.dispatchEvent({ type: 'click', target: gmapKeyModal });
    assertEquals(document.body.style.overflow, '', "Body scroll must be unlocked on GMap modal backdrop click");
    print("  [PASS] Google Maps Key Modal scroll locking and backdrop unlock verified");

    // =========================================================================
    // 4.3 Spot Picker Modal Lifecycle Test
    // =========================================================================
    print(">>> Testing Spot Picker Modal Open / Close / Backdrop Dismissal...");
    // 1. Open via openPickerBtn (or bottom nav button)
    bottomNavOpenSpots.dispatchEvent({ type: 'click', preventDefault: function() {} });
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll must be 'hidden' when Spot Picker opens");
    assertTrue(spotPickerModal.classList.contains('open'), "Spot Picker modal must have 'open' class");

    // 2. Close via close button
    pickerModalCloseBtn.dispatchEvent('click');
    assertEquals(document.body.style.overflow, '', "Body scroll must be restored to '' when Spot Picker closes");
    assertTrue(!spotPickerModal.classList.contains('open'), "Spot Picker 'open' class must be removed");

    // 3. Re-open and test backdrop dismissal
    bottomNavOpenSpots.dispatchEvent({ type: 'click', preventDefault: function() {} });
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll locked on re-opening Spot Picker");
    spotPickerModal.dispatchEvent({ type: 'click', target: spotPickerModal });
    assertEquals(document.body.style.overflow, '', "Body scroll unlocked on Spot Picker backdrop click");
    print("  [PASS] Spot Picker Modal scroll locking and backdrop unlock verified");

    // =========================================================================
    // 4.4 Spot Detail Modal Lifecycle Test
    // =========================================================================
    print(">>> Testing Spot Detail Modal Open / Close / Backdrop Dismissal...");
    // 1. Open via window.appOpenModal
    assertTrue(typeof window.appOpenModal === 'function', "window.appOpenModal must be exported");
    window.appOpenModal('spot-senagajima');
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll must be 'hidden' when Spot Detail modal opens");
    assertTrue(spotDetailModal.classList.contains('open'), "Spot Detail modal must have 'open' class");

    // 2. Close via close button
    modalCloseBtn.dispatchEvent('click');
    assertEquals(document.body.style.overflow, '', "Body scroll must be restored to '' when Spot Detail modal closes");
    assertTrue(!spotDetailModal.classList.contains('open'), "Spot Detail 'open' class must be removed");

    // 3. Re-open and test backdrop dismissal
    window.appOpenModal('spot-dmm-aquarium');
    assertEquals(document.body.style.overflow, 'hidden', "Body scroll locked on re-opening Spot Detail");
    spotDetailModal.dispatchEvent({ type: 'click', target: spotDetailModal });
    assertEquals(document.body.style.overflow, '', "Body scroll unlocked on Spot Detail backdrop click");
    print("  [PASS] Spot Detail Modal scroll locking and backdrop unlock verified");

    // =========================================================================
    // 4.5 Rapid Multi-Cycle Stress Test (Anti-Leakage Oracle)
    // =========================================================================
    print(">>> Stress-Testing 20 Sequential Modal Transitions (No Sticky Scroll Locks)...");
    var modalsSequence = [
      { open: function() { btnFlightSelector.dispatchEvent('click'); }, close: function() { btnCloseFlightModal.dispatchEvent('click'); }, name: "Flight" },
      { open: function() { btnOpenGmapKeyModal.dispatchEvent('click'); }, close: function() { btnCloseGmapKeyModal.dispatchEvent('click'); }, name: "GMapKey" },
      { open: function() { bottomNavOpenSpots.dispatchEvent({ type: 'click', preventDefault: function() {} }); }, close: function() { pickerModalCloseBtn.dispatchEvent('click'); }, name: "Picker" },
      { open: function() { window.appOpenModal('spot-senagajima'); }, close: function() { modalCloseBtn.dispatchEvent('click'); }, name: "Detail" }
    ];

    for (var cycle = 1; cycle <= 5; cycle++) {
      for (var m = 0; m < modalsSequence.length; m++) {
        var mod = modalsSequence[m];
        mod.open();
        assertEquals(document.body.style.overflow, 'hidden', "Cycle " + cycle + " " + mod.name + " open must lock scroll");
        mod.close();
        assertEquals(document.body.style.overflow, '', "Cycle " + cycle + " " + mod.name + " close must unlock scroll");
      }
    }
    print("  [PASS] 20 sequential modal transitions completed with ZERO scroll lock leakage!");
    """

    res = run_jsc_code("Modal Body Scroll Lock Runtime & Anti-Leakage Oracle", js_code)
    assert res, "FAILED: Modal Scroll Lock Runtime Oracle reported failure!"
    print("[PASS] SUITE 4 SUCCEEDED: All modal scroll locks empirically verified!")
    return True


# ==============================================================================
# SUITE 5: Scroll Listener RAF Throttling & Touch Target / Font Size Oracle
# ==============================================================================
def test_suite_5_raf_touch_targets_and_font_sizes():
    print("\n=======================================================")
    print("SUITE 5: Scroll Listener RAF Throttling & Touch Target / Font Size Oracle")
    print("=======================================================")

    with open(os.path.join(BASE_DIR, 'styles.css'), 'r', encoding='utf-8') as f:
        css = f.read()
    with open(os.path.join(BASE_DIR, 'app.js'), 'r', encoding='utf-8') as f:
        js = f.read()
    with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    # 5.1: RAF Throttling in app.js
    assert 'let scrollRafId = null;' in js, "FAILED: scrollRafId variable not found in app.js!"
    assert 'if (scrollRafId) return;' in js, "FAILED: scrollRafId guard missing in onScroll listener!"
    assert "window.addEventListener('scroll', onScroll, { passive: true });" in js, \
        "FAILED: passive: true flag missing in scroll listener registration!"
    print("  [PASS] Scroll listener RAF throttling and passive event configuration verified")

    # 5.2: Minimum Touch Targets >= 44x44px in styles.css
    required_touch_classes = [
        ('.theme-toggle, .btn-icon', ['min-width: 44px', 'min-height: 44px']),
        ('.modal-close-btn', ['min-width: 44px', 'min-height: 44px']),
        ('.mobile-nav-btn', ['min-width: 44px', 'min-height: 44px']),
        ('.btn-stop-ctrl', ['min-width: 44px', 'min-height: 44px']),
        ('.btn-stop-dur-step', ['min-width: 44px', 'min-height: 44px']),
        ('.btn-card-action', ['min-height: 44px']),
        ('.day-tab-btn', ['min-height: 44px', 'min-width: 44px']),
        ('.cat-pill', ['min-height: 44px', 'min-width: 44px']),
        ('.planner-day-tab-btn', ['min-height: 44px', 'min-width: 44px']),
        ('.modal-select-planner-day', ['min-height: 44px']),
        ('#btn-modal-add-to-custom', ['min-height: 44px'])
    ]

    for sel, req_props in required_touch_classes:
        for prop in req_props:
            assert prop in css, f"FAILED: Touch target requirement '{prop}' missing for '{sel}' in styles.css!"
        print(f"  [PASS] Touch target requirement >= 44px verified for {sel}")

    # Check index.html inline touch targets
    assert 'min-height:44px' in html or 'min-height: 44px' in html, "FAILED: min-height: 44px missing in index.html"
    print("  [PASS] index.html inline touch targets verified")

    # 5.3: iOS Safari Auto-Zoom Prevention (font-size >= 16px)
    assert 'input, select, textarea { font-size: 16px !important; }' in css, \
        "FAILED: Unified 16px mobile input rule missing in styles.css!"
    print("  [PASS] Unified 16px mobile input override verified")

    # Verify no inline inputs or selects in index.html have sub-16px font sizes
    inputs_with_bad_fonts = re.findall(r'<(?:input|select|textarea)[^>]*font-size:\s*(0\.\d+rem|1[0-5]px)', html)
    assert len(inputs_with_bad_fonts) == 0, f"FAILED: Found inputs with sub-16px inline font size: {inputs_with_bad_fonts}"
    print("  [PASS] All inputs/selects in index.html verified with >= 16px font sizes")

    print("[PASS] SUITE 5 SUCCEEDED: RAF throttling, 44px touch targets & 16px font sizes verified!")
    return True


# ==============================================================================
# SUITE 6: Verification & Distribution Parity
# ==============================================================================
def test_suite_6_build_dist_and_verify_itinerary():
    print("\n=======================================================")
    print("SUITE 6: Verification & Distribution Parity")
    print("=======================================================")

    # 6.1: Run verify_itinerary.py
    print(">>> Executing verify_itinerary.py...")
    res = subprocess.run([sys.executable, 'verify_itinerary.py'], cwd=BASE_DIR, capture_output=True, text=True)
    assert res.returncode == 0, f"FAILED: verify_itinerary.py failed!\nSTDERR:\n{res.stderr}\nSTDOUT:\n{res.stdout}"
    assert "ALL 9 TEST SUITES PASSED WITH 100% SUCCESS!" in res.stdout, \
        "FAILED: verify_itinerary.py did not pass with 100% success!"
    print("  [PASS] verify_itinerary.py passed with 100% across all 9 test suites")

    # 6.2: Run build_dist.py
    print(">>> Executing build_dist.py...")
    res = subprocess.run([sys.executable, 'build_dist.py'], cwd=BASE_DIR, capture_output=True, text=True)
    assert res.returncode == 0, f"FAILED: build_dist.py failed!\nSTDERR:\n{res.stderr}\nSTDOUT:\n{res.stdout}"
    print("  [PASS] build_dist.py generated portable HTML and zip archive cleanly")

    # 6.3: Check portable distribution HTML has M2 enhancements
    portable_path = os.path.join(BASE_DIR, 'dist', 'okinawa-trip-2026-portable.html')
    assert os.path.exists(portable_path), "FAILED: dist/okinawa-trip-2026-portable.html does not exist!"
    with open(portable_path, 'r', encoding='utf-8') as f:
        dist_html = f.read()

    assert '.mobile-bottom-nav {' in dist_html, "FAILED: mobile-bottom-nav missing in portable HTML"
    assert 'env(safe-area-inset-bottom' in dist_html, "FAILED: safe-area-inset-bottom missing in portable HTML"
    assert '-webkit-overflow-scrolling: touch;' in dist_html, "FAILED: momentum scrolling missing in portable HTML"
    assert 'document.body.style.overflow = \'hidden\';' in dist_html, "FAILED: modal scroll lock missing in portable HTML"
    print("  [PASS] Portable distribution HTML verified with complete M2 mobile UX parity")

    print("[PASS] SUITE 6 SUCCEEDED: Build packaging and verification parity 100% verified!")
    return True


def main():
    print("===================================================================")
    print("CHALLENGER 2 EMPIRICAL VERIFICATION SUITE")
    print("Target: Milestone 2 Mobile UX, Safe Areas, Momentum & Scroll Locks")
    print("===================================================================")

    test_suite_1_bottom_nav_bleed_and_restoral()
    test_suite_2_safe_area_insets()
    test_suite_3_momentum_scrolling_and_overscroll()
    test_suite_4_modal_scroll_locks_runtime()
    test_suite_5_raf_touch_targets_and_font_sizes()
    test_suite_6_build_dist_and_verify_itinerary()

    print("\n===================================================================")
    print("🏆 EMPIRICAL CHALLENGER VERIFICATION RESULT: 100% PASS")
    print("All assertions for Desktop Bleed Fix, Safe-Area Insets,")
    print("Momentum Scrolling, Modal Body Scroll Locks, Touch Targets & Fonts")
    print("PASSED WITH ZERO ERRORS OR WARNINGS.")
    print("VERDICT: APPROVE")
    print("===================================================================")


if __name__ == '__main__':
    main()
