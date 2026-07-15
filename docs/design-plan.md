# Phase 11 — Visual Design Plan

## 1. Audit: Concrete UI Issues

### 1.1 Inconsistent Outer Container Padding

| Component | Class | px | Issue |
|-----------|-------|----|-------|
| ZemenCalendar | `p-3` | 12 | — |
| ZemenDateRangePicker | `p-3` | 12 | — |
| ZemenDatePicker (popover) | `p-1` | 4 | Way too tight; inner calendar also `p-1` = 8 total |
| ZemenCalendarHeader | *(none)* | 0 | Floats inside parents with varying gaps |
| ZemenMonthView | *(none)* | 0 | Relies on parent gap |
| ZemenYearView (cards) | `p-2.5` | 10 | Not on the scale |
| ZemenQuickAdd | `p-5` | 20 | Most spacious |
| ZemenTaskForm | `p-6` | 24 | Most spacious |
| ZemenEmptyState | `py-12` | 48 | Vertical-only, fine |

**6 different container padding values** across similar components.

### 1.2 Inconsistent Navigation Button Sizing

| Component | Size | px | Radius |
|-----------|------|----|--------|
| ZemenCalendar prev/next | `h-7 w-7` | 28 | `rounded-lg` (8) |
| ZemenDateRangePicker prev/next | `h-7 w-7` | 28 | `rounded-lg` (8) |
| CalendarHeader prev/next | `h-8 w-8` | 32 | `rounded-lg` (8) |
| ZemenDayView prev/next | `h-8 w-8` | 32 | `rounded-lg` (8) |
| ZemenMiniCalendar prev/next | `h-6 w-6` | 24 | `rounded` (4) |
| QuickAdd close | `h-6 w-6` | 24 | `rounded` (4) |
| TaskForm close | `h-7 w-7` | 28 | `rounded` (4) |

**4 different sizes, 2 different radii** for the same pattern (icon button in a header).

### 1.3 Inconsistent Cell Shape

| Component | Cell | Radius | Shape |
|-----------|------|--------|-------|
| ZemenCalendar day cells | `h-9 rounded-lg` | 8 | Rounded rect |
| ZemenDateRangePicker day cells | `h-9 rounded-lg` | 8 | Rounded rect |
| ZemenMiniCalendar day cells | `aspect-square rounded-full` | 9999 | Circle |
| ZemenYearView mini-grid cells | `aspect-square rounded-sm` | 2 | Near-square corner |
| ZemenMonthView day cells | `min-h-[90px] rounded-lg` | 8 | Tall rect |
| ZemenAgendaView (TaskCard) | *(no grid cells)* | — | — |

**4 different cell shapes** across the calendar family. MiniCalendar's circular cells are the most visually divergent — it's the odd one out.

### 1.4 Inconsistent Grid Gap

| Component | Gap | px |
|-----------|-----|----|
| ZemenCalendar | `gap-0.5` | 2 |
| ZemenDateRangePicker | `gap-0.5` | 2 |
| ZemenMiniCalendar | `gap-0` | 0 |
| ZemenMonthView | `gap-px` | 1 |
| ZemenYearView mini-grids | `gap-0` | 0 |

**4 different gap values** for the same pattern (day grid).

### 1.5 Type Size Inconsistency (Day Numbers)

| Component | Day number size | Sub-label size |
|-----------|----------------|----------------|
| ZemenCalendar | `text-[13px]` | `text-[9px]` |
| ZemenMiniCalendar | `text-[11px]` | *(none)* |
| ZemenMonthView | `text-sm` (14px) | `text-[10px]` |
| ZemenYearView mini-grid | `text-[9px]` | *(none)* |
| ZemenDateRangePicker | `text-[13px]` | *(none)* |

**4 different primary sizes** for the same semantic element.

### 1.6 Dark Mode Background Inconsistencies

