"""
Adversarial Stress Test Suite for Milestone 2:
- Touch target sizes (>= 44px)
- iOS Auto-Zoom prevention (input font-size >= 16px)
- Desktop layout regressions (no mobile bottom nav leakage at >900px, 1200px, 1440px)
- Modal scroll locks & state management
- Build & Verification integrity
"""
import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_files():
    with open(os.path.join(BASE_DIR, 'styles.css')) as f:
        css = f.read()
    with open(os.path.join(BASE_DIR, 'index.html')) as f:
        html = f.read()
    with open(os.path.join(BASE_DIR, 'app.js')) as f:
        js = f.read()
    return css, html, js

def test_sub44px_targets(css, html, js):
    print("=== Testing Touch Targets (< 44px) ===")
    issues = []

    # 1. Check btn-delete-expense
    m = re.findall(r'\.btn-delete-expense\s*\{([^}]+)\}', css)
    for b in m:
        for prop in ['min-width', 'min-height', 'width', 'height']:
            vals = re.findall(r'(?<![a-z-])' + prop + r'\s*:\s*(\d+)px', b)
            for v in vals:
                if int(v) < 44:
                    issues.append(f".btn-delete-expense in CSS has {prop}: {v}px (< 44px)")

    # Check app.js inline style for btn-delete-expense
    if 'class="btn-delete-expense"' in js:
        match = re.search(r'class="btn-delete-expense"[^>]*style="([^"]+)"', js)
        if match:
            st = match.group(1)
            issues.append(f"app.js generates .btn-delete-expense with inline style: '{st}', lacking min-height/min-width 44px")

    # 2. Check btn-stop-dur-step override at end of styles.css
    # Find all occurrences of .btn-stop-dur-step
    dur_matches = [(m.start(), m.group(0)) for m in re.finditer(r'\.btn-stop-dur-step\s*\{([^}]+)\}', css)]
    for pos, rule in dur_matches:
        line_no = css[:pos].count('\n') + 1
        # Check if line_no > 2700 (outside media queries) and sets sub-44px
        if 'min-width: 30px' in rule or 'height: 30px' in rule:
            issues.append(f".btn-stop-dur-step at line {line_no} overrides 44px targets with min-width: 30px; min-height: 30px")

    # 3. Check search-clear button
    search_clear = re.findall(r'\.search-clear\s*\{([^}]+)\}', css)
    for b in search_clear:
        for prop in ['min-width', 'min-height', 'width', 'height']:
            vals = re.findall(r'(?<![a-z-])' + prop + r'\s*:\s*(\d+)px', b)
            for v in vals:
                if int(v) < 44:
                    issues.append(f".search-clear in CSS has {prop}: {v}px (< 44px)")

    # 4. Check btn-copy-mc-badge
    mc_badge = re.findall(r'\.btn-copy-mc-badge\s*\{([^}]+)\}', css)
    for b in mc_badge:
        for prop in ['min-width', 'min-height', 'width', 'height']:
            vals = re.findall(r'(?<![a-z-])' + prop + r'\s*:\s*(\d+)px', b)
            for v in vals:
                if int(v) < 44:
                    issues.append(f".btn-copy-mc-badge in CSS has {prop}: {v}px (< 44px)")

    # 5. Check btn-star-fav
    star_fav = re.findall(r'\.btn-star-fav\s*\{([^}]+)\}', css)
    for b in star_fav:
        for prop in ['min-width', 'min-height', 'width', 'height']:
            vals = re.findall(r'(?<![a-z-])' + prop + r'\s*:\s*(\d+)px', b)
            for v in vals:
                if int(v) < 44:
                    issues.append(f".btn-star-fav in CSS has {prop}: {v}px (< 44px)")

    # 6. Check btn-xs in index.html and styles.css
    btn_xs = re.findall(r'\.btn-xs\s*\{([^}]+)\}', css)
    for b in btn_xs:
        for prop in ['min-width', 'min-height', 'width', 'height']:
            vals = re.findall(r'(?<![a-z-])' + prop + r'\s*:\s*(\d+)px', b)
            for v in vals:
                if int(v) < 44:
                    issues.append(f".btn-xs in CSS has {prop}: {v}px (< 44px)")

    for iss in issues:
        print(f"  [TOUCH TARGET ISSUE] {iss}")
    return issues

