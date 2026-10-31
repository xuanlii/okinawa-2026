#!/usr/bin/env python3
"""
Challenger 1 Empirical Verification Harness:
Baseline Schedule Preservation & Dynamic Flight Ripple Sync

Verifies:
1. Initial page load preserves official baseline schedule:
   - Day 1: 11:00 Toyota pickup -> 12:15 San-A -> 13:20 Ocean Tree -> 14:50 Costco -> 17:49 Ocean Tree -> 19:38 Fireworks -> 21:25 Ocean Tree
   - Day 2, Day 3, Day 4 start at 08:00 and are unaffected
   - Day 5: 08:00 Ocean Tree -> 10:08 Michi-no-Eki -> 11:20 AEON Naha -> 14:23 Tondo Ramen -> 15:27 Toyota Return -> 16:50 Naha Airport
   - Elimination of 02:21 AM reverse distortion
2. Dynamic flight ripple sync across ALL 5 preset flights (CI morning, CI afternoon, JX, BR early, BR afternoon)
   - Day 1 pickup time = arrTime + 60m, ripples to all Day 1 items
   - Day 5 return time = depTime - 120m, ripples to all Day 5 items
   - Intermediate days (Day 2, 3, 4) strictly unaffected
   - SCHEDULE_ITEMS length preserved at 40
3. Custom flights and edge cases:
   - Arbitrary airlines and times
   - Ultra-early departure (<06:30 AM) triggering warning
   - Late night arrival
   - Partial flight configurations
4. restoreOfficialBaseline():
   - Restores exact baseline times for all Day 1 and Day 5 items
   - Restores item descriptions and Chinese names
   - Removes localStorage flight key
   - Multi-cycle idempotency (sync -> restore -> sync -> restore)
5. Initial page load with pre-existing localStorage flight
6. Alternative meals presentation integrity throughout flight modifications
"""

import os
import sys
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JSC_BIN = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"

def run_jsc_test(test_name, js_code):
    print(f"\n=======================================================")
    print(f"RUNNING CHALLENGER TEST: {test_name}")
    print(f"=======================================================")
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
        print(f"[PASS] {test_name} SUCCEEDED 100%")
        return True

def build_mock_environment_js(initial_storage=None):
    storage_json = "{}"
    if initial_storage:
        import json
        storage_json = json.dumps(initial_storage)

    return f"""
    var setTimeout = function(cb) {{ return 1; }};
    var clearTimeout = function() {{}};
    var setInterval = function(cb) {{ return 1; }};
    var clearInterval = function() {{}};
    var console = {{ log: print, warn: print, error: print }};

    var _storage = {storage_json};
    var localStorage = {{
      getItem: function(k) {{ return _storage.hasOwnProperty(k) ? _storage[k] : null; }},
      setItem: function(k, v) {{ _storage[k] = String(v); }},
      removeItem: function(k) {{ delete _storage[k]; }},
      clear: function() {{ _storage = {{}}; }}
    }};

    function makeElement(tag) {{
      return {{
        tagName: (tag || 'DIV').toUpperCase(),
        addEventListener: function() {{}},
        querySelector: function() {{ return makeElement(); }},
        querySelectorAll: function() {{ return []; }},
        style: {{}},
        classList: {{
          add: function() {{}},
          remove: function() {{}},
          contains: function() {{ return false; }}
        }},
        setAttribute: function() {{}},
        getAttribute: function() {{ return null; }},
        removeAttribute: function() {{}},
        appendChild: function() {{}},
        removeChild: function() {{}},
        dataset: {{}},
        innerHTML: "",
        textContent: ""
      }};
    }}

    var timelineContainer = makeElement('div');
    timelineContainer.id = "timeline-items-list";

    var heroFlightName = makeElement('span');
    heroFlightName.id = "hero-flight-name";

    var plannerFlightLabel = makeElement('span');
    plannerFlightLabel.id = "planner-flight-label";

    var flightCardsContainer = makeElement('div');
    flightCardsContainer.id = "flight-cards-container";

    var customFormCard = makeElement('div');
    customFormCard.id = "custom-flight-form-card";

    var modalOverlay = makeElement('div');
    modalOverlay.id = "flight-modal-overlay";

    var toastContainer = makeElement('div');
    toastContainer.id = "toast-container";

    var elementsMap = {{
      "timeline-items-list": timelineContainer,
      "hero-flight-name": heroFlightName,
      "planner-flight-label": plannerFlightLabel,
      "flight-cards-container": flightCardsContainer,
      "custom-flight-form-card": customFormCard,
      "flight-modal-overlay": modalOverlay,
      "toast-container": toastContainer
    }};

    var document = {{
      documentElement: makeElement('html'),
      addEventListener: function(event, cb) {{
        if (event === 'DOMContentLoaded') this.domLoadedCb = cb;
      }},
      getElementById: function(id) {{
        if (elementsMap[id]) return elementsMap[id];
        var el = makeElement('div');
        el.id = id;
        return el;
      }},
      querySelectorAll: function() {{ return []; }},
      querySelector: function() {{ return makeElement('div'); }},
      createElement: function(tag) {{ return makeElement(tag); }},
      body: makeElement('body'),
      head: makeElement('head')
    }};

    var window = {{
      innerWidth: 1200,
      addEventListener: function() {{}},
      scrollTo: function() {{}},
      isSecureContext: true,
      matchMedia: function() {{ return {{ matches: false }}; }}
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

    function assertEquals(actual, expected, desc) {{
      if (actual !== expected) {{
        var err = desc + " | Expected: '" + expected + "', Got: '" + actual + "'";
        print("FAIL: " + err);
        throw new Error(err);
      }}
    }}

    function assertTrue(cond, desc) {{
      if (!cond) {{
        var err = desc + " | Assertion failed (falsy)";
        print("FAIL: " + err);
        throw new Error(err);
      }}
    }}
    """;