- Container bg: `dark:bg-[#111827]` (Calendar, DateRangePicker, QuickAdd, TaskForm, DatePicker popover)
- Container bg: `dark:bg-[#111827]/50` (YearView cards)
- Skeleton/inner bg: `dark:bg-gray-800` (MonthView skeleton), `dark:bg-gray-800/30` (various)
- App body bg: `dark:bg-[#0a0e17]` (in `layout.tsx`)
- Input bg: `dark:bg-gray-800` (QuickAdd, TaskForm fields)
- Today highlight: `dark:bg-gray-800` (Calendar), `dark:bg-emerald-900/30` (MiniCalendar), `dark:bg-emerald-900/20` (MonthView)

The component surface (`#111827`) is visibly lighter than the app body (`#0a0e17`), which is a good hierarchy. But YearView cards at 50% opacity introduce a third surface variant that doesn't match anything else.

### 1.7 ZemenDatePicker Specific Issues

1. **Trigger uses `px-4 py-3`** (16×12) while every other input-like component in the system (QuickAdd, TaskForm) uses `px-3 py-2` (12×8). The picker trigger will look oversized next to form fields.
2. **Focus ring hardcodes `[#0B3D16]`** (dark green) instead of the emerald accent (`focus:ring-emerald-500/50`) used everywhere else — this is a leftover from an earlier design era.
3. **Popover has `w-[280px]`** fixed width — if the Calendar component's internal layout ever changes, this breaks. Should derive from content.
4. **Open state uses `shadow-[0_0_0_3px_rgba(...)]`** custom shadow that won't survive the token system migration — needs to become a standard focus ring.

### 1.8 ZemenDateRangePicker Specific Issues

1. **Calendar toggle button** at the bottom uses `px-2 py-1 text-[10px]` — significantly smaller than CalendarHeader's toggle (`px-3 py-1.5 text-xs`). Inconsistent within the same component family.
2. **Dual calendars side by side** — the container uses the same `p-3` as single-calendar ZemenCalendar, but with two instances the inner padding should be tighter.
3. **Range "in" state** uses `bg-emerald-50 dark:bg-emerald-900/20` — this is the only place where `emerald-50` is used as a background in the dark mode system. It's a light green that doesn't match the dark surface. Should be a dark variant.

### 1.9 ZemenCalendar Specific Issues

1. **`themeColor` default is `#0B3D16`** (dark green) — doesn't match the emerald-500/600 accent used everywhere else. The `themeColor` mechanism is useful for consumer customization, but the default must match the design system.
2. **`scale-105` on selected cell** — can cause visual jitter as cells reflow. Should use `scale-[1.02]` or remove the scale entirely and use a ring.
3. **Inline `style={{ backgroundColor: themeColor }}`** — breaks dark mode because the color doesn't change for dark. Should use a CSS variable approach or compute dark variant.
4. **No hover tooltip** on the Gregorian sub-label — users can see there's a date but can't quickly tell which month.

### 1.10 ZemenMiniCalendar Specific Issues

1. **`rounded-full` day cells** — looks like a toggle/radio button group, not a calendar. Every other calendar in the library uses rounded rects. This is the most visually inconsistent element in the system.
2. **`gap-0` on grids** — cells are flush, no breathing room. Makes the mini calendar feel cramped.
3. **Selected state uses `bg-emerald-600 text-white`** while ZemenCalendar uses `themeColor` — inconsistent selection visual language within the same library.
4. **Holiday badge** uses negative positioning (`-top-0.5 -right-0.5`) that overlaps the day cell — on small viewports the badge bleeds out of the cell boundary.

### 1.11 Other Notable Inconsistencies

