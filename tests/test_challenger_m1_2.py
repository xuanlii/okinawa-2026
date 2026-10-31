#!/usr/bin/env python3
"""
Independent Empirical Verification Script by Challenger 2 (teamwork_challenger_m1_2)
Project: 2026/12 沖繩 5天4夜自駕行程網站更新

This test runner independently verifies:
1. renderTimeline() produces .card-alt-group with option cards for Day 3 lunch (d3-6 and d3-7) and Day 4 dinner (d4-7 and d4-8)
2. Anchor IDs item-d3-6, item-d3-7, item-d4-7, item-d4-8 are present in the DOM
3. No internal transit connector exists between paired alternatives
4. Transit calculation from d3-5 to lunch alternatives and lunch alternatives to d3-8 is accurate and non-zero
5. Transit calculation from d4-6 to dinner alternatives and dinner alternatives to d4-9 is accurate and non-zero
6. Interactive pill toggling, appScrollToCard visibility auto-switching, and search fallback edge cases
"""

import os
import sys
import math
import json
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JSC_BIN = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"

def log_section(title):
    print("\n" + "=" * 70)
    print(f" {title}")
    print("=" * 70)

def assert_true(cond, msg):
    if not cond:
        print(f"❌ FAIL: {msg}")
        raise AssertionError(msg)
    print(f"✅ PASS: {msg}")