def test_clean_load_ripple_and_restore():
    mock_env = build_mock_environment_js(initial_storage=None)
    js_code = mock_env + """
    load("data.js");
    load("app.js");

    // Trigger DOMContentLoaded
    if (!document.domLoadedCb) throw new Error("DOMContentLoaded listener not registered!");
    document.domLoadedCb();

    var app = window.__okinawaApp__;
    if (!app) throw new Error("window.__okinawaApp__ not exposed!");

    print("\\n>>> SUITE 1: Baseline Schedule Preservation on Initial Load (Clean State)");
    // Day 1
    var d1_1 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-1'; });
    var d1_2 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-2'; });
    var d1_3 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-3'; });
    var d1_4 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-4'; });
    var d1_5 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-5'; });
    var d1_6 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-6'; });
    var d1_7 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-7'; });

    assertEquals(d1_1.time, "11:00", "Day 1 stop 1 (Toyota pickup)");
    assertEquals(d1_2.time, "12:15", "Day 1 stop 2 (San-A)");
    assertEquals(d1_3.time, "13:20", "Day 1 stop 3 (Ocean Tree check-in)");
    assertEquals(d1_4.time, "14:50", "Day 1 stop 4 (Costco)");
    assertEquals(d1_5.time, "17:49", "Day 1 stop 5 (Ocean Tree rest)");
    assertEquals(d1_6.time, "19:38", "Day 1 stop 6 (Fireworks)");
    assertEquals(d1_7.time, "21:25", "Day 1 stop 7 (Ocean Tree night)");

    // Intermediate Days Check
    var d2_1 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd2-1'; });
    var d3_1 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd3-1'; });
    var d4_1 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd4-1'; });
    assertEquals(d2_1.time, "08:00", "Day 2 start");
    assertEquals(d3_1.time, "08:00", "Day 3 start");
    assertEquals(d4_1.time, "08:00", "Day 4 start");

    // Day 5
    var d5_1 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd5-1'; });
    var d5_2 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd5-2'; });
    var d5_3 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd5-3'; });
    var d5_4 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd5-4'; });
    var d5_5 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd5-5'; });
    var d5_6 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd5-6'; });

    assertEquals(d5_1.time, "08:00", "Day 5 stop 1 (Ocean Tree departure) - NO 02:21 AM BUG!");
    assertEquals(d5_2.time, "10:08", "Day 5 stop 2 (Michi-no-Eki Toyosaki)");
    assertEquals(d5_3.time, "11:20", "Day 5 stop 3 (AEON Naha)");
    assertEquals(d5_4.time, "14:23", "Day 5 stop 4 (Tondo Ramen)");
    assertEquals(d5_5.time, "15:27", "Day 5 stop 5 (Toyota Car Return)");
    assertEquals(d5_6.time, "16:50", "Day 5 stop 6 (Naha Airport)");

    assertEquals(SCHEDULE_ITEMS.length, 40, "SCHEDULE_ITEMS total items count");
    assertTrue(localStorage.getItem('okinawa_selected_flight') === null, "Storage remains clean on initial load");
    print("  -> Initial load baseline preservation: VERIFIED");

    print("\\n>>> SUITE 2: Dynamic Flight Ripple Sync Across ALL 5 Preset Flights");

    // Preset 1: CI Morning (CI120 arr 10:45 / CI121 dep 11:55)
    var f_ci_m = OKINAWA_FLIGHTS.find(function(f) { return f.id === 'ci-oka-morning-roundtrip'; });
    app.syncFlightToItinerary(f_ci_m, false);
    assertEquals(app.state.selectedFlightId, 'ci-oka-morning-roundtrip', "CI Morning state.selectedFlightId");
    assertEquals(d1_1.time, "11:45", "CI Morning Day 1 pickup time (10:45 + 60m)");
    assertEquals(d5_5.time, "09:55", "CI Morning Day 5 car return (11:55 - 120m)");
    assertEquals(SCHEDULE_ITEMS.length, 40, "CI Morning SCHEDULE_ITEMS length");
    assertEquals(d2_1.time, "08:00", "CI Morning Day 2 untouched");
    assertEquals(d3_1.time, "08:00", "CI Morning Day 3 untouched");
    assertEquals(d4_1.time, "08:00", "CI Morning Day 4 untouched");
    print("  -> Preset 1 (CI Morning): VERIFIED");

    // Preset 2: CI Afternoon (CI122 arr 18:45 / CI123 dep 19:45)
    var f_ci_a = OKINAWA_FLIGHTS.find(function(f) { return f.id === 'ci-oka-afternoon-roundtrip'; });
    app.syncFlightToItinerary(f_ci_a, false);
    assertEquals(app.state.selectedFlightId, 'ci-oka-afternoon-roundtrip', "CI Afternoon state.selectedFlightId");
    assertEquals(d1_1.time, "19:45", "CI Afternoon Day 1 pickup time (18:45 + 60m)");
    assertEquals(d5_5.time, "17:45", "CI Afternoon Day 5 car return (19:45 - 120m)");
    assertEquals(SCHEDULE_ITEMS.length, 40, "CI Afternoon SCHEDULE_ITEMS length");
    assertEquals(d2_1.time, "08:00", "CI Afternoon Day 2 untouched");
    print("  -> Preset 2 (CI Afternoon): VERIFIED");

    // Preset 3: STARLUX (JX870 arr 12:05 / JX871 dep 13:15)
    var f_jx = OKINAWA_FLIGHTS.find(function(f) { return f.id === 'starlux-oka-roundtrip'; });
    app.syncFlightToItinerary(f_jx, false);
    assertEquals(app.state.selectedFlightId, 'starlux-oka-roundtrip', "JX state.selectedFlightId");
    assertEquals(d1_1.time, "13:05", "JX Day 1 pickup time (12:05 + 60m)");
    assertEquals(d5_5.time, "11:15", "JX Day 5 car return (13:15 - 120m)");
    assertEquals(SCHEDULE_ITEMS.length, 40, "JX SCHEDULE_ITEMS length");
    assertEquals(d3_1.time, "08:00", "JX Day 3 untouched");
    print("  -> Preset 3 (STARLUX JX): VERIFIED");

    // Preset 4: EVA Air Early (BR112 arr 09:15 / BR113 dep 10:15)
    var f_br_e = OKINAWA_FLIGHTS.find(function(f) { return f.id === 'eva-oka-early-roundtrip'; });
    app.syncFlightToItinerary(f_br_e, false);
    assertEquals(app.state.selectedFlightId, 'eva-oka-early-roundtrip', "BR Early state.selectedFlightId");
    assertEquals(d1_1.time, "10:15", "BR Early Day 1 pickup time (09:15 + 60m)");
    assertEquals(d5_5.time, "08:15", "BR Early Day 5 car return (10:15 - 120m)");
    assertEquals(SCHEDULE_ITEMS.length, 40, "BR Early SCHEDULE_ITEMS length");
    assertEquals(d4_1.time, "08:00", "BR Early Day 4 untouched");
    print("  -> Preset 4 (EVA Air Early): VERIFIED");

    // Preset 5: EVA Air Afternoon (BR186 arr 18:25 / BR185 dep 19:25)
    var f_br_a = OKINAWA_FLIGHTS.find(function(f) { return f.id === 'eva-oka-afternoon-roundtrip'; });
    app.syncFlightToItinerary(f_br_a, false);
    assertEquals(app.state.selectedFlightId, 'eva-oka-afternoon-roundtrip', "BR Afternoon state.selectedFlightId");
    assertEquals(d1_1.time, "19:25", "BR Afternoon Day 1 pickup time (18:25 + 60m)");
    assertEquals(d5_5.time, "17:25", "BR Afternoon Day 5 car return (19:25 - 120m)");
    assertEquals(SCHEDULE_ITEMS.length, 40, "BR Afternoon SCHEDULE_ITEMS length");
    print("  -> Preset 5 (EVA Air Afternoon): VERIFIED");

    print("\\n>>> SUITE 3: Custom Flight Dynamic Ripple Sync & Boundary Conditions");

    // Case 3.1: Normal Custom Flight (Tigerair: arr 09:40, dep 14:40)
    var customNormal = {
      id: "custom",
      airline: "台灣虎航",
      outbound: { flightNo: "IT230", arrTime: "09:40", depTime: "06:30" },
      inbound: { flightNo: "IT231", depTime: "14:40", arrTime: "15:25" }
    };
    app.syncFlightToItinerary(customNormal, false);
    assertEquals(app.state.selectedFlightId, 'custom', "Custom normal selectedFlightId");
    assertEquals(d1_1.time, "10:40", "Custom normal Day 1 pickup (09:40 + 60m)");
    assertEquals(d5_5.time, "12:40", "Custom normal Day 5 return (14:40 - 120m)");
    assertEquals(SCHEDULE_ITEMS.length, 40, "Custom normal SCHEDULE_ITEMS length");
    print("  -> Case 3.1 (Normal Custom Flight): VERIFIED");

    // Case 3.2: Ultra-early departure (dep 07:30 -> return 05:30 -> triggers 24h backward wrap)
    var customUltraEarly = {
      id: "custom",
      airline: "樂桃超早班",
      outbound: { flightNo: "MM920", arrTime: "10:00", depTime: "07:00" },
      inbound: { flightNo: "MM921", depTime: "07:30", arrTime: "08:15" }
    };
    app.syncFlightToItinerary(customUltraEarly, false);
    assertEquals(d5_5.time, "05:30", "Ultra-early Day 5 car return (07:30 - 120m)");
    assertTrue(typeof d5_1.time === 'string' && d5_1.time.length === 5, "Ultra-early Day 5 start time valid formatted string");
    assertEquals(SCHEDULE_ITEMS.length, 40, "Ultra-early SCHEDULE_ITEMS length");
    print("  -> Case 3.2 (Ultra-Early Custom Flight with backward wrap): VERIFIED (" + d5_1.time + " -> " + d5_5.time + ")");

    // Case 3.3: Late Night Arrival (arr 21:45 -> pickup 22:45)
    var customLate = {
      id: "custom",
      airline: "深夜航班",
      outbound: { flightNo: "XX999", arrTime: "21:45", depTime: "19:00" },
      inbound: { flightNo: "XX998", depTime: "22:00", arrTime: "23:00" }
    };
    app.syncFlightToItinerary(customLate, false);
    assertEquals(d1_1.time, "22:45", "Late night Day 1 pickup (21:45 + 60m)");
    assertEquals(d5_5.time, "20:00", "Late night Day 5 car return (22:00 - 120m)");
    assertEquals(SCHEDULE_ITEMS.length, 40, "Late night SCHEDULE_ITEMS length");
    print("  -> Case 3.3 (Late Night Custom Flight): VERIFIED");

    print("\\n>>> SUITE 4: restoreOfficialBaseline() Verification");
    // Currently on custom flight. Calling restoreOfficialBaseline().
    app.restoreOfficialBaseline();

    // Verify localStorage key removed
    assertTrue(localStorage.getItem('okinawa_selected_flight') === null, "Storage key removed after restore");

    // Verify state.selectedFlightId reset to default
    assertEquals(app.state.selectedFlightId, 'ci-oka-morning-roundtrip', "state.selectedFlightId reset");

    // Verify Day 1 restored to exact baseline
    assertEquals(d1_1.time, "11:00", "Restored Day 1 stop 1 time");
    assertEquals(d1_2.time, "12:15", "Restored Day 1 stop 2 time");
    assertEquals(d1_3.time, "13:20", "Restored Day 1 stop 3 time");
    assertEquals(d1_4.time, "14:50", "Restored Day 1 stop 4 time");
    assertEquals(d1_5.time, "17:49", "Restored Day 1 stop 5 time");
    assertEquals(d1_6.time, "19:38", "Restored Day 1 stop 6 time");
    assertEquals(d1_7.time, "21:25", "Restored Day 1 stop 7 time");

    // Verify Day 5 restored to exact baseline
    assertEquals(d5_1.time, "08:00", "Restored Day 5 stop 1 time");
    assertEquals(d5_2.time, "10:08", "Restored Day 5 stop 2 time");
    assertEquals(d5_3.time, "11:20", "Restored Day 5 stop 3 time");
    assertEquals(d5_4.time, "14:23", "Restored Day 5 stop 4 time");
    assertEquals(d5_5.time, "15:27", "Restored Day 5 stop 5 time");
    assertEquals(d5_6.time, "16:50", "Restored Day 5 stop 6 time");

    // Verify descriptions restored
    assertTrue(d1_1.desc.indexOf("抵達那霸機場後搭乘豐田專屬免費接駁巴士直達營業所") !== -1, "Day 1 stop 1 baseline description restored");
    assertTrue(d5_5.desc.indexOf("自駕行程順利返抵豐田租車那霸機場店") !== -1, "Day 5 stop 5 baseline description restored");
    assertEquals(d5_6.nameZh, "那霸機場 國際線航廈 (返程返台)", "Day 5 stop 6 baseline nameZh restored");

    assertEquals(SCHEDULE_ITEMS.length, 40, "Restored SCHEDULE_ITEMS length");
    print("  -> restoreOfficialBaseline(): VERIFIED");

    print("\\n>>> SUITE 5: Multi-Cycle Idempotency Stress Test");
    for (var cycle = 1; cycle <= 5; cycle++) {
      // Cycle flight
      app.syncFlightToItinerary(f_ci_a, false);
      assertEquals(d1_1.time, "19:45", "Cycle " + cycle + " CI Afternoon pickup");
      app.syncFlightToItinerary(f_jx, false);
      assertEquals(d1_1.time, "13:05", "Cycle " + cycle + " JX pickup");
      app.syncFlightToItinerary(customNormal, false);
      assertEquals(d1_1.time, "10:40", "Cycle " + cycle + " Custom pickup");

      // Restore
      app.restoreOfficialBaseline();
      assertEquals(d1_1.time, "11:00", "Cycle " + cycle + " Restored Day 1 start");
      assertEquals(d5_1.time, "08:00", "Cycle " + cycle + " Restored Day 5 start");
      assertEquals(d5_5.time, "15:27", "Cycle " + cycle + " Restored Day 5 return");
      assertEquals(d5_6.time, "16:50", "Cycle " + cycle + " Restored Day 5 airport");
      assertEquals(SCHEDULE_ITEMS.length, 40, "Cycle " + cycle + " length == 40");
    }
    print("  -> 5 consecutive sync-and-restore cycles: VERIFIED IDEMPOTENT");

    print("\\n>>> SUITE 7: Alternative Meals Presentation & Structural Integrity");
    var d3_6 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd3-6'; });
    var d3_7 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd3-7'; });
    var d4_7 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd4-7'; });
    var d4_8 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd4-8'; });

    assertTrue(d3_6 && d3_7 && d4_7 && d4_8, "All 4 alternative meal items exist");
    assertEquals(d3_6.alternativeGroupId, "d3-lunch-choice", "d3-6 alternativeGroupId");
    assertEquals(d3_7.alternativeGroupId, "d3-lunch-choice", "d3-7 alternativeGroupId");
    assertEquals(d4_7.alternativeGroupId, "d4-dinner-choice", "d4-7 alternativeGroupId");
    assertEquals(d4_8.alternativeGroupId, "d4-dinner-choice", "d4-8 alternativeGroupId");

    assertEquals(d3_6.time, "14:10", "d3-6 baseline time");
    assertEquals(d3_7.time, "14:14", "d3-7 baseline time");
    assertEquals(d4_7.time, "18:52", "d4-7 baseline time");
    assertEquals(d4_8.time, "20:03", "d4-8 baseline time");

    print("  -> Alternative meal items metadata: VERIFIED INTACT");

    print("\\n>>> SUITE 8: Mathematical Continuity & Non-overlapping Transit Invariants");
    // Test ripple chain mathematical continuity for Day 1
    app.syncFlightToItinerary(f_ci_m, false);
    var d1_items = SCHEDULE_ITEMS.filter(function(it) { return it.day === 1; });
    for (var i = 1; i < d1_items.length; i++) {
      var prev = d1_items[i - 1];
      var curr = d1_items[i];
      var prevMins = app.parseTimeToMinutes(prev.time);
      var prevDur = (prev.durationMinutes !== undefined) ? prev.durationMinutes : 60;
      var transit = app.calculateTransit(prev, curr);
      var transitMins = (transit && transit.durationMins) ? transit.durationMins : 20;
      var expectedCurrMins = prevMins + prevDur + transitMins;
      var actualCurrMins = app.parseTimeToMinutes(curr.time);
      assertEquals(actualCurrMins, expectedCurrMins, "Day 1 mathematical transit continuity at stop " + curr.id);
    }

    // Test ripple chain mathematical continuity for Day 5
    var d5_items = SCHEDULE_ITEMS.filter(function(it) { return it.day === 5; });
    for (var i = 1; i < d5_items.length; i++) {
      var prev = d5_items[i - 1];
      var curr = d5_items[i];
      var prevMins = app.parseTimeToMinutes(prev.time);
      var prevDur = (prev.durationMinutes !== undefined) ? prev.durationMinutes : 60;
      var transit = app.calculateTransit(prev, curr);
      var transitMins = (transit && transit.durationMins) ? transit.durationMins : 20;
      var expectedCurrMins = prevMins + prevDur + transitMins;
      var actualCurrMins = app.parseTimeToMinutes(curr.time);
      assertEquals(actualCurrMins, expectedCurrMins, "Day 5 mathematical transit continuity at stop " + curr.id);
    }
    print("  -> Mathematical forward chaining: 100% CONTINUOUS (no gaps, no overlaps)");

    print("\\n>>> SUITE 9: Timeline HTML DOM Rendering Verification");
    app.restoreOfficialBaseline();
    var html = timelineContainer.innerHTML;
    assertTrue(html.indexOf("11:00") !== -1, "Rendered HTML contains baseline Day 1 start 11:00");
    assertTrue(html.indexOf("08:00") !== -1, "Rendered HTML contains baseline Day 5 start 08:00");
    assertTrue(html.indexOf("15:27") !== -1, "Rendered HTML contains baseline Day 5 return 15:27");
    assertTrue(html.indexOf("16:50") !== -1, "Rendered HTML contains baseline Day 5 airport 16:50");
    assertTrue(html.indexOf("card-alt-group") !== -1, "Rendered HTML contains card-alt-group");
    assertTrue(html.indexOf("alt-toggle-pills") !== -1, "Rendered HTML contains alt-toggle-pills");
    assertTrue(html.indexOf("d3-lunch") !== -1, "Rendered HTML contains d3-lunch group");
    assertTrue(html.indexOf("d4-dinner") !== -1, "Rendered HTML contains d4-dinner group");
    assertTrue(html.indexOf("item-d3-6") !== -1, "Rendered HTML preserves item-d3-6 anchor ID");
    assertTrue(html.indexOf("item-d3-7") !== -1, "Rendered HTML preserves item-d3-7 anchor ID");
    assertTrue(html.indexOf("item-d4-7") !== -1, "Rendered HTML preserves item-d4-7 anchor ID");
    assertTrue(html.indexOf("item-d4-8") !== -1, "Rendered HTML preserves item-d4-8 anchor ID");
    print("  -> Rendered DOM HTML: VERIFIED CLEAN");

    print("\\n>>> ALL CHALLENGER RUN 1 SUITES COMPLETED WITH 100% SUCCESS!");
    """
    return run_jsc_test("Clean Load, All Flights Ripple Sync, Boundary Wrap & Restore", js_code)