- **Today button** in CalendarHeader uses `px-3 py-1.5 text-xs font-bold rounded-lg` while the **Calendar toggle** next to it uses `gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border` — the toggle has a border but the today button doesn't. They're right next to each other and look unrelated.
- **Task priority colors** are consistent (red/high, yellow/medium, blue/low) but the saturation varies: TaskCard uses `bg-red-100` while TaskPill uses `bg-red-50`, TaskTimeline uses `bg-red-50`. Three different lightness levels for the same semantic color.
- **Focus ring placement**: Calendar cells use no focus ring (rely on click), DatePicker trigger uses `focus:ring-2 focus:ring-[#0B3D16]`, QuickAdd inputs use `focus:ring-emerald-500/50`, TaskForm inputs use `focus:ring-emerald-500/50`. Every interactive element should have a consistent focus ring approach.

---

## 2. Token System

### 2.1 Color

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `surface` | `#ffffff` (white) | `#111827` (gray-900) | Component containers, cards, dropdowns |
| `surface-elevated` | `#ffffff` | `#1e293b` (slate-800) | Modals, popovers, dialogs (one step above surface) |
| `surface-hover` | `#f9fafb` (gray-50) | `#1f2937` (gray-800) | Hover state for interactive surfaces |
| `border` | `#e5e7eb` (gray-200) | `#374151` (gray-700) | Borders, dividers, separators |
| `border-subtle` | `#f3f4f6` (gray-100) | `#374151/50` (gray-700/50) | Subtle borders, dashed lines |
| `text-primary` | `#111827` (gray-900) | `#f3f4f6` (gray-100) | Primary content text |
| `text-secondary` | `#6b7280` (gray-500) | `#9ca3af` (gray-400) | Secondary/supporting text |
| `text-tertiary` | `#9ca3af` (gray-400) | `#6b7280` (gray-500) | Placeholder, disabled, metadata |
| `accent` | `#059669` (emerald-600) | `#34d399` (emerald-400) | Primary accent — selected dates, active states, primary buttons |
| `accent-subtle` | `#ecfdf5` (emerald-50) | `#064e3b/30` (emerald-900/30) | Subtle accent backgrounds |
| `danger` | `#ef4444` (red-500) | `#fca5a5` (red-300) | High-priority tasks, destructive actions |
| `warning` | `#eab308` (yellow-500) | `#fde047` (yellow-300) | Medium-priority tasks |
| `info` | `#3b82f6` (blue-500) | `#93c5fd` (blue-300) | Low-priority tasks |
| `today` | accent-subtle (light) / accent-subtle (dark) | Today highlight — consistent across all calendars |

Key changes from current state:
- **Unified surface**: `#111827` replaces the scattered `dark:bg-gray-800`, `dark:bg-[#111827]/50`, etc.
- **Single accent**: emerald-600 light / emerald-400 dark replaces the `#0B3D16` hardcode, themeColor mechanism stays for consumer customization but default changes.
- **Single danger/warning/info**: semantic colors consolidated to one shade each (currently: red-50/100/200/300/400/500/600/700 — 8 variants, condensed to 2).

### 2.2 Typography

**Currently loaded fonts** (in apps/web): none explicitly — relies on system font stack (`font-sans` in Tailwind resolves to system UI fonts).

**Proposal:**

| Role | Font | Weight | Size scale |
|------|------|--------|------------|
| Display (dates, calendar headers) | System UI (`font-sans`) | Bold (700) | `text-xs` through `text-lg` |
| Body (labels, task titles, descriptions) | System UI (`font-sans`) | Normal/Medium (400/500) | `text-[10px]` through `text-sm` |
| Numerals (day numbers, year) | System UI tabular | Bold | Same as body |

**No new typeface load.** Justification: The library is installed into consumer apps — requiring a font download would be a friction point. Ethiopian/Ge'ez personality lives elsewhere (see §3). The `font-sans` Tailwind default resolves to system-appropriate sans-serif on every platform (SF Pro on macOS/iOS, Segoe UI on Windows, Roboto/Noto on Android).

**Size scale (consolidated):**

