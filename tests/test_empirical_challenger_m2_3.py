#!/usr/bin/env python3
"""
Empirical Challenger M2-3 Verification Harness
Deep stress test and adversarial audit of Okinawa Trip 2026 Milestone 2 UX
"""
import re
import os
import sys
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JSC_BIN = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"

def load_files():
    with open(os.path.join(BASE_DIR, 'styles.css'), 'r', encoding='utf-8') as f:
        css = f.read()
    with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()
    with open(os.path.join(BASE_DIR, 'app.js'), 'r', encoding='utf-8') as f:
        js = f.read()
    with open(os.path.join(BASE_DIR, 'data.js'), 'r', encoding='utf-8') as f:
        data = f.read()
    return css, html, js, data

def test_interactive_elements_touch_targets(css, html, js):
    print("\n--- [CHALLENGE 1] Interactive Elements Touch Targets (>= 44x44px) ---")
    issues = []
    
    # 1. Parse all buttons in index.html
    button_matches = re.findall(r'<button([^>]*)>(.*?)</button>', html, re.DOTALL)
    print(f"Total buttons in index.html: {len(button_matches)}")
    for attrs, content in button_matches:
        class_m = re.search(r'class="([^"]+)"', attrs)
        id_m = re.search(r'id="([^"]+)"', attrs)
        style_m = re.search(r'style="([^"]+)"', attrs)
        
        btn_desc = f"button#{id_m.group(1)}" if id_m else (f"button.{class_m.group(1)}" if class_m else "button")
        
        # Check inline styles for sub-44 dimensions
        if style_m:
            st = style_m.group(1)
            for prop in ['width', 'height', 'min-width', 'min-height']:
                m = re.findall(r'(?<![a-z-])' + prop + r'\s*:\s*(\d+)px', st)
                for v in m:
                    if int(v) < 44 and prop.startswith('min-'):
                        issues.append(f"Inline style on {btn_desc} has {prop}: {v}px (< 44px)")
                        
    # 2. Check all dynamically created buttons in app.js
    dynamic_buttons = re.findall(r'<button([^>]*)>', js)
    print(f"Total dynamically generated <button> tags in app.js: {len(dynamic_buttons)}")
    for attrs in dynamic_buttons:
        class_m = re.search(r'class=[\'"]([^\'"]+)[\'"]', attrs)
        style_m = re.search(r'style=[\'"]([^\'"]+)[\'"]', attrs)
        btn_desc = f"dynamic button.{class_m.group(1)}" if class_m else "dynamic button"
        if style_m:
            st = style_m.group(1)
            # check if inline style forces small height/width without 44px min
            if re.search(r'padding:\s*0\.25rem', st) and 'min-height' not in st:
                issues.append(f"Inline style on {btn_desc} has tight padding without min-height: '{st}'")
            for prop in ['min-width', 'min-height']:
                m = re.findall(r'(?<![a-z-])' + prop + r'\s*:\s*(\d+)px', st)
                for v in m:
                    if int(v) < 44:
                        issues.append(f"Inline style on {btn_desc} has {prop}: {v}px (< 44px)")

    # 3. Check CSS rules on mobile (under @media (max-width: 900px))
    # Crucial classes: .mobile-nav-btn, .btn-stop-ctrl, .btn-stop-dur-step, .btn-delete-expense,
    # .btn-star-fav, .btn-copy-mc-badge, .search-clear, .btn-picker-add, .btn-picker-preview,
    # .day-tab-btn, .cat-pill, .modal-close-btn, .theme-toggle, .btn-card-action
    crucial_selectors = [
        '.mobile-nav-btn', '.btn-stop-ctrl', '.btn-stop-dur-step', '.btn-delete-expense',
        '.btn-star-fav', '.btn-copy-mc-badge', '.search-clear', '.btn-picker-add',
        '.btn-picker-preview', '.day-tab-btn', '.cat-pill', '.modal-close-btn',
        '.theme-toggle', '.btn-card-action', '.alt-toggle-pill', '.planner-day-tab-btn'
    ]
    
    for sel in crucial_selectors:
        # Search for min-width / min-height
        min_w_m = re.findall(re.escape(sel) + r'[^\{]*\{[^}]*min-width\s*:\s*(\d+)px', css)
        min_h_m = re.findall(re.escape(sel) + r'[^\{]*\{[^}]*min-height\s*:\s*(\d+)px', css)
        print(f"  Selector {sel}: min-width={min_w_m}, min-height={min_h_m}")
        if min_h_m:
            for h in min_h_m:
                if int(h) < 44:
                    issues.append(f"CSS selector {sel} specifies min-height: {h}px (< 44px)")
        if min_w_m:
            for w in min_w_m:
                if int(w) < 44:
                    issues.append(f"CSS selector {sel} specifies min-width: {w}px (< 44px)")

    print(f"Touch target issues found: {len(issues)}")
    for iss in issues:
        print(f"  [TOUCH TARGET ISSUE] {iss}")
    return issues