# Independent Python implementation of geodesic distance & transit engine
def py_haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         (math.sin(dlon / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def py_calculate_transit(from_lat, from_lng, to_lat, to_lng, from_name="", to_name=""):
    straight_dist = py_haversine_km(from_lat, from_lng, to_lat, to_lng)
    if straight_dist < 0.08 or (from_name and from_name == to_name):
        return {
            "distanceKm": 0,
            "durationMins": 0,
            "isWalk": True
        }
    road_dist = straight_dist * 1.28
    if road_dist < 0.8:
        meters = max(50, round(road_dist * 1000))
        mins = max(1, round(meters / 75.0))
        return {
            "distanceKm": round(road_dist, 2),
            "durationMins": mins,
            "isWalk": True
        }
    in_naha = ((26.18 <= from_lat <= 26.25 and 127.65 <= from_lng <= 127.72) or
               (26.18 <= to_lat <= 26.25 and 127.65 <= to_lng <= 127.72))
    avg_speed = 26.0 if in_naha else 38.0
    est_mins = max(4, round(3.0 + (road_dist / avg_speed) * 60.0))
    return {
        "distanceKm": round(road_dist, 1),
        "durationMins": est_mins,
        "isWalk": False
    }

def run_jsc_script(js_code):
    env_wrapper = f"""
    var setTimeout = function(cb) {{ return 1; }};
    var clearTimeout = function() {{}};
    var setInterval = function(cb) {{ return 1; }};
    var clearInterval = function() {{}};
    var console = {{ log: print, warn: print, error: print }};

    function DOMElement(tagName) {{
      this.tagName = tagName ? tagName.toUpperCase() : "DIV";
      this.children = [];
      this.style = {{}};
      this.dataset = {{}};
      this.attributes = {{}};
      this._classList = [];
      this.listeners = {{}};
      this._innerHTML = "";
      this.parentNode = null;
    }}

    Object.defineProperty(DOMElement.prototype, "innerHTML", {{
      get: function() {{ return this._innerHTML; }},
      set: function(val) {{
        this._innerHTML = String(val);
        this.children = [];
        var tagRegex = /<!--[\\s\\S]*?-->|<(\\/)?([a-zA-Z0-9\\-]+)([^>]*)>/g;
        var stack = [this];
        var voidTags = {{ IMG: true, INPUT: true, BR: true, HR: true, META: true, LINK: true }};
        var match;
        while ((match = tagRegex.exec(val)) !== null) {{
          if (match[0].startsWith("<!--")) continue;
          var isClosing = Boolean(match[1]);
          var tagName = match[2].toUpperCase();
          var rawAttrs = match[3];

          if (isClosing) {{
            if (stack.length > 1 && stack[stack.length - 1].tagName === tagName) {{
              stack.pop();
            }}
          }} else {{
            var currentParent = stack[stack.length - 1];
            var el = new DOMElement(tagName);
            el.parentNode = currentParent;
            currentParent.children.push(el);

            var attrRegex = /([a-zA-Z0-9\\-_]+)(?:=["\\x27]([^"\\x27]*)["\\x27])?/g;
            var aMatch;
            while ((aMatch = attrRegex.exec(rawAttrs)) !== null) {{
              var k = aMatch[1];
              var v = aMatch[2] !== undefined ? aMatch[2] : "";
              el.setAttribute(k, v);
              if (k === "class") {{
                v.split(/\\s+/).forEach(function(cls) {{ if (cls) el.classList.add(cls); }});
              }} else if (k === "id") {{
                el.id = v;
                if (document && document._elementsById) {{
                  document._elementsById[v] = el;
                }}
              }} else if (k.startsWith("data-")) {{
                var dk = k.substring(5).replace(/-([a-z])/g, function(g) {{ return g[1].toUpperCase(); }});
                el.dataset[dk] = v;
              }}
            }}

            var isSelfClosing = rawAttrs.trim().endsWith("/") || voidTags[tagName];
            if (!isSelfClosing) {{
              stack.push(el);
            }}
          }}
        }}
      }}
    }});

    DOMElement.prototype.addEventListener = function(event, cb) {{
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(cb);
    }};

    DOMElement.prototype.trigger = function(event, evtObj) {{
      var list = this.listeners[event] || [];
      var ev = evtObj || {{ stopPropagation: function() {{}}, target: this }};
      if (!ev.target) ev.target = this;
      for (var i = 0; i < list.length; i++) {{
        list[i](ev);
      }}
    }};

    DOMElement.prototype.focus = function() {{}};
    DOMElement.prototype.blur = function() {{}};
    DOMElement.prototype.setAttribute = function(k, v) {{ this.attributes[k] = String(v); }};
    DOMElement.prototype.getAttribute = function(k) {{ return this.attributes[k] || null; }};

    DOMElement.prototype.appendChild = function(c) {{
      this.children.push(c);
      c.parentNode = this;
      return c;
    }};

    DOMElement.prototype.removeChild = function(c) {{
      this.children = this.children.filter(function(x) {{ return x !== c; }});
      c.parentNode = null;
      return c;
    }};

    DOMElement.prototype.__defineGetter__("classList", function() {{
      var self = this;
      return {{
        add: function(c) {{ if (self._classList.indexOf(c) === -1) self._classList.push(c); }},
        remove: function(c) {{ self._classList = self._classList.filter(function(x) {{ return x !== c; }}); }},
        contains: function(c) {{ return self._classList.indexOf(c) !== -1; }},
        toggle: function(c) {{
          if (this.contains(c)) {{ this.remove(c); return false; }}
          else {{ this.add(c); return true; }}
        }}
      }};
    }});

    DOMElement.prototype.closest = function(sel) {{
      var curr = this;
      while (curr) {{
        if (curr._matchesSelector(sel)) return curr;
        curr = curr.parentNode;
      }}
      return null;
    }};

    DOMElement.prototype._matchesSelector = function(sel) {{
      if (sel.startsWith(".")) {{
        return this.classList.contains(sel.substring(1));
      }}
      if (sel.startsWith("#")) {{
        return this.id === sel.substring(1);
      }}
      if (sel.startsWith("[") && sel.endsWith("]")) {{
        var inner = sel.substring(1, sel.length - 1);
        var parts = inner.split("=");
        var k = parts[0];
        var v = parts[1] ? parts[1].replace(/[\\x27"]/g, "") : null;
        if (k.startsWith("data-")) {{
          var dk = k.substring(5).replace(/-([a-z])/g, function(g) {{ return g[1].toUpperCase(); }});
          if (v !== null) return this.dataset[dk] === v;
          return this.dataset[dk] !== undefined;
        }}
        if (v !== null) return this.getAttribute(k) === v;
        return this.getAttribute(k) !== null;
      }}
      return false;
    }};

    DOMElement.prototype.querySelector = function(sel) {{
      return this._find(sel, true);
    }};

    DOMElement.prototype.querySelectorAll = function(sel) {{
      return this._find(sel, false);
    }};

    DOMElement.prototype._find = function(sel, single) {{
      var res = [];
      function search(node) {{
        for (var i = 0; i < node.children.length; i++) {{
          var c = node.children[i];
          if (c._matchesSelector(sel)) {{
            res.push(c);
            if (single) return;
          }}
          search(c);
          if (single && res.length > 0) return;
        }}
      }}
      search(this);
      return single ? (res[0] || null) : res;
    }};

    var document = {{
      _elementsById: {{}},
      documentElement: new DOMElement("HTML"),
      body: new DOMElement("BODY"),
      head: new DOMElement("HEAD"),
      createElement: function(tag) {{ return new DOMElement(tag); }},
      getElementById: function(id) {{
        if (this._elementsById[id]) return this._elementsById[id];
        var el = new DOMElement("DIV");
        el.id = id;
        this._elementsById[id] = el;
        return el;
      }},
      querySelector: function(sel) {{ return this.body.querySelector(sel); }},
      querySelectorAll: function(sel) {{ return this.body.querySelectorAll(sel); }},
      addEventListener: function(event, cb) {{
        if (event === "DOMContentLoaded") this.domLoadedCb = cb;
      }}
    }};

    var window = {{
      innerWidth: 1200,
      addEventListener: function() {{}},
      scrollTo: function() {{}},
      isSecureContext: true
    }};
    var localStorage = {{
      _data: {{}},
      getItem: function(k) {{ return this._data[k] !== undefined ? this._data[k] : null; }},
      setItem: function(k, v) {{ this._data[k] = String(v); }},
      removeItem: function(k) {{ delete this._data[k]; }}
    }};
    var navigator = {{}};
    var L = {{
      map: function() {{ return {{ setView: function() {{}}, on: function() {{}}, invalidateSize: function() {{}}, fitBounds: function() {{}}, removeLayer: function() {{}} }}; }},
      tileLayer: function() {{ return {{ addTo: function() {{}} }}; }},
      marker: function() {{ return {{ addTo: function() {{ return {{ bindPopup: function() {{ return {{ on: function() {{}} }}; }} }}; }} }}; }},
      polyline: function() {{ return {{ addTo: function() {{}} }}; }},
      latLngBounds: function() {{ return {{ isValid: function() {{ return false; }} }}; }},
      divIcon: function() {{}},
      featureGroup: function() {{ return {{ getBounds: function() {{ return {{ pad: function() {{ return {{}}; }} }}; }} }}; }}
    }};

    load("data.js");
    load("app.js");
    if (document.domLoadedCb) document.domLoadedCb();

    {js_code}
    """
    res = subprocess.run([JSC_BIN, "-e", env_wrapper], cwd=BASE_DIR, capture_output=True, text=True)
    if res.returncode != 0:
        print("JSC ERROR STDERR:\n" + res.stderr)
        print("JSC ERROR STDOUT:\n" + res.stdout)
        raise RuntimeError(f"JSC execution failed with returncode {res.returncode}")
    return res.stdout.strip()


def run_all_tests():
    log_section("TEST SUITE 1: DATA MODEL & ALTERNATIVE METADATA INVARIANTS")
    js_test1 = """
    var d3_6 = SCHEDULE_ITEMS.find(function(it) { return it.id === "d3-6"; });
    var d3_7 = SCHEDULE_ITEMS.find(function(it) { return it.id === "d3-7"; });
    var d4_7 = SCHEDULE_ITEMS.find(function(it) { return it.id === "d4-7"; });
    var d4_8 = SCHEDULE_ITEMS.find(function(it) { return it.id === "d4-8"; });

    var report = {
      totalItems: SCHEDULE_ITEMS.length,
      d3_6: {
        id: d3_6.id,
        alternativeGroupId: d3_6.alternativeGroupId,
        alternativeRole: d3_6.alternativeRole,
        alternativeBadge: d3_6.alternativeBadge,
        hasSenior: Boolean(d3_6.generation && d3_6.generation.senior),
        hasYoung: Boolean(d3_6.generation && d3_6.generation.young),
        hasHarmony: Boolean(d3_6.generation && d3_6.generation.harmony)
      },
      d3_7: {
        id: d3_7.id,
        alternativeGroupId: d3_7.alternativeGroupId,
        alternativeRole: d3_7.alternativeRole,
        alternativeBadge: d3_7.alternativeBadge,
        hasSenior: Boolean(d3_7.generation && d3_7.generation.senior),
        hasYoung: Boolean(d3_7.generation && d3_7.generation.young),
        hasHarmony: Boolean(d3_7.generation && d3_7.generation.harmony)
      },
      d4_7: {
        id: d4_7.id,
        alternativeGroupId: d4_7.alternativeGroupId,
        alternativeRole: d4_7.alternativeRole,
        alternativeBadge: d4_7.alternativeBadge,
        hasSenior: Boolean(d4_7.generation && d4_7.generation.senior),
        hasYoung: Boolean(d4_7.generation && d4_7.generation.young),
        hasHarmony: Boolean(d4_7.generation && d4_7.generation.harmony)
      },
      d4_8: {
        id: d4_8.id,
        alternativeGroupId: d4_8.alternativeGroupId,
        alternativeRole: d4_8.alternativeRole,
        alternativeBadge: d4_8.alternativeBadge,
        hasSenior: Boolean(d4_8.generation && d4_8.generation.senior),
        hasYoung: Boolean(d4_8.generation && d4_8.generation.young),
        hasHarmony: Boolean(d4_8.generation && d4_8.generation.harmony)
      }
    };
    print(JSON.stringify(report));
    """
    out1 = json.loads(run_jsc_script(js_test1))
    assert_true(out1["totalItems"] == 40, f"SCHEDULE_ITEMS has exactly 40 items (got {out1['totalItems']})")
    assert_true(out1["d3_6"]["alternativeGroupId"] == "d3-lunch-choice", "d3-6 has alternativeGroupId 'd3-lunch-choice'")
    assert_true(out1["d3_6"]["alternativeRole"] == "planA", "d3-6 role is planA")
    assert_true(out1["d3_7"]["alternativeGroupId"] == "d3-lunch-choice", "d3-7 has alternativeGroupId 'd3-lunch-choice'")
    assert_true(out1["d3_7"]["alternativeRole"] == "planB", "d3-7 role is planB")
    assert_true(out1["d4_7"]["alternativeGroupId"] == "d4-dinner-choice", "d4-7 has alternativeGroupId 'd4-dinner-choice'")
    assert_true(out1["d4_7"]["alternativeRole"] == "planA", "d4-7 role is planA")
    assert_true(out1["d4_8"]["alternativeGroupId"] == "d4-dinner-choice", "d4-8 has alternativeGroupId 'd4-dinner-choice'")
    assert_true(out1["d4_8"]["alternativeRole"] == "planB", "d4-8 role is planB")

    for k in ["d3_6", "d3_7", "d4_7", "d4_8"]:
        assert_true(out1[k]["hasSenior"] and out1[k]["hasYoung"] and out1[k]["hasHarmony"],
                    f"{k} has senior, young, and harmony dual-generation metadata")


    log_section("TEST SUITE 2: MATHEMATICAL ACCURACY OF TRANSIT CALCULATIONS")
    js_test2 = """
    var calcTransit = window.__okinawaApp__.calculateTransit;
    var d3_5 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d3-5"; });
    var d3_6 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d3-6"; });
    var d3_7 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d3-7"; });
    var d3_8 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d3-8"; });

    var d4_6 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d4-6"; });
    var d4_7 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d4-7"; });
    var d4_8 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d4-8"; });
    var d4_9 = SCHEDULE_ITEMS.find(function(s) { return s.id === "d4-9"; });

    var results = {
      d3_5_to_d3_6: { js: calcTransit(d3_5, d3_6), from: [d3_5.lat, d3_5.lng], to: [d3_6.lat, d3_6.lng] },
      d3_5_to_d3_7: { js: calcTransit(d3_5, d3_7), from: [d3_5.lat, d3_5.lng], to: [d3_7.lat, d3_7.lng] },
      d3_6_to_d3_7: { js: calcTransit(d3_6, d3_7), from: [d3_6.lat, d3_6.lng], to: [d3_7.lat, d3_7.lng] },
      d3_6_to_d3_8: { js: calcTransit(d3_6, d3_8), from: [d3_6.lat, d3_6.lng], to: [d3_8.lat, d3_8.lng] },
      d3_7_to_d3_8: { js: calcTransit(d3_7, d3_8), from: [d3_7.lat, d3_7.lng], to: [d3_8.lat, d3_8.lng] },
      d4_6_to_d4_7: { js: calcTransit(d4_6, d4_7), from: [d4_6.lat, d4_6.lng], to: [d4_7.lat, d4_7.lng] },
      d4_6_to_d4_8: { js: calcTransit(d4_6, d4_8), from: [d4_6.lat, d4_6.lng], to: [d4_8.lat, d4_8.lng] },
      d4_7_to_d4_8: { js: calcTransit(d4_7, d4_8), from: [d4_7.lat, d4_7.lng], to: [d4_8.lat, d4_8.lng] },
      d4_7_to_d4_9: { js: calcTransit(d4_7, d4_9), from: [d4_7.lat, d4_7.lng], to: [d4_9.lat, d4_9.lng] },
      d4_8_to_d4_9: { js: calcTransit(d4_8, d4_9), from: [d4_8.lat, d4_8.lng], to: [d4_9.lat, d4_9.lng] }
    };
    print(JSON.stringify(results));
    """
    out2 = json.loads(run_jsc_script(js_test2))

    for key, data in out2.items():
        js_val = data["js"]
        py_val = py_calculate_transit(data["from"][0], data["from"][1], data["to"][0], data["to"][1])
        
        # Verify non-zero
        assert_true(js_val["distanceKm"] > 0, f"{key}: JS distance is non-zero ({js_val['distanceKm']} km)")
        assert_true(js_val["durationMins"] > 0, f"{key}: JS duration is non-zero ({js_val['durationMins']} mins)")
        
        # Compare JS engine output with independent Python geodesic calculation
        dist_diff = abs(js_val["distanceKm"] - py_val["distanceKm"])
        assert_true(dist_diff <= 0.05, f"{key}: JS distance {js_val['distanceKm']} matches Py {py_val['distanceKm']} (diff={dist_diff:.3f} km)")
        assert_true(js_val["durationMins"] == py_val["durationMins"],
                    f"{key}: JS duration {js_val['durationMins']}m exactly matches Py {py_val['durationMins']}m")
        assert_true(js_val["isWalk"] == py_val["isWalk"],
                    f"{key}: JS walk mode {js_val['isWalk']} matches Py {py_val['isWalk']}")

    log_section("TEST SUITE 3: DOM RENDERING & .card-alt-group STRUCTURE")
    js_test3 = """
    // Initial load rendered Day 0
    var listEl = document.getElementById("timeline-items-list");
    var htmlAll = listEl.innerHTML;

    // Day tabs
    var dayTabsContainer = document.getElementById("day-tabs-container");
    var dayTabs = dayTabsContainer.querySelectorAll(".day-tab-btn");
    var tab3 = dayTabs.find(function(b) { return b.dataset.day === "3"; });
    var tab4 = dayTabs.find(function(b) { return b.dataset.day === "4"; });

    // Click Day 3 tab
    tab3.trigger("click");
    var htmlDay3 = listEl.innerHTML;

    // Click Day 4 tab
    tab4.trigger("click");
    var htmlDay4 = listEl.innerHTML;

    function countOccurrences(str, sub) {
      var count = 0, pos = 0;
      while ((pos = str.indexOf(sub, pos)) !== -1) {
        count++;
        pos += sub.length;
      }
      return count;
    }

    var report = {
      htmlAll_cardAltGroupCount: countOccurrences(htmlAll, 'class="card-alt-group"'),
      htmlAll_hasD3LunchGroup: htmlAll.includes('data-alt-group="d3-lunch"'),
      htmlAll_hasD4DinnerGroup: htmlAll.includes('data-alt-group="d4-dinner"'),
      htmlAll_hasItemD3_6: htmlAll.includes('id="item-d3-6"'),
      htmlAll_hasItemD3_7: htmlAll.includes('id="item-d3-7"'),
      htmlAll_hasItemD4_7: htmlAll.includes('id="item-d4-7"'),
      htmlAll_hasItemD4_8: htmlAll.includes('id="item-d4-8"'),

      htmlDay3_hasD3LunchGroup: htmlDay3.includes('data-alt-group="d3-lunch"'),
      htmlDay3_hasD4DinnerGroup: htmlDay3.includes('data-alt-group="d4-dinner"'),
      htmlDay3_hasItemD3_6: htmlDay3.includes('id="item-d3-6"'),
      htmlDay3_hasItemD3_7: htmlDay3.includes('id="item-d3-7"'),

      htmlDay4_hasD3LunchGroup: htmlDay4.includes('data-alt-group="d3-lunch"'),
      htmlDay4_hasD4DinnerGroup: htmlDay4.includes('data-alt-group="d4-dinner"'),
      htmlDay4_hasItemD4_7: htmlDay4.includes('id="item-d4-7"'),
      htmlDay4_hasItemD4_8: htmlDay4.includes('id="item-d4-8"')
    };
    print(JSON.stringify(report));
    """
    out3 = json.loads(run_jsc_script(js_test3))

    assert_true(out3["htmlAll_cardAltGroupCount"] == 2, f"Total .card-alt-group rendered in Day 0 is 2 (got {out3['htmlAll_cardAltGroupCount']})")
    assert_true(out3["htmlAll_hasD3LunchGroup"], "Day 0 renders data-alt-group='d3-lunch'")
    assert_true(out3["htmlAll_hasD4DinnerGroup"], "Day 0 renders data-alt-group='d4-dinner'")
    assert_true(out3["htmlAll_hasItemD3_6"], "Anchor id='item-d3-6' present in DOM")
    assert_true(out3["htmlAll_hasItemD3_7"], "Anchor id='item-d3-7' present in DOM")
    assert_true(out3["htmlAll_hasItemD4_7"], "Anchor id='item-d4-7' present in DOM")
    assert_true(out3["htmlAll_hasItemD4_8"], "Anchor id='item-d4-8' present in DOM")

    assert_true(out3["htmlDay3_hasD3LunchGroup"], "Day 3 view renders data-alt-group='d3-lunch'")
    assert_true(not out3["htmlDay3_hasD4DinnerGroup"], "Day 3 view correctly excludes Day 4 dinner group")
    assert_true(out3["htmlDay3_hasItemD3_6"] and out3["htmlDay3_hasItemD3_7"], "Day 3 view contains both item-d3-6 and item-d3-7")

    assert_true(out3["htmlDay4_hasD4DinnerGroup"], "Day 4 view renders data-alt-group='d4-dinner'")
    assert_true(not out3["htmlDay4_hasD3LunchGroup"], "Day 4 view correctly excludes Day 3 lunch group")
    assert_true(out3["htmlDay4_hasItemD4_7"] and out3["htmlDay4_hasItemD4_8"], "Day 4 view contains both item-d4-7 and item-d4-8")


    log_section("TEST SUITE 4: TRANSIT CONNECTORS EMPIRICAL CHECK (ABSENCE OF INTERNAL & PRESENCE OF OUTBOUND)")
    js_test4 = """
    // Day 0 view
    var dayTabsContainer = document.getElementById("day-tabs-container");
    var dayTabs = dayTabsContainer.querySelectorAll(".day-tab-btn");
    var tab0 = dayTabs.find(function(b) { return b.dataset.day === "0"; });
    if (tab0) tab0.trigger("click");

    var listEl = document.getElementById("timeline-items-list");
    var html = listEl.innerHTML;

    // Isolate Day 3 lunch group block
    var d3Start = html.indexOf('id="alt-group-d3-lunch-choice"');
    var d3End = html.indexOf('id="item-d3-8"');
    var d3AltGroupHtml = html.substring(d3Start, d3End);

    // Isolate Day 4 dinner group block
    var d4Start = html.indexOf('id="alt-group-d4-dinner-choice"');
    var d4End = html.indexOf('id="item-d4-9"');
    var d4AltGroupHtml = html.substring(d4Start, d4End);

    // Check preceding stop connectors
    // d3-5 connector
    var d3_5_start = html.indexOf('id="item-d3-5"');
    var d3_5_html = html.substring(d3_5_start, d3Start);

    // d4-6 connector
    var d4_6_start = html.indexOf('id="item-d4-6"');
    var d4_6_html = html.substring(d4_6_start, d4Start);

    function countOccurrences(str, sub) {
      var count = 0, pos = 0;
      while ((pos = str.indexOf(sub, pos)) !== -1) {
        count++;
        pos += sub.length;
      }
      return count;
    }

    var report = {
      // Day 3
      d3_intraTransitCountInsideContainer: countOccurrences(
        d3AltGroupHtml.substring(d3AltGroupHtml.indexOf('class="alt-options-container"'), d3AltGroupHtml.indexOf('class="alt-group-footer"')),
        'class="transit-connector"'
      ),
      d3_hasAltVsDivider: d3AltGroupHtml.includes('class="alt-vs-divider"'),
      d3_hasOutboundConnector: d3AltGroupHtml.includes('class="transit-connector"'),
      d3_outboundTextContainsSportsDepo: d3AltGroupHtml.includes('Sports Depo 天久店') && d3AltGroupHtml.includes('用餐後前往下一站'),
      d3_d3_5_connectorContainsInaka: d3_5_html.includes('田舍 沖繩麵 (公設市場南店)') && d3_5_html.includes('前往下一站'),

      // Day 4
      d4_intraTransitCountInsideContainer: countOccurrences(
        d4AltGroupHtml.substring(d4AltGroupHtml.indexOf('class="alt-options-container"'), d4AltGroupHtml.indexOf('class="alt-group-footer"')),
        'class="transit-connector"'
      ),
      d4_hasAltVsDivider: d4AltGroupHtml.includes('class="alt-vs-divider"'),
      d4_hasOutboundConnector: d4AltGroupHtml.includes('class="transit-connector"'),
      d4_outboundTextContainsOceanTree: d4AltGroupHtml.includes('Ocean Tree') && d4AltGroupHtml.includes('用餐後前往下一站'),
      d4_d4_6_connectorContainsKatsunoya: d4_6_html.includes('かつ乃屋 那霸Main Place店') && d4_6_html.includes('前往下一站')
    };
    print(JSON.stringify(report));
    """
    out4 = json.loads(run_jsc_script(js_test4))

    # Day 3 Transit Verification
    assert_true(out4["d3_intraTransitCountInsideContainer"] == 0,
                "Day 3: ZERO transit connector between alternative options inside .alt-options-container")
    assert_true(out4["d3_hasAltVsDivider"], "Day 3: .alt-vs-divider present between Option A and Option B")
    assert_true(out4["d3_hasOutboundConnector"], "Day 3: Outbound transit connector exists at end of alt-group")
    assert_true(out4["d3_outboundTextContainsSportsDepo"], "Day 3: Outbound connector directs to 'Sports Depo 天久店'")
    assert_true(out4["d3_d3_5_connectorContainsInaka"], "Day 3: Preceding d3-5 connector directs to '田舍 沖繩麵 (公設市場南店)'")

    # Day 4 Transit Verification
    assert_true(out4["d4_intraTransitCountInsideContainer"] == 0,
                "Day 4: ZERO transit connector between alternative options inside .alt-options-container")
    assert_true(out4["d4_hasAltVsDivider"], "Day 4: .alt-vs-divider present between Option A and Option B")
    assert_true(out4["d4_hasOutboundConnector"], "Day 4: Outbound transit connector exists at end of alt-group")
    assert_true(out4["d4_outboundTextContainsOceanTree"], "Day 4: Outbound connector directs to 'Ocean Tree'")
    assert_true(out4["d4_d4_6_connectorContainsKatsunoya"], "Day 4: Preceding d4-6 connector directs to 'かつ乃屋 那霸Main Place店'")


    log_section("TEST SUITE 5: INTERACTIVE PILL TOGGLE & appScrollToCard AUTO-SELECTION")
    js_test5 = """
    var listEl = document.getElementById("timeline-items-list");
    var d3GroupEl = listEl.querySelector('[data-alt-group="d3-lunch"]');
    var pillA = d3GroupEl.querySelector('[data-alt-target="a"]');
    var pillB = d3GroupEl.querySelector('[data-alt-target="b"]');
    var pillBoth = d3GroupEl.querySelector('[data-alt-target="both"]');

    // Simulate clicking Pill A
    pillA.trigger('click');
    var stateAfterPillA = d3GroupEl.dataset.activeOption;

    // Simulate clicking Pill B
    pillB.trigger('click');
    var stateAfterPillB = d3GroupEl.dataset.activeOption;

    // Simulate clicking Pill Both
    pillBoth.trigger('click');
    var stateAfterPillBoth = d3GroupEl.dataset.activeOption;

    // Test appScrollToCard auto-selection when option was hidden:
    // 1. Set group to option "a" (which hides option B on mobile)
    pillA.trigger('click');
    var initialOpt = d3GroupEl.dataset.activeOption; // "a"

    // 2. Call appScrollToCard for d3-7 (which is Option B)
    window.appScrollToCard("d3-7");
    var optAfterScrollToD3_7 = d3GroupEl.dataset.activeOption; // should now be "b"!

    // 3. Repeat for Day 4:
    var d4GroupEl = listEl.querySelector('[data-alt-group="d4-dinner"]');
    var d4PillA = d4GroupEl.querySelector('[data-alt-target="a"]');
    d4PillA.trigger('click');
    var d4InitialOpt = d4GroupEl.dataset.activeOption; // "a"

    window.appScrollToCard("d4-8"); // Option B
    var d4OptAfterScrollToD4_8 = d4GroupEl.dataset.activeOption; // should now be "b"!

    var report = {
      stateAfterPillA: stateAfterPillA,
      stateAfterPillB: stateAfterPillB,
      stateAfterPillBoth: stateAfterPillBoth,
      initialOpt: initialOpt,
      optAfterScrollToD3_7: optAfterScrollToD3_7,
      d4InitialOpt: d4InitialOpt,
      d4OptAfterScrollToD4_8: d4OptAfterScrollToD4_8
    };
    print(JSON.stringify(report));
    """
    out5 = json.loads(run_jsc_script(js_test5))

    assert_true(out5["stateAfterPillA"] == "a", "Pill A click activates data-active-option='a'")
    assert_true(out5["stateAfterPillB"] == "b", "Pill B click activates data-active-option='b'")
    assert_true(out5["stateAfterPillBoth"] == "both", "Pill Both click activates data-active-option='both'")
    assert_true(out5["initialOpt"] == "a" and out5["optAfterScrollToD3_7"] == "b",
                "appScrollToCard('d3-7') automatically reveals option 'b' when previously filtered to 'a'")
    assert_true(out5["d4InitialOpt"] == "a" and out5["d4OptAfterScrollToD4_8"] == "b",
                "appScrollToCard('d4-8') automatically reveals option 'b' when previously filtered to 'a'")


    log_section("TEST SUITE 6: ADVERSARIAL STRESS TESTING & EDGE CASES")
    js_test6 = """
    var searchInput = document.getElementById("schedule-search-input");
    var searchClear = document.getElementById("schedule-search-clear");
    var listEl = document.getElementById("timeline-items-list");

    // Case 1: Search matches only d3-7 (e.g., "壺屋")
    searchInput.trigger("input", { target: { value: "壺屋" } });
    var htmlSearchEibun = listEl.innerHTML;
    var eibunSingleFound = htmlSearchEibun.includes('id="item-d3-7"');
    var inakaExcluded = !htmlSearchEibun.includes('id="item-d3-6"');
    var eibunStandardCard = !htmlSearchEibun.includes('data-alt-group="d3-lunch"');

    // Case 2: Search matches only d3-6 (e.g., "400円")
    searchInput.trigger("input", { target: { value: "400円" } });
    var htmlSearchInaka = listEl.innerHTML;
    var inakaSingleFound = htmlSearchInaka.includes('id="item-d3-6"');
    var eibunExcluded = !htmlSearchInaka.includes('id="item-d3-7"');
    var inakaStandardCard = !htmlSearchInaka.includes('data-alt-group="d3-lunch"');

    // Case 3: Search matches only d4-7 (e.g., "Main Place")
    searchInput.trigger("input", { target: { value: "Main Place" } });
    var htmlSearchKatsunoya = listEl.innerHTML;
    var katsunoyaSingleFound = htmlSearchKatsunoya.includes('id="item-d4-7"');
    var koyajiExcluded = !htmlSearchKatsunoya.includes('id="item-d4-8"');
    var katsunoyaStandardCard = !htmlSearchKatsunoya.includes('data-alt-group="d4-dinner"');

    // Case 4: Search matches BOTH Day 3 alternatives (e.g., "沖繩麵")
    searchInput.trigger("input", { target: { value: "沖繩麵" } });
    var htmlSearchBoth = listEl.innerHTML;
    var bothFound = htmlSearchBoth.includes('id="item-d3-6"') && htmlSearchBoth.includes('id="item-d3-7"');
    var altGroupPreserved = htmlSearchBoth.includes('data-alt-group="d3-lunch"');

    // Case 5: Search with 0 matches
    searchInput.trigger("input", { target: { value: "XYZNONEXISTENT999" } });
    var htmlZero = listEl.innerHTML;
    var hasEmptyState = htmlZero.includes("沒有符合條件的行程景點");

    // Reset search via Clear button
    searchClear.trigger("click");
    var htmlAfterClear = listEl.innerHTML;
    var restoredAltGroups = (htmlAfterClear.match(/class="card-alt-group"/g) || []).length;

    var report = {
      eibunSingleFound: eibunSingleFound,
      inakaExcluded: inakaExcluded,
      eibunStandardCard: eibunStandardCard,
      inakaSingleFound: inakaSingleFound,
      eibunExcluded: eibunExcluded,
      inakaStandardCard: inakaStandardCard,
      katsunoyaSingleFound: katsunoyaSingleFound,
      koyajiExcluded: koyajiExcluded,
      katsunoyaStandardCard: katsunoyaStandardCard,
      bothFound: bothFound,
      altGroupPreserved: altGroupPreserved,
      hasEmptyState: hasEmptyState,
      restoredAltGroups: restoredAltGroups
    };
    print(JSON.stringify(report));
    """
    out6 = json.loads(run_jsc_script(js_test6))

    assert_true(out6["eibunSingleFound"] and out6["inakaExcluded"] and out6["eibunStandardCard"],
                "Single item search ('壺屋') cleanly isolates d3-7 with standard card fallback")
    assert_true(out6["inakaSingleFound"] and out6["eibunExcluded"] and out6["inakaStandardCard"],
                "Single item search ('400円') cleanly isolates d3-6 with standard card fallback")
    assert_true(out6["katsunoyaSingleFound"] and out6["koyajiExcluded"] and out6["katsunoyaStandardCard"],
                "Single item search ('Main Place') cleanly isolates d4-7 with standard card fallback")
    assert_true(out6["bothFound"] and out6["altGroupPreserved"],
                "Dual item search ('沖繩麵') properly reconstructs .card-alt-group with both options")
    assert_true(out6["hasEmptyState"],
                "Non-matching search displays graceful empty state message")
    assert_true(out6["restoredAltGroups"] == 2,
                "Clearing search completely restores all 2 .card-alt-group components")

    log_section("OVERALL VERDICT FORMULATION")
    print("\n🎉 ALL 6 INDEPENDENT EMPIRICAL TEST SUITES PASSED WITH 100% SUCCESS!")
    print("Empirical challenger verdict: APPROVE\n")

if __name__ == "__main__":
    try:
        run_all_tests()
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ UNHANDLED EXCEPTION: {e}")
        sys.exit(1)