| Token | Value | Used for |
|-------|-------|----------|
| `text-[10px]` | 10px | Sub-labels, metadata, badges, holiday text |
| `text-xs` | 12px | Weekday headers, task times, priority badges, secondary buttons |
| `text-sm` | 14px | Day numbers in month/year views, task titles, header labels |
| `text-base` | 16px | Dialog headings, primary navigation labels |

Current state uses `text-[13px]`, `text-[11px]`, `text-[9px]`, `text-[8px]` — these arbitrary sizes are the first to go.

### 2.3 Spacing

**Base unit: 4px** (Tailwind's default `1` = 4px).

| Token | px | rem | Used for |
|-------|----|-----|----------|
| `space-1` | 4 | 0.25 | Tight inner gaps (grid cells) |
| `space-1.5` | 6 | 0.375 | Compact padding (badges, pills) |
| `space-2` | 8 | 0.5 | Input padding, small gaps |
| `space-3` | 12 | 0.75 | **Standard container padding** |
| `space-4` | 16 | 1 | Section gaps, dialog padding |
| `space-5` | 20 | 1.25 | Large dialog padding |
| `space-6` | 24 | 1.5 | View-level gaps between sections |

**Every component's outer padding becomes `p-3`** (12px) — no exceptions. Currently ranges from 0 to 24. Exceptions: fullscreen dialogs (QuickAdd/TaskForm) use `p-5` (20px) for breathing room.

**Grid gaps standardized:**
- Day grids (Calendar, DateRangePicker, MonthView): `gap-0.5` (2px)
- Mini grids (MiniCalendar, YearView mini): `gap-px` (1px) — tighter for compact format
- Column gaps (WeekView): `gap-2` (8px) stays

### 2.4 Radius

| Token | Value | Used for |
|-------|-------|----------|
| `radius-sm` | 4px (`rounded`) | Badges, pills, small buttons |
| `radius-md` | 8px (`rounded-lg`) | **All day cells, nav buttons, inputs, cards** |
| `radius-lg` | 12px (`rounded-xl`) | Outer containers, modals, dropdowns |
| `radius-full` | 9999px | Status dots (only) |

**`radius-md` (8px) becomes the universal cell/button radius.** Every day cell in every calendar uses `rounded-lg`/`radius-md`. The MiniCalendar's current `rounded-full` is removed — cells become `rounded-lg` to match the rest of the calendar family. The DateRangePicker `rounded-2xl` dropdown is reduced to `rounded-xl`/`radius-lg`.

---

## 3. Ethiopian-Calendar Personality

### The Core Idea

**One signature element, not scattered motifs.** The design personality comes from two careful choices:

### 3.1 The Accent Color: Meskel Yellow (#D97706 / amber-600 → #FBBF24 / amber-400)

I considered keeping pure emerald (the current accent), but here's the reasoning:

- **Meskel** (መስቀል / Finding of the True Cross) is one of Ethiopia's most important holidays, celebrated in September (Meskerem). The Meskel flower (yellow daisy, *ቢራቢሮ* / *ye Meskel aka*) carpets the highlands during the holiday. It's visually striking, specifically Ethiopian, and **not** the expected "green/warm/earthy" cliché.
- **Practical**: Amber-600 light / amber-400 dark provides excellent contrast against both white and dark gray surfaces. It pairs well with the existing emerald priority colors (which remain at their current semantic assignments).
- **One place where amber takes over**: The `ZemenCalendarHeader` month/year label — currently `text-gray-900 dark:text-gray-100`, it becomes amber-600/amber-400. This is the most visible text in every view. Every time a user looks at a calendar, they see the amber month/year and are subtly reminded this is not a generic calendar.
- **Everything else stays emerald** — selection highlights, today indicators, primary buttons. The amber is a deliberate, sparingly used accent on the most prominent text.

**Eliminated alternatives considered:**
- Ethiopian flag green/yellow/red — too cliché, too noisy
- "Earthy" terracotta — could belong to any Southwest or Mediterranean product
- Deep purple — has no Ethiopian connection

### 3.2 The Typographic Detail: Ethiopic Wordspace (፡) as Separator

- Currently, the month/year display uses a slash or bullet as separator (e.g., "Meskerem • 2017" or "September / 2025").
- The Ethiopic wordspace character **፡** (U+1361, called *araki*) looks like a colon without the dots — a subtle vertical line pair. It's the standard word separator in Ethiopic script.
- **Where**: Exactly one place — the month/year label in `ZemenCalendarHeader`. Becomes `"Meskerem ፡ 2017"` or `"September ፡ 2025"`.
- This is invisible to users who don't notice it, and a delightful nod for those who do. It doesn't require any font support (the character is in the Basic Multilingual Plane and has a glyph in every system font).

### 3.3 Where NOT to Put Personality

- No Ge'ez script anywhere in the default English UI (that's what the `locale="am"` prop is for)
- No Ethiopian flag colors
- No decorative border patterns or "traditional" motifs
- No special empty-state illustrations (the empty state stays clean and minimal)