def test_ios_input_font_sizes(css, html, js):
    print("\n--- [CHALLENGE 2] iOS Auto-Zoom Font Size (>= 16px) ---")
    issues = []
    
    # Check index.html form controls
    inputs_in_html = re.findall(r'<(input|select|textarea)([^>]*)>', html)
    print(f"Total input/select/textarea in index.html: {len(inputs_in_html)}")
    for tag, attrs in inputs_in_html:
        style_m = re.search(r'style="([^"]+)"', attrs)
        if style_m:
            st = style_m.group(1)
            fs_m = re.findall(r'font-size\s*:\s*([^;]+)', st)
            for fs in fs_m:
                fs = fs.strip()
                if 'px' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 16.0:
                    issues.append(f"Inline font-size on <{tag}>: {fs} (< 16px)")
                elif 'rem' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 1.0:
                    issues.append(f"Inline font-size on <{tag}>: {fs} (< 1rem)")

    # Check app.js dynamic form controls
    inputs_in_js = re.findall(r'<(input|select|textarea)([^>]*)>', js)
    print(f"Total dynamic input/select/textarea in app.js: {len(inputs_in_js)}")
    for tag, attrs in inputs_in_js:
        style_m = re.search(r'style=[\'"]([^\'"]+)[\'"]', attrs)
        if style_m:
            st = style_m.group(1)
            fs_m = re.findall(r'font-size\s*:\s*([^;]+)', st)
            for fs in fs_m:
                fs = fs.strip()
                if 'px' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 16.0:
                    issues.append(f"Inline font-size on dynamic <{tag}>: {fs} (< 16px)")
                elif 'rem' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 1.0:
                    issues.append(f"Inline font-size on dynamic <{tag}>: {fs} (< 1rem)")

    # Check unified mobile 16px rule in styles.css
    has_unified_16px = bool(re.search(r'input,\s*select,\s*textarea\s*\{[^}]*font-size:\s*16px\s*!important', css))
    print(f"Unified input/select/textarea 16px !important rule found: {has_unified_16px}")
    if not has_unified_16px:
        issues.append("Missing unified 'input, select, textarea { font-size: 16px !important; }' rule in styles.css")

    print(f"Input font size issues found: {len(issues)}")
    for iss in issues:
        print(f"  [INPUT ZOOM ISSUE] {iss}")
    return issues

def test_desktop_bottom_nav_bleed(css, html):
    print("\n--- [CHALLENGE 3] Desktop Bottom Nav Bleed Prevention ---")
    issues = []
    
    # 1. Base rule: .mobile-bottom-nav must be display: none outside media queries
    # Remove all media queries
    non_media_css = re.sub(r'@media[^{]*\{([^{}]*\{[^{}]*\})*[^{}]*\}', '', css, flags=re.DOTALL)
    base_match = re.search(r'\.mobile-bottom-nav\s*\{([^}]+)\}', non_media_css)
    if not base_match:
        issues.append("No base rule found for .mobile-bottom-nav outside media queries")
    else:
        body = base_match.group(1)
        if 'display: none' not in body:
            issues.append(f"Base rule for .mobile-bottom-nav does not specify display: none! Body: {body}")
        else:
            print("  [PASS] Base rule has display: none outside media queries")

    # 2. Check if any rule with display: flex / block on .mobile-bottom-nav exists outside @media (max-width: ...)
    # Find all media queries that mention .mobile-bottom-nav
    media_matches = re.finditer(r'@media([^{]+)\{((?:[^{}]+|\{[^{}]*\})+)\}', css)
    for m in media_matches:
        query = m.group(1).strip()
        body = m.group(2)
        if '.mobile-bottom-nav' in body and 'display: flex' in body:
            print(f"  Found display: flex in media query: @media {query}")
            # Ensure it is a max-width <= 900px query
            mw = re.findall(r'max-width\s*:\s*(\d+)px', query)
            if not mw or any(int(w) > 900 for w in mw):
                issues.append(f".mobile-bottom-nav display: flex found under invalid media query: {query}")
            min_w = re.findall(r'min-width\s*:\s*(\d+)px', query)
            if min_w:
                issues.append(f".mobile-bottom-nav display: flex found under min-width query: {query}")

    print(f"Desktop bottom nav bleed issues found: {len(issues)}")
    for iss in issues:
        print(f"  [DESKTOP BLEED ISSUE] {iss}")
    return issues