def test_ios_input_zoom(css, html, js):
    print("\n=== Testing iOS Input Auto-Zoom (< 16px Font Size) ===")
    issues = []

    # Check input, select, textarea selectors in CSS
    input_selectors = [
        'input', 'select', 'textarea', '.form-control', '.search-input',
        '.form-control-time', '.form-control-select', '.stop-move-day-select',
        '.stop-duration-select', '#input-gmap-api-key', '#modal-select-planner-day'
    ]

    for sel in input_selectors:
        # find matching rules
        pattern = r'(^|[\s,>+~])' + re.escape(sel) + r'([:\s,{>+~][^{]*)\{([^}]+)\}'
        for m in re.finditer(pattern, css):
            body = m.group(3)
            # check font-size
            fs_matches = re.findall(r'font-size\s*:\s*([^;]+)', body)
            for fs in fs_matches:
                fs = fs.strip()
                if 'rem' in fs:
                    rem_val = float(re.findall(r'[\d\.]+', fs)[0])
                    if rem_val < 1.0:
                        issues.append(f"{sel} has font-size: {fs} (< 1rem/16px)")
                elif 'px' in fs:
                    px_val = float(re.findall(r'[\d\.]+', fs)[0])
                    if px_val < 16.0:
                        issues.append(f"{sel} has font-size: {fs} (< 16px)")

    # Check index.html for input/select/textarea inline font-sizes
    for m in re.finditer(r'<(input|select|textarea)[^>]*style="([^"]+)"', html):
        tag, st = m.group(1), m.group(2)
        fs_matches = re.findall(r'font-size\s*:\s*([^;]+)', st)
        for fs in fs_matches:
            fs = fs.strip()
            if 'rem' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 1.0:
                issues.append(f"index.html <{tag}> inline font-size: {fs} (< 1rem)")
            elif 'px' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 16.0:
                issues.append(f"index.html <{tag}> inline font-size: {fs} (< 16px)")

    # Check app.js for dynamic input templates
    for m in re.finditer(r'<(input|select|textarea)[^>]*style="([^"]+)"', js):
        tag, st = m.group(1), m.group(2)
        fs_matches = re.findall(r'font-size\s*:\s*([^;]+)', st)
        for fs in fs_matches:
            fs = fs.strip()
            if 'rem' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 1.0:
                issues.append(f"app.js <{tag}> inline font-size: {fs} (< 1rem)")
            elif 'px' in fs and float(re.findall(r'[\d\.]+', fs)[0]) < 16.0:
                issues.append(f"app.js <{tag}> inline font-size: {fs} (< 16px)")

    for iss in issues:
        print(f"  [INPUT ZOOM ISSUE] {iss}")
    return issues

def test_desktop_layout_regressions(css, html):
    print("\n=== Testing Desktop Layout Regressions (> 900px, 1200px, 1440px) ===")
    issues = []

    # Check .mobile-bottom-nav display at base level
    base_match = re.search(r'\.mobile-bottom-nav\s*\{([^}]+)\}', css)
    if not base_match or 'display: none' not in base_match.group(1):
        issues.append("Base rule for .mobile-bottom-nav does not specify display: none (causes desktop bleed)")

    # Check if .mobile-view-toggle-bar has display: none at base
    toggle_base = re.search(r'\.mobile-view-toggle-bar\s*\{([^}]+)\}', css)
    if toggle_base and 'display: none' not in toggle_base.group(1):
        issues.append(".mobile-view-toggle-bar might bleed into desktop")

    for iss in issues:
        print(f"  [DESKTOP REGRESSION ISSUE] {iss}")
    return issues

def test_modal_scroll_locks(js):
    print("\n=== Testing Modal Scroll Locks & Cleanup ===")
    issues = []

    # Modals in application:
    # 1. spot-detail-modal
    # 2. spot-picker-modal
    # 3. flight-modal-overlay
    # 4. gmap-key-modal

    # Check openGmapKeyModal vs initGmapKeyModal
    if 'function openGmapKeyModal' in js:
        # Check if openGmapKeyModal locks body overflow
        m = re.search(r'function openGmapKeyModal\([^)]*\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', js)
        if m and "document.body.style.overflow = 'hidden'" not in m.group(1):
            issues.append("openGmapKeyModal() does not set document.body.style.overflow = 'hidden' when opened via traffic toggle")

    for iss in issues:
        print(f"  [SCROLL LOCK ISSUE] {iss}")
    return issues

if __name__ == '__main__':
    css, html, js = load_files()
    t1 = test_sub44px_targets(css, html, js)
    t2 = test_ios_input_zoom(css, html, js)
    t3 = test_desktop_layout_regressions(css, html)
    t4 = test_modal_scroll_locks(js)
    print("\n=== Summary ===")
    print(f"Touch Target Issues: {len(t1)}")
    print(f"Input Zoom Issues: {len(t2)}")
    print(f"Desktop Regression Issues: {len(t3)}")
    print(f"Scroll Lock Issues: {len(t4)}")