---

## 4. Interaction Patterns

### 4.1 System-Wide Hover/Focus/Active

| State | Visual | Duration | Notes |
|-------|--------|----------|-------|
| **Hover** (cells, buttons, pills) | `bg-gray-50`/`dark:bg-gray-800` | `duration-150` | Current `duration-200` is slightly slow — `150` feels snappier |
| **Focus** (keyboard) | `ring-2 ring-emerald-500/50` | `duration-150` | Every interactive element gets this. Currently missing on Calendar cells |
| **Active/Pressed** | `scale-[0.97]` + same hover bg | `duration-100` | Quick tactile feedback. Currently only in `globals.css` btn-primary/btn-secondary — not applied to cells |
| **Selected** | Accent bg + subtle ring-2 | `duration-200` | Same across all calendars (one pattern to rule them) |

### 4.2 Specific Named Interactions

1. **Day cell selection**: `scale-[1.02]` (not current `scale-105`) with accent background + subtle shadow. Removes the `z-10` stacking to avoid layout overlap. Standard duration `200`.

2. **Popover open/close** (DatePicker, DateRangePicker): Keep the existing `animate-in fade-in slide-in-from-top-2` on open. Add `fade-out duration-150` on close (currently instant — feels jarring).

3. **Drag-and-drop visual feedback**: Already partially done (TaskTimeline has `hover:shadow-md` on pills, drop target `border-emerald-400 bg-emerald-50/40`). **Add**: ghost image opacity reduced to 50% during drag (via `onDragStart` setting `e.dataTransfer.effectAllowed` + inline opacity on the original element), and a subtle pulse animation on the drop target zone.

4. **Task pill click in MonthView**: Already has `transition-colors`. Add a brief `scale-[0.95]` on mousedown (not click — prevents animation on keyboard activation) for tactile feel.