def test_itinerary_alternatives_and_transit(data, js):
    print("\n--- [CHALLENGE 4] Itinerary Alternatives & Data Layer Contracts ---")
    issues = []
    
    # Check SCHEDULE_ITEMS has exactly 40 items
    sched_items = re.findall(r'\{\s*id:\s*[\'"](d\d+-\d+)[\'"]', data)
    print(f"Total schedule items in data.js: {len(sched_items)}")
    if len(sched_items) != 40:
        issues.append(f"SCHEDULE_ITEMS has {len(sched_items)} items (expected 40)")
        
    # Check SPOTS_CATALOG has exactly 30 spots
    spots = re.findall(r'\"id\":\s*\"(spot-[^\"]+)\"', data)
    print(f"Total spots in SPOTS_CATALOG: {len(spots)}")
    if len(spots) != 30:
        issues.append(f"SPOTS_CATALOG has {len(spots)} spots (expected 30)")

    # Check Day 3 alternatives (d3-6 and d3-7)
    if 'd3-6' not in sched_items or 'd3-7' not in sched_items:
        issues.append("Day 3 alternatives d3-6 or d3-7 missing from SCHEDULE_ITEMS")
    else:
        print("  [PASS] Day 3 lunch alternatives d3-6 (소키소바) and d3-7 (EIBUN) confirmed in data.js")

    # Check Day 4 alternatives (d4-7 and d4-8)
    if 'd4-7' not in sched_items or 'd4-8' not in sched_items:
        issues.append("Day 4 alternatives d4-7 or d4-8 missing from SCHEDULE_ITEMS")
    else:
        print("  [PASS] Day 4 dinner alternatives d4-7 (Katsunoya) and d4-8 (Tonkatsu Koyaji) confirmed in data.js")

    # Check typo correction d5-3: "永旺 那霸店"
    if '永忘 那霸店' in data:
        issues.append("Typo '永忘 那霸店' still present in data.js!")
    elif '永旺 那霸店' in data:
        print("  [PASS] Typo corrected: '永旺 那霸店' verified in data.js")
    else:
        issues.append("Neither '永忘 那霸店' nor '永旺 那霸店' found in data.js!")

    # Check 2-choose-1 rendering logic in app.js
    if 'card-alt-group' not in js:
        issues.append("Alternative group rendering class 'card-alt-group' missing in app.js")
    else:
        print("  [PASS] Alternative meal 2-choose-1 presentation logic verified in app.js")

    print(f"Itinerary & transit contract issues found: {len(issues)}")
    for iss in issues:
        print(f"  [ITINERARY ISSUE] {iss}")
    return issues

def main():
    css, html, js, data = load_files()
    c1 = test_interactive_elements_touch_targets(css, html, js)
    c2 = test_ios_input_font_sizes(css, html, js)
    c3 = test_desktop_bottom_nav_bleed(css, html)
    c4 = test_itinerary_alternatives_and_transit(data, js)
    
    total = len(c1) + len(c2) + len(c3) + len(c4)
    print("\n=======================================================")
    print(f"EMIRICAL CHALLENGER M2-3 RESULTS: {total} TOTAL ISSUES FOUND")
    print("=======================================================")
    if total == 0:
        print("VERDICT: APPROVE")
        sys.exit(0)
    else:
        print("VERDICT: REQUEST_CHANGES")
        sys.exit(1)

if __name__ == '__main__':
    main()