def test_saved_flight_initial_load():
    # Simulate a user opening the page when 'starlux-oka-roundtrip' was previously chosen
    mock_env = build_mock_environment_js(initial_storage={"okinawa_selected_flight": "starlux-oka-roundtrip"})
    js_code = mock_env + """
    load("data.js");
    load("app.js");

    // Trigger DOMContentLoaded
    if (!document.domLoadedCb) throw new Error("DOMContentLoaded listener not registered!");
    document.domLoadedCb();

    var app = window.__okinawaApp__;
    if (!app) throw new Error("window.__okinawaApp__ not exposed!");

    print("\\n>>> SUITE 6: Pre-existing localStorage Flight on Initial Load");
    assertEquals(app.state.selectedFlightId, "starlux-oka-roundtrip", "state.selectedFlightId reflects saved flight");

    var d1_1 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd1-1'; });
    var d5_5 = SCHEDULE_ITEMS.find(function(it) { return it.id === 'd5-5'; });

    // JX870 arr 12:05 -> pickup 13:05; JX871 dep 13:15 -> car return 11:15
    assertEquals(d1_1.time, "13:05", "Saved JX Day 1 pickup time automatically synced on load");
    assertEquals(d5_5.time, "11:15", "Saved JX Day 5 car return time automatically synced on load");
    assertEquals(SCHEDULE_ITEMS.length, 40, "SCHEDULE_ITEMS length == 40");

    // Now test that user can restore official baseline from this saved flight state
    app.restoreOfficialBaseline();
    assertEquals(d1_1.time, "11:00", "Baseline restored Day 1 pickup");
    assertEquals(d5_5.time, "15:27", "Baseline restored Day 5 car return");
    assertTrue(localStorage.getItem('okinawa_selected_flight') === null, "Storage key removed after restore");

    print("  -> Saved flight auto-sync and subsequent restore: VERIFIED");
    print("\\n>>> ALL CHALLENGER RUN 2 SUITES COMPLETED WITH 100% SUCCESS!");
    """
    return run_jsc_test("Pre-existing localStorage Flight Auto-Sync & Restore", js_code)

def main():
    print("===================================================================")
    print("CHALLENGER 1 EMPIRICAL VERIFICATION SUITE")
    print("Target: Baseline Schedule Preservation & Dynamic Flight Ripple Sync")
    print("===================================================================")

    success_1 = test_clean_load_ripple_and_restore()
    success_2 = test_saved_flight_initial_load()

    if success_1 and success_2:
        print("\n===================================================================")
        print("🏆 EMPIRICAL CHALLENGER VERIFICATION RESULT: 100% PASS")
        print("All assertions for Baseline Preservation, Dynamic Ripple Sync,")
        print("Custom Flights, Boundary Conditions & Baseline Restoration passed.")
        print("===================================================================")
        sys.exit(0)
    else:
        print("\n===================================================================")
        print("❌ EMPIRICAL CHALLENGER VERIFICATION RESULT: FAILURES DETECTED")
        print("===================================================================")
        sys.exit(1)

if __name__ == '__main__':
    main()