5. **Header navigation arrows**: Rotating chevrons on DatePicker trigger — keep this (it's good). Add a subtle horizontal slide for the month/year text when navigating months: new content fades in from the direction of navigation. Current behavior is instant swap.

6. **M key move mode (accessibility)**: Current implementation is purely functional (ring highlight on the task). Add a brief `animate-pulse` on the task pill for the first 500ms after M is pressed to draw the user's attention to what's now in move mode.

---

## 5. Light & Dark Mode Explicit Values

### 5.1 Light Mode

| Element | Value |
|---------|-------|
| App body | `#f9fafb` (gray-50) |
| Component surface (containers, cards) | `#ffffff` (white) |
| Input/field surface | `#ffffff` (white) |
| Hover surface | `#f9fafb` (gray-50) |
| Border (default) | `#e5e7eb` (gray-200) |
| Border (subtle) | `#f3f4f6` (gray-100) |
| Text primary | `#111827` (gray-900) |
| Text secondary | `#6b7280` (gray-500) |
| Text tertiary | `#9ca3af` (gray-400) |
| Accent (selection, primary btn) | `#059669` (emerald-600) |
| Accent subtle bg | `#ecfdf5` (emerald-50) |
| Header month/year | `#d97706` (amber-600) |
| Today highlight | `bg-emerald-50` + `font-bold + ring-1 ring-emerald-300` |

### 5.2 Dark Mode

| Element | Value |
|---------|-------|
| App body | `#0a0e17` (kept from layout.tsx — proven) |
| Component surface (containers, cards) | `#111827` (gray-900) |
| Surface elevated (modals, popovers, dialogs) | `#1e293b` (slate-800) |
| Input/field surface | `#1f2937` (gray-800) |
| Hover surface | `#1f2937` (gray-800) |
| Border (default) | `#374151` (gray-700) |
| Border (subtle) | `#374151/50` (gray-700/50) |
| Text primary | `#f3f4f6` (gray-100) |
| Text secondary | `#9ca3af` (gray-400) |
| Text tertiary | `#6b7280` (gray-500) |
| Accent | `#34d399` (emerald-400) |
| Accent subtle bg | `#064e3b/30` (emerald-900/30) |
| Header month/year | `#fbbf24` (amber-400) |
| Today highlight | `bg-emerald-900/20` + `font-bold + ring-1 ring-emerald-600/50` |

---

## 6. Component-Specific Fix List

### 6.1 ZemenCalendar (3 changes) — ✅ Already implemented

1. **Default `themeColor` → emerald-600.** The inline style `{ backgroundColor: themeColor }` stays (keeps consumer customization), but the default shifts from `#0B3D16` to `#059669` (emerald-600). **Dark mode**: selected cell gets `emerald-400` — computed by checking dark class, or via a CSS variable approach.
2. **`scale-105` → `scale-[1.02]`** on selected state. Reduces visual jitter.
3. **Add `ring-2 ring-emerald-500/50` focus state** on day cells — currently only clickable, not keyboard-navigable visible focus. Add via `focus-visible:`.

### 6.2 ZemenDatePicker (4 changes) — ✅ Already implemented

1. **Trigger padding**: `px-4 py-3` → `px-3 py-2` to match every other input in the system.
2. **Focus ring**: `focus:ring-[#0B3D16]` → `focus:ring-emerald-500/50` to match system standard.
3. **Popover inner padding**: `p-1` → `p-0` (inner Calendar already has its own `p-3` from the unified container padding).
4. **Fixed width**: `w-[280px]` → remove fixed width; let Calendar's natural width determine it.

### 6.3 ZemenDateRangePicker (3 changes) — ⚡ 1/2 done

1. **Calendar toggle button**: `px-2 py-1 text-[10px]` → `px-3 py-1.5 text-xs` — ✅ Done
2. **Range "in" state dark mode**: `dark:bg-emerald-900/20` stays — already correct
3. **Container padding**: Dual-calendar layout should keep `p-3` (12px) — no change needed

### 6.4 ZemenMiniCalendar (4 changes) — ⚡ 4/4 done

1. **Day cell radius**: `rounded-full` → `rounded-lg` — ✅ Done
2. **Grid gap**: `gap-0` → `gap-px` — ✅ Done
3. **Selected cell bg**: added `dark:bg-emerald-500` — ✅ Done
4. **Holiday badge positioning**: `-top-0.5 -right-0.5` → `top-0 right-0 translate-x-1/4 -translate-y-1/4` — ✅ Done

### 6.5 System-Wide Changes (applied to all components) — ⚡ Partial

1. **Input fields** — ✅ Already matched (`px-3 py-2 text-sm rounded-lg`, DatePicker uses `focus:ring-emerald-500/50`)
2. **Icon buttons** — ⚡ Partial. MiniCalendar nav updated (`h-6 w-6` → `h-7 w-7`, `rounded` → `rounded-lg`). CalendarHeader and DayView at `h-8 w-8` are on target.
3. **Text size cleanup** — ⚡ Partial. Fixed: YearView `text-[8px]` → `text-[10px]`, HolidayBadge `text-[9px]` → `text-[10px]`, TaskTimeline all-day `text-[9px]` → `text-[10px]`. Remaining: MonthView `text-[10px]` sub-labels, MiniCalendar `text-[11px]` day numbers, AgendaView `text-[11px]` date labels — these are near-standard and acceptable.
4. **Priority color variants** — ✅ Done. TaskCard priority badges: `bg-*-100` → `bg-*-50`. TaskCard dark surfaces: `dark:bg-*-900/15` → `dark:bg-*-900/20` (unified with TaskPill/TaskTimeline).

### 6.6 Additional Fixes Applied Beyond Original Plan

1. **ZemenCalendarHeader — amber month/year**: `text-gray-900` → `text-amber-600 dark:text-amber-400` — ✅ Done
2. **ZemenCalendarHeader — Ethiopic wordspace**: `/` separator → `፡` (፡) — ✅ Done
3. **ZemenCalendarHeader — toggle button border removed**: now matches Today button styling — ✅ Done
4. **ZemenMiniCalendar — weekday labels**: `text-[9px]` → `text-[10px]` for consistency with other weekday headers — ✅ Done
5. **ZemenMiniCalendar — day cells**: added `duration-150` transition, unifies hover timing — ✅ Done

---

## 7. Self-Critique

### What I changed after reviewing my own proposal

1. **Amber month/year was initially going to also affect selected-date highlighting.** I walked this back — the amber is only the month/year label in CalendarHeader. Selection highlighting stays emerald. Reason: amber as a selection color would conflict with the warning/yellow priority color (medium-priority tasks). Having yellow/amber mean two different things in different contexts is confusing.

2. **I initially proposed the Ethiopic wordspace ፡ for the empty state too** (as a secondary personality touchpoint). I removed it. Reason: the design principle is ONE signature element, not two. The wordspace belongs only in CalendarHeader. Adding it to the empty state dilutes the effect.

3. **The "interactive feel" section originally proposed a custom easing curve (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for the cell selection bounce.** I removed it. Reason: Tailwind's default `ease-out` (`cubic-bezier(0, 0, 0.2, 1)`) is proven, accessible, and doesn't require custom configuration that consumers would need to replicate. A custom curve is a micro-optimization that adds no real personality and costs maintainability.

### Open questions

- Should the `themeColor` prop be deprecated entirely in favor of CSS variable-based theming? It's useful for consumer apps that want their brand color on selected dates, but the current inline-style approach doesn't support dark mode. **Proposal**: Keep `themeColor` for backward compatibility but add a CSS variable fallback (`--zemen-accent`) in a follow-up phase.
- The MiniCalendar is a "mini" version — should it diverge from the full Calendar's visual language at all, or should it be visually identical but smaller? **Answer**: visually identical (same radii, same colors), just physically smaller layout.

---

## Summary of Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Container padding | `p-3` (12px) universal | Eliminates 6-way inconsistency |
| Cell radius | `rounded-lg` (8px) universal | Eliminates 4-way inconsistency (MiniCalendar loses circles) |
| Accent color | Emerald (selection) + Amber (header text) | Amber = Meskel flower reference, emerald = existing semantic |
| Type scale | 4 sizes: 10px, 12px, 14px, 16px | Eliminates arbitrary `text-[13px]` etc. |
| Dark surface | `#111827` (components), `#0a0e17` (app body) | Already partially implemented |
| Hover speed | `duration-150` (was `duration-200`) | Feels more responsive |
| Focus ring | `ring-2 ring-emerald-500/50` everywhere | Currently missing on Calendar cells |
| Personality location | CalendarHeader month/year only | One place, not scattered |
| Personality color | Amber on month/year | Meskel flower reference |
| Personality type | ፡ (Ethiopic wordspace) separator | Subtle, font-independent |
