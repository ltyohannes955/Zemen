import * as React from 'react';
import { Markdown } from './Markdown';
import { CodeBlock } from './CodeBlock';
import { PropsTable } from './PropsTable';
import type { PropDef } from './PropsTable';
import { PlaygroundPlaceholder } from './PlaygroundPlaceholder';
import { ZemenMonthViewPlayground } from './playground/MonthViewPlayground';
import { ZemenCalendarPlayground } from './playground/CalendarPlayground';
import { ZemenDatePickerPlayground } from './playground/DatePickerPlayground';
import { ZemenDateRangePickerPlayground } from './playground/DateRangePickerPlayground';
import { ZemenWeekViewPlayground } from './playground/WeekViewPlayground';
import { ZemenDayViewPlayground } from './playground/DayViewPlayground';
import { ZemenYearViewPlayground } from './playground/YearViewPlayground';
import { ZemenAgendaViewPlayground } from './playground/AgendaViewPlayground';
import { ZemenTaskTimelinePlayground } from './playground/TaskTimelinePlayground';
import { ZemenTaskCardPlayground } from './playground/TaskCardPlayground';
import { ZemenTaskPillPlayground } from './playground/TaskPillPlayground';
import { ZemenHolidayBadgePlayground } from './playground/HolidayBadgePlayground';
import { ZemenEmptyStatePlayground } from './playground/EmptyStatePlayground';
import { ZemenCalendarHeaderPlayground } from './playground/CalendarHeaderPlayground';
import { ZemenMiniCalendarPlayground } from './playground/MiniCalendarPlayground';
import { ZemenQuickAddPlayground } from './playground/QuickAddPlayground';
import { ZemenTaskFormPlayground } from './playground/TaskFormPlayground';

export type DocSection = {
  id: string;
  heading: string;
  content: JSX.Element;
};



export type DocPage = {
  slug: string;
  title: string;
  description: string;
  sections: DocSection[];
};

function page(slug: string, title: string, description: string, sections: DocSection[]): DocPage {
  return { slug, title, description, sections };
}

function md(text: string): JSX.Element {
  return <Markdown text={text} />;
}

function code(code: string, lang?: string): JSX.Element {
  return <CodeBlock code={code} lang={lang} />;
}

function playground(component: string): JSX.Element {
  return <PlaygroundPlaceholder componentName={component} />;
}

function propsTable(defs: PropDef[]): JSX.Element {
  return <PropsTable props={defs} />;
}

/* -------------------------------------------------------------------------- */
/*  Getting Started                                                           */
/* -------------------------------------------------------------------------- */

const INTRODUCTION_SECTIONS: DocSection[] = [
  {
    id: 'what-is-zemen',
    heading: 'What is Zemen?',
    content: md(`
Zemen is a React component library that synchronizes Ethiopian and Gregorian calendars. It provides
drop-in calendar views, date pickers, and task management components — all with full support for
the Ethiopian calendar system.

Built for developers who need to handle dates across both systems without manually converting
between them. Zemen handles the calendar math so your application can focus on user experience.
    `),
  },
  {
    id: 'core-features',
    heading: 'Core Features',
    content: md(`
• **Dual-calendar support** — Every component accepts a \`calendar\` prop to switch between Ethiopian and Gregorian
• **Zero-dependency date math** — \`@zemen/core\` performs all conversions without third-party date libraries
• **Accessible** — WAI-ARIA grid semantics, roving tabindex, keyboard navigation, \`aria-live\` announcements
• **Dark mode** — Tailwind \`dark:\` variants throughout, respects \`dark\` class on \`<html>\`
• **Task-aware** — Views accept tasks and render them with priority colors, drag-and-drop rescheduling
• **Multi-day & all-day** — Tasks can span multiple days or be marked as all-day events
• **Localized** — Ge'ez numerals (\`፩ ፪ ፫\`) and Amharic month names, toggled via \`locale\` prop
    `),
  },
  {
    id: 'packages',
    heading: 'Packages',
    content: md(`
Zemen is organized as a monorepo with three packages:

• **\`@zemen/core\`** — Pure TypeScript calendar engine: conversions, day-of-week, leap year checks, Ge'ez numerals, holiday lookup
• **\`@zemen/react\`** — React components built on \`@zemen/core\`: views, pickers, forms, accessibility hooks
• **\`@zemen/scheduler\`** — Shared types and utilities for task scheduling (optional, bring your own types if preferred)
    `),
  },
  {
    id: 'browser-support',
    heading: 'Browser Support',
    content: md(`
Zemen targets modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions). The components use
HTML5 Drag and Drop API and ES2022 features. Internet Explorer is not supported.
    `),
  },
];

const INSTALLATION_SECTIONS: DocSection[] = [
  {
    id: 'quick-install',
    heading: 'Quick Install',
    content: md(`
\`\`\`bash
npm install @zemen/react @zemen/core
\`\`\`

If you plan to use task scheduling utilities or share task types with a backend:

\`\`\`bash
npm install @zemen/scheduler
\`\`\`
    `),
  },
  {
    id: 'tailwind-setup',
    heading: 'Tailwind CSS Setup',
    content: md(`
\`@zemen/react\` uses Tailwind CSS for styling. Your project must have Tailwind CSS v3 configured.

**1. Add the package to your Tailwind content paths:**

\`\`\`js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@zemen/react/dist/**/*.js',  // ← scan Zemen classes
  ],
  darkMode: 'class', // or 'media' depending on your project
  theme: { extend: {} },
  plugins: [],
};
\`\`\`

**2. Import the component styles in your app entry:**

\`\`\`tsx
// app/globals.css or _app.tsx
import '@zemen/react/styles.css';
\`\`\`

No additional CSS setup is needed — all component styles come bundled.
    `),
  },
  {
    id: 'font-recommendation',
    heading: 'Font Recommendation',
    content: md(`
For Ethiopian text rendering (Amharic month names, Ge'ez numerals), include \`Noto Sans Ethiopic\` in
your font stack:

\`\`\`css
font-family: 'Geist', 'Noto Sans Ethiopic', sans-serif;
\`\`\`

You can self-host \`Noto Sans Ethiopic\` via Google Fonts or bundle it with your application.
    `),
  },
];

const QUICK_START_SECTIONS: DocSection[] = [
  {
    id: 'basic-usage',
    heading: 'Basic Usage',
    content: md(`
\`\`\`tsx
import { ZemenMonthView } from '@zemen/react';
import '@zemen/react/styles.css';

function App() {
  const handleDayClick = (info) => {
    console.log('Clicked:', info.ethiopian, info.gregorian);
  };

  return (
    <ZemenMonthView
      calendar="ethiopian"
      locale="en"
      onDayClick={handleDayClick}
    />
  );
}
\`\`\`

This renders a full month grid in the Ethiopian calendar with:
- Navigation to switch months
- Gregorian date shown as a secondary label on each cell
- Today highlighted with emerald styling
- Keyboard navigation via arrow keys
    `),
  },
  {
    id: 'adding-tasks',
    heading: 'Adding Tasks',
    content: md(`
Pass tasks as an array of \`ViewTask\` objects. Tasks are rendered as colored pills within each day cell.

\`\`\`tsx
const tasks = [
  {
    id: '1',
    title: 'Team standup',
    dateType: 'gregorian',
    primaryYear: 2024, primaryMonth: 10, primaryDay: 15,
    time: '09:00',
    priority: 'high',
    status: 'pending',
  },
];

<ZemenMonthView tasks={tasks} onTaskClick={(t) => alert(t.title)} />
\`\`\`
    `),
  },
  {
    id: 'switching-calendars',
    heading: 'Switching Calendars',
    content: md(`
Every view accepts a \`calendar\` prop that toggles between Ethiopian and Gregorian display:

\`\`\`tsx
<ZemenMonthView calendar="gregorian" />
\`\`\`

When \`calendar="ethiopian"\`, the grid shows Ethiopian months (Meskerem through Pagume) with
Gregorian dates as secondary labels. When \`calendar="gregorian"\`, the inverse applies.
    `),
  },
];

/* -------------------------------------------------------------------------- */
/*  Concepts                                                                  */
/* -------------------------------------------------------------------------- */

const ETHIOPIAN_CALENDAR_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    heading: 'Overview',
    content: md(`
The Ethiopian calendar (also called the Ge'ez calendar) is the primary calendar used in Ethiopia.
It is based on the Coptic calendar but with different saint days and a unique year numbering.

Unlike the Gregorian calendar, the Ethiopian calendar is **7–8 years behind** (depending on the
time of year) and has a **13-month structure** that surprises many developers.
    `),
  },
  {
    id: 'thirteen-months',
    heading: 'The 13-Month Year',
    content: md(`
The Ethiopian year has 12 months of 30 days each, plus a 13th month called **Pagume** (ጳጉሜን)
with 5 or 6 days:

| Month # | Name (English) | Name (Amharic) | Days |
|---------|---------------|----------------|------|
| 1 | Meskerem | መስከረም | 30 |
| 2 | Tikimt | ጥቅምት | 30 |
| 3 | Hidar | ኅዳር | 30 |
| 4 | Tahsas | ታኅሣሥ | 30 |
| 5 | Tir | ጥር | 30 |
| 6 | Yekatit | የካቲት | 30 |
| 7 | Megabit | መጋቢት | 30 |
| 8 | Miazia | ሚያዝያ | 30 |
| 9 | Genbot | ግንቦት | 30 |
| 10 | Sene | ሰኔ | 30 |
| 11 | Hamle | ሐምሌ | 30 |
| 12 | Nehase | ነሐሴ | 30 |
| 13 | Pagume | ጳጉሜን | 5–6 |

**Key insight:** When coding calendar UI, the 13th month means your month arrays need \`13\` slots
when \`calendar === 'ethiopian'\`, while month indexes stay \`1–13\` (not zero-indexed).
    `),
  },
  {
    id: 'leap-rule',
    heading: 'Leap Year Rule',
    content: md(`
The Ethiopian leap year rule is simpler than the Gregorian one:

> **An Ethiopian year is leap if \`(year + 1) % 4 === 0\`**

In practice, this means Ethiopian years 3, 7, 11, 15, 19, 23... are leap — adding a 6th day to Pagume.

**This is NOT aligned with Gregorian leap years.** The offset was chosen so that the Ethiopian leap
year occurs in the Gregorian leap year's preceding year. For example, 2015 Ethiopian (2022–2023 Gregorian)
is leap — Pagume has 6 days.
    `),
  },
  {
    id: 'anchor-date',
    heading: 'Anchor Date (Epoch)',
    content: md(`
The Ethiopian calendar is anchored at:

> **Ethiopian 1 Meskerem 1 = Gregorian 29 August, 8 CE (Julian) / 27 August, 8 CE (Gregorian proleptic)**

\`@zemen/core\` uses the standard conversion formula based on the **Era of Martyrs** epoch. All
conversions in \`toGregorian\` and \`toEthiopian\` follow the same algorithm used by the Ethiopian
Orthodox Church.

The year offset between calendars is approximately 7–8 years:
- Ethiopian New Year (Meskerem 1 / Enkutatash) falls on Gregorian September 11 (or 12 in leap years)
- Before New Year, the offset is ≈ 8 years; after New Year, ≈ 7 years
    `),
  },
  {
    id: 'conversion-formula',
    heading: 'Conversion Formula (Simplified)',
    content: md(`
\`@zemen/core\` handles all conversions internally via \`toGregorian()\` and \`toEthiopian()\`.
For reference, the conversion logic follows this approximate formula:

\`\`\`
Gregorian year ≈ Ethiopian year + 7 (or + 8 before Ethiopian New Year)
Ethiopian New Year → Gregorian September 11 (or 12 after Gregorian leap year)
\`\`\`

You should never need to implement this yourself — use the library functions. This reference is
provided for debugging and understanding edge cases.
    `),
  },
];

const THEMING_SECTIONS: DocSection[] = [
  {
    id: 'dark-mode',
    heading: 'Dark Mode',
    content: md(`
All Zemen components use Tailwind's \`dark:\` variant for dark mode styling. They respond to the
\`dark\` CSS class on the \`<html>\` element. No additional Zemen-specific theming is required.

**If your app uses \`darkMode: 'class'\` in Tailwind (recommended):**
- Toggle \`dark\` class on \`<html>\` to switch themes
- All Zemen components will automatically adjust their backgrounds, text colors, borders, and hover states

\`\`\`tsx
<html className="dark"> {/* or 'light' */ }
\`\`\`

**If your app uses \`darkMode: 'media'\`:**
- Zemen components follow the OS preference automatically
- No JavaScript theming toggle needed
    `),
  },
  {
    id: 'theme-provider',
    heading: 'ThemeProvider Integration',
    content: md(`
Zemen does **not** ship its own ThemeProvider — it relies on your project's existing dark mode setup.
The \`apps/web\` reference app uses a lightweight custom ThemeProvider:

\`\`\`tsx
// stores theme in localStorage, toggles 'dark' class on <html>
<ThemeProvider>
  <ZemenMonthView calendar="ethiopian" />
</ThemeProvider>
\`\`\`

You can use \`next-themes\`, a custom provider, or any other approach. The only requirement is
that the \`dark\` class on \`<html>\` reflects the active theme.
    `),
  },
  {
    id: 'calendar-toggle',
    heading: 'Calendar Toggle',
    content: md(`
Components that accept a \`calendar\` prop can be toggled between Ethiopian and Gregorian display
at runtime:

\`\`\`tsx
const [cal, setCal] = useState<'ethiopian' | 'gregorian'>('ethiopian');

<ZemenMonthView
  calendar={cal}
  // When calendar changes, the view preserves the navigation position
  // by converting the currently displayed month/year
/>
\`\`\`

The \`ZemenCalendarHeader\` component has an \`onCalendarToggle\` callback that many views
wire up to a toggle button (shown as flag emoji buttons in the reference app).
    `),
  },
];

const LOCALIZATION_SECTIONS: DocSection[] = [
  {
    id: 'locale-prop',
    heading: 'The locale Prop',
    content: md(`
All view components accept a \`locale\` prop with two supported values:

- **\`'en'\`** (default) — Arabic numerals (1, 2, 3...), English month names
- **\`'am'\`** — Ge'ez numerals (፩, ፪, ፫...), Amharic month names where applicable

\`\`\`tsx
<ZemenMonthView locale="am" />  {/* Shows ፩, ፪, ፫... */}
<ZemenMonthView locale="en" />  {/* Shows 1, 2, 3... */}
\`\`\`

When \`locale="am"\`, every rendered date number (day, year) is converted via \`formatNumber(n, 'am')\`
from \`@zemen/core\`, which delegates to \`toGeezNumerals()\`.
    `),
  },
  {
    id: 'geez-numerals',
    heading: 'Ge\'ez Numerals',
    content: md(`
The \`@zemen/core\` package exports two functions for Ge'ez numeral support:

- **\`toGeezNumerals(n: number): string\`** — Converts an integer to Ge'ez numeral characters
- **\`formatNumber(n: number, locale: 'en' | 'am'): string\`** — Forwards to \`toGeezNumerals\` when \`locale === 'am'\`; otherwise returns the number as-is

The Ge'ez numeral system uses a combination of ones, tens, hundreds, and thousands characters.
For example:
- 1 → ፩, 10 → ፲, 100 → ፻, 1000 → ፲፻
- 2024 → ፳፻፳፬ (20 × 100 + 24)
- 9999 → ፺፱፻፺፱፻ (well-formed up to 10,000+)
    `),
  },
  {
    id: 'adding-languages',
    heading: 'Adding New Languages',
    content: md(`
Currently \`locale\` supports \`'en'\` and \`'am'\` only. The \`@zemen/core\` package's \`getMonthName\`
function accepts a \`Locale\` type defined as \`'en' | 'am'\`.

To add a new locale, updates would be needed in:

1. **\`@zemen/core\`** — \`Locale\` type, \`getMonthName\`, \`formatNumber\`
2. **\`@zemen/react\`** — \`locale\` prop type on each component, day name arrays in components

Contributions via pull request are welcome.
    `),
  },
];

/* -------------------------------------------------------------------------- */
/*  Component page template helper                                            */
/* -------------------------------------------------------------------------- */

function componentPage(
  slug: string,
  title: string,
  description: string,
  installCode: string,
  props: PropDef[],
  usageExtra: string,
  a11yNotes: string,
  playgroundContent?: JSX.Element,
): DocPage {
  return page(slug, title, description, [
    { id: 'playground', heading: 'Playground', content: playgroundContent ?? playground(title) },
    { id: 'installation', heading: 'Installation', content: code(installCode) },
    { id: 'props', heading: 'Props', content: propsTable(props) },
    { id: 'usage', heading: 'Usage', content: md(usageExtra) },
    { id: 'accessibility', heading: 'Accessibility', content: md(a11yNotes) },
  ]);
}

/* -------------------------------------------------------------------------- */
/*  All pages                                                                 */
/* -------------------------------------------------------------------------- */

export const DOC_PAGES: DocPage[] = [
  /* -- Getting Started -- */
  page('introduction', 'Introduction', 'What is Zemen and why you should use it', INTRODUCTION_SECTIONS),
  page('installation', 'Installation', 'Install Zemen packages in your project', INSTALLATION_SECTIONS),
  page('quick-start', 'Quick Start', 'Get up and running with Zemen in minutes', QUICK_START_SECTIONS),

  /* -- Concepts -- */
  page('concepts/ethiopian-calendar', 'Ethiopian Calendar', 'Understanding the 13-month year, Pagume, and leap year rules', ETHIOPIAN_CALENDAR_SECTIONS),
  page('concepts/theming', 'Theming', 'Dark mode, ThemeProvider integration, and calendar toggling', THEMING_SECTIONS),
  page('concepts/localization', 'Localization', 'Locale support, Ge\'ez numerals, and adding new languages', LOCALIZATION_SECTIONS),

  /* -- Date Pickers -- */
  componentPage(
    'components/calendar', 'Calendar',
    'A standalone month-grid calendar with date selection.',
    `npm install @zemen/react`,
    [
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display language for day names and numerals' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'ethiopian'`, description: 'Which calendar system to display' },
      { name: 'onSelectDate', type: `(date: SelectedDateInfo) => void`, default: '—', description: 'Called when a day cell is activated (click or Enter/Space)' },
      { name: 'selectedDate', type: `{ ethYear, ethMonth, ethDay } \\| null`, default: '—', description: 'Controlled selected date; applies themeColor highlight' },
      { name: 'themeColor', type: 'string', default: `'#0B3D16'`, description: 'Background color for the selected date cell' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes for the root element' },
    ],
    `\
Controlled selection:

\`\`\`tsx
const [sel, setSel] = useState<SelectedDateInfo | null>(null);

<ZemenCalendar
  selectedDate={sel}
  onSelectDate={setSel}
  calendar="ethiopian"
/>
\`\`\`

The \`SelectedDateInfo\` object contains both Ethiopian and Gregorian components of the chosen date:

\`\`\`tsx
type SelectedDateInfo = {
  ethYear: number; ethMonth: number; ethDay: number;
  gregYear: number; gregMonth: number; gregDay: number;
};
\`\`\`
    `,
    `\
The ZemenCalendar implements WAI-ARIA \`grid\` role with:

• **Roving tabindex** — exactly one cell has \`tabindex="0"\`, all others \`-1\`
• **Arrow keys** — navigate between cells in any direction
• **Page Up / Page Down** — navigate between months
• **Enter / Space** — activates \`onSelectDate\` for the focused cell
• **\`aria-label\`** on each cell shows both calendar dates (e.g. "Meskerem 12, 2017 — September 22, 2024")
• **\`aria-current="date"\`** on today's cell
    `,
    <ZemenCalendarPlayground />,
  ),

  componentPage(
    'components/date-picker', 'DatePicker',
    'A dropdown date picker that opens a ZemenCalendar for selection.',
    `npm install @zemen/react`,
    [
      { name: 'value', type: `SelectedDateInfo \\| null`, default: '—', description: 'Currently selected date' },
      { name: 'onChange', type: `(date: SelectedDateInfo) => void`, default: '—', description: 'Called when a date is selected from the calendar' },
      { name: 'placeholder', type: 'string', default: `'Select date'`, description: 'Placeholder text shown when no date is selected' },
      { name: 'themeColor', type: 'string', default: `'#0B3D16'`, description: 'Highlight color for the selected date in the popover' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes for the root element' },
    ],
    `\
\`\`\`tsx
<ZemenDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="Pick a date"
  locale="en"
/>
\`\`\`

The picker renders a button-like input that opens a popover calendar on click. Clicking outside
or selecting a date closes the popover.
    `,
    `\
The DatePicker follows the combobox pattern:

• **Trigger button** — opens/closes the calendar popover
• **Escape** — closes the popover without selecting
• **Calendar navigation** — follows the ZemenCalendar accessibility model when the popover is open
    `,
    <ZemenDatePickerPlayground />,
  ),

  componentPage(
    'components/date-range-picker', 'DateRangePicker',
    'A dual-calendar date range picker for selecting start and end dates.',
    `npm install @zemen/react`,
    [
      { name: 'value', type: `DateRangeValue`, default: '—', description: 'Current range (start and end DateValue, either may be null)' },
      { name: 'onChange', type: `(range: DateRangeValue) => void`, default: '—', description: 'Called when the range changes' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'ethiopian'`, description: 'Calendar system for both pickers' },
      { name: 'minDate', type: `DateValue`, default: '—', description: 'Minimum selectable date' },
      { name: 'maxDate', type: `DateValue`, default: '—', description: 'Maximum selectable date' },
      { name: 'themeColor', type: 'string', default: `'#0B3D16'`, description: 'Highlight color for selected range' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes for the root element' },
    ],
    `\
\`\`\`tsx
const [range, setRange] = useState<DateRangeValue>({ start: null, end: null });

<ZemenDateRangePicker
  value={range}
  onChange={setRange}
  calendar="gregorian"
/>
\`\`\`

Selecting a start date then an end date updates the range. Clicking the same date twice deselects it.
The range is highlighted between the two selected dates.
    `,
    `\
The DateRangePicker uses two ZemenCalendar instances, each following the grid accessibility pattern.
Range state is communicated visually via highlighted cells between start and end.
    `,
    <ZemenDateRangePickerPlayground />,
  ),

  /* -- Calendar Views -- */
  page('components/month-view', 'MonthView',
    'A month-grid calendar view with task rendering and drag-and-drop rescheduling.',
    [
      { id: 'playground', heading: 'Playground', content: <ZemenMonthViewPlayground /> },
      { id: 'installation', heading: 'Installation', content: code(`npm install @zemen/react`) },
      { id: 'props', heading: 'Props', content: propsTable([
        { name: 'year?', type: 'number', default: '—', description: 'Controlled year. When omitted, the view manages its own navigation state.' },
        { name: 'month?', type: 'number', default: '—', description: 'Controlled month (1–13 for Ethiopian, 1–12 for Gregorian). Omit for uncontrolled.' },
        { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'ethiopian'`, description: 'Which calendar system to display' },
        { name: 'tasks', type: `ViewTask[]`, default: `[]`, description: 'Tasks to render as pills in day cells' },
        { name: 'onDayClick', type: `(info: DayClickInfo) => void`, default: '—', description: 'Called when a day cell is clicked' },
        { name: 'onTaskClick', type: `(task: ViewTask) => void`, default: '—', description: 'Called when a task pill is clicked' },
        { name: 'onTaskReschedule', type: `(task, newDate) => void`, default: '—', description: 'Called after a drag-drop or keyboard move completes' },
        { name: 'disableDragDrop', type: 'boolean', default: `false`, description: 'Disables drag-and-drop and keyboard move mode (M key)' },
        { name: 'renderDay', type: `(cell, tasksForDay) => ReactNode`, default: '—', description: 'Custom render function replacing the default day cell content' },
        { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale for numerals' },
        { name: 'isLoading', type: 'boolean', default: `false`, description: 'Shows animated skeleton placeholders when true' },
        { name: 'emptyState', type: `ReactNode`, default: '—', description: 'Custom empty state when tasks array is empty. Defaults to ZemenEmptyState.' },
        { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes for the root element' },
      ]) },
      { id: 'usage', heading: 'Usage', content: md(`\
\`\`\`tsx
import { ZemenMonthView } from '@zemen/react';

function Schedule() {
  return (
    <ZemenMonthView
      calendar="ethiopian"
      tasks={myTasks}
      onDayClick={(info) => console.log(info)}
      onTaskClick={(task) => console.log(task.title)}
      onTaskReschedule={(task, newDate) => {
        // task.reschedule(newDate.year, newDate.month, newDate.day)
      }}
      locale="en"
    />
  );
}
\`\`\`

**Controlled mode:**

\`\`\`tsx
const [year, setYear] = useState(2017); // Ethiopian year
const [month, setMonth] = useState(1);  // Meskerem

<ZemenMonthView
  year={year}
  month={month}
  calendar="ethiopian"
/>
\`\`\`

**Custom day rendering:**

\`\`\`tsx
<ZemenMonthView
  renderDay={(cell, tasksForDay) => (
    <div className="custom-day">
      <strong>{cell.day}</strong>
      {tasksForDay.map(t => <span key={t.id}>{t.title}</span>)}
    </div>
  )}
/>
\`\`\`
    `) },
      { id: 'accessibility', heading: 'Accessibility', content: md(`\
The MonthView implements full WAI-ARIA grid accessibility:

• **Grid role** — \`role="grid"\` on the month container, \`role="gridcell"\` on each cell
• **Roving tabindex** — \`useRovingGridFocus\` hook manages focus
• **Arrow keys** — navigate cells in all four directions
• **Page Up / Page Down** — navigate between months
• **Enter** — activates \`onDayClick\` for the focused cell
• **M key** — enters move mode on a task; Arrow keys navigate; Enter drops; Escape cancels
• **\`aria-label\`** — each cell announces both calendar dates and task count
• **\`aria-live\`** — drag-drop and keyboard move events announce via a live region
• **Drag and drop** — HTML5 native DnD API; \`dataTransfer.setData('text/plain', task.id)\`

> Recurring tasks must be pre-expanded by the consumer before passing to \`tasks[]\`.
> Use \`@zemen/scheduler\`'s \`computeOccurrencesInRange\` for this.
    `) },
    ],
  ),

  componentPage(
    'components/week-view', 'WeekView',
    'A 7-day column view with per-day task timelines.',
    `npm install @zemen/react`,
    [
      { name: 'date', type: 'Date', default: '—', description: 'Reference date; the week containing this date is displayed' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'gregorian'`, description: 'Calendar system for the header' },
      { name: 'tasks', type: `ViewTask[]`, default: `[]`, description: 'Tasks distributed across the 7-day columns' },
      { name: 'startHour', type: 'number', default: `6`, description: 'First visible hour on the timeline' },
      { name: 'endHour', type: 'number', default: `22`, description: 'Last visible hour on the timeline' },
      { name: 'onTimeSlotClick', type: `(date, hour) => void`, default: '—', description: 'Called when an hour slot is clicked in any column' },
      { name: 'onTaskClick', type: `(task) => void`, default: '—', description: 'Called when a task pill is clicked' },
      { name: 'onTaskReschedule', type: `(task, newDate, newHour?) => void`, default: '—', description: 'Called after drag-drop or keyboard move completes' },
      { name: 'disableDragDrop', type: 'boolean', default: `false`, description: 'Disables drag-and-drop and keyboard move mode' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'isLoading', type: 'boolean', default: `false`, description: 'Shows animated skeleton columns when true' },
      { name: 'emptyState', type: `ReactNode`, default: '—', description: 'Custom empty state. Defaults to ZemenEmptyState.' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes for the root element' },
    ],
    `\
\`\`\`tsx
<ZemenWeekView
  date={new Date()}
  tasks={tasks}
  startHour={8}
  endHour={18}
  onTimeSlotClick={(date, hour) => console.log(date, hour)}
/>
\`\`\`

Each column renders a \`ZemenTaskTimeline\` with the day's tasks. The header shows navigation
arrows to move forward/backward by week.

**Cross-column move mode:** Press \`M\` on a task, use Tab/Arrow keys to navigate columns,
press Enter to drop, Escape to cancel.
    `,
    `\
• **Roving tabindex** on column cells for keyboard navigation between days
• **M key** activates move mode; Enter drops; Escape cancels
• **Arrow keys / Tab** navigate between columns during move mode
• **Each column** is a \`ZemenTaskTimeline\` instance with its own grid keyboard behavior
    `,
    <ZemenWeekViewPlayground />,
  ),

  componentPage(
    'components/day-view', 'DayView',
    'A single-day timeline view with hour-by-hour task scheduling.',
    `npm install @zemen/react`,
    [
      { name: 'date', type: 'Date', default: '—', description: 'The day to display' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'gregorian'`, description: 'Calendar system for the header' },
      { name: 'tasks', type: `ViewTask[]`, default: `[]`, description: 'Tasks for this day' },
      { name: 'startHour', type: 'number', default: `6`, description: 'First visible hour' },
      { name: 'endHour', type: 'number', default: `22`, description: 'Last visible hour' },
      { name: 'onTimeSlotClick', type: `(hour) => void`, default: '—', description: 'Called when an hour slot is clicked' },
      { name: 'onTaskClick', type: `(task) => void`, default: '—', description: 'Called when a task pill is clicked' },
      { name: 'onTaskReschedule', type: `(task, newDate, newHour?) => void`, default: '—', description: 'Called after drag-drop or keyboard move' },
      { name: 'disableDragDrop', type: 'boolean', default: `false`, description: 'Disables drag-and-drop' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'isLoading', type: 'boolean', default: `false`, description: 'Shows animated skeleton timeline' },
      { name: 'emptyState', type: `ReactNode`, default: '—', description: 'Custom empty state. Defaults to ZemenEmptyState.' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenDayView
  date={new Date()}
  tasks={todayTasks}
  startHour={9}
  endHour={17}
  onTimeSlotClick={(hour) => console.log('Slot', hour)}
/>
\`\`\`

Wraps a \`ZemenTaskTimeline\` with day-navigation controls (prev/next day, today button,
calendar toggle).
    `,
    `\
• **ZemenTaskTimeline** handles grid keyboard navigation within the day
• **Arrow keys** navigate hour slots
• **Enter** activates slot click
    `,
    <ZemenDayViewPlayground />,
  ),

  componentPage(
    'components/year-view', 'YearView',
    'An overview of all months in a year with mini month-grids.',
    `npm install @zemen/react`,
    [
      { name: 'year', type: 'number', default: '—', description: 'Year to display. Omit for uncontrolled navigation.' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'ethiopian'`, description: 'Calendar system' },
      { name: 'tasks', type: `ViewTask[]`, default: `[]`, description: 'Tasks shown as dots on mini month-grids' },
      { name: 'onMonthClick', type: `(info: MonthClickInfo) => void`, default: '—', description: 'Called when a month card is clicked' },
      { name: 'onDayClick', type: `(day, month, year) => void`, default: '—', description: 'Called when a day is clicked within a mini grid' },
      { name: 'onTaskClick', type: `(task) => void`, default: '—', description: 'Called when a task is clicked' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'isLoading', type: 'boolean', default: `false`, description: 'Shows animated skeleton cards' },
      { name: 'emptyState', type: `ReactNode`, default: '—', description: 'Custom empty state. Defaults to ZemenEmptyState.' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenYearView
  calendar="ethiopian"
  tasks={allYearTasks}
  onMonthClick={(info) => console.log(info.month, info.year)}
/>
\`\`\`

Displays 12–13 month cards (13 for Ethiopian) in a responsive grid. Each card contains a mini
month-grid with task dot indicators. Good for high-level yearly planning.
    `,
    `\
• Each mini month-grid uses \`useRovingGridFocus\` independently
• Arrow keys navigate days within each mini grid
• Month cards are clickable for navigating to a month view
    `,
    <ZemenYearViewPlayground />,
  ),

  componentPage(
    'components/agenda-view', 'AgendaView',
    'A scrollable task list grouped by day, showing upcoming tasks.',
    `npm install @zemen/react`,
    [
      { name: 'tasks', type: `ViewTask[]`, default: '—', description: 'Tasks to display (required)' },
      { name: 'daysAhead', type: 'number', default: `14`, description: 'How many days into the future to show' },
      { name: 'onTaskClick', type: `(task) => void`, default: '—', description: 'Called when a task card is clicked' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'isLoading', type: 'boolean', default: `false`, description: 'Shows animated skeleton groups' },
      { name: 'emptyState', type: `ReactNode`, default: '—', description: 'Custom empty state. Defaults to ZemenEmptyState.' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenAgendaView
  tasks={upcoming}
  daysAhead={7}
  onTaskClick={(task) => console.log(task.title)}
/>
\`\`\`

Groups tasks by day with headers like "Today", "Tomorrow", "Monday, Oct 15". Each
group renders \`ZemenTaskCard\` components showing task details. Days without tasks
are omitted.
    `,
    `\
• Simple keyboard navigation via tab order through task cards
• Each day group has a clear heading for screen readers
    `,
    <ZemenAgendaViewPlayground />,
  ),

  /* -- Task Display -- */
  componentPage(
    'components/task-timeline', 'TaskTimeline',
    'An hour-by-hour timeline for a single day with draggable task pills.',
    `npm install @zemen/react`,
    [
      { name: 'date', type: 'Date', default: '—', description: 'The date for this timeline (required)' },
      { name: 'tasks', type: `ViewTask[]`, default: '—', description: 'Tasks to render on the timeline' },
      { name: 'startHour', type: 'number', default: `6`, description: 'First visible hour' },
      { name: 'endHour', type: 'number', default: `22`, description: 'Last visible hour' },
      { name: 'onTimeSlotClick', type: `(hour) => void`, default: '—', description: 'Called when an hour slot is clicked' },
      { name: 'onTaskClick', type: `(task) => void`, default: '—', description: 'Called when a task pill is clicked' },
      { name: 'onTaskReschedule', type: `(task, newHour?) => void`, default: '—', description: 'Called after drag-drop or keyboard move' },
      { name: 'disableDragDrop', type: 'boolean', default: `false`, description: 'Disables drag-and-drop' },
      { name: 'compact', type: 'boolean', default: `false`, description: 'Compact mode for use inside WeekView columns' },
      { name: 'showHeader', type: 'boolean', default: `true`, description: 'Show the day/date header row' },
      { name: 'showGridNav', type: 'boolean', default: `false`, description: 'Enable roving grid keyboard navigation' },
      { name: 'onGridNavigate', type: `(dir: 'left' \\| 'right') => void`, default: '—', description: 'Called when ArrowLeft/Right pressed (for cross-column nav)' },
      { name: 'externalMoveTask', type: `ViewTask \\| null`, default: '—', description: 'Externally managed move task (WeekView cross-column move mode)' },
      { name: 'onMoveModeChange', type: `(task \\| null) => void`, default: '—', description: 'Called when M key activates/deactivates move mode' },
      { name: 'onExternalDrop', type: `(task, hour) => void`, default: '—', description: 'Called when Enter drops during external move mode' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenTaskTimeline
  date={new Date()}
  tasks={tasks}
  startHour={8}
  endHour={18}
  onTimeSlotClick={(hour) => console.log('Clicked hour', hour)}
/>
\`\`\`

This is the core timeline component used by \`DayView\` and \`WeekView\`. It renders hour
slots with a vertical time axis on the left and task pills positioned by their \`time\` field.

**All-day tasks** appear as a bar at the top above the hour grid.

**Move mode:** Press \`M\` on a task to enter move mode, use Arrow keys to navigate slots,
Enter to confirm, Escape to cancel.
    `,
    `\
• **Grid keyboard navigation** when \`showGridNav\` is enabled
• **Arrow Up/Down** — navigate hour slots
• **M key** — enter move mode on focused task
• **Enter** during move mode — confirm drop at focused slot
• **Escape** — cancel move mode
• **All-day section** at the top with descriptive labels
    `,
    <ZemenTaskTimelinePlayground />,
  ),

  componentPage(
    'components/task-card', 'TaskCard',
    'A detailed task card showing title, time, priority, and status.',
    `npm install @zemen/react`,
    [
      { name: 'task', type: `ViewTask`, default: '—', description: 'The task to display (required)' },
      { name: 'onClick', type: `(task) => void`, default: '—', description: 'Called when the card is clicked' },
      { name: 'onKeyDown', type: `(e) => void`, default: '—', description: 'Custom keydown handler for keyboard accessibility' },
      { name: 'draggable', type: 'boolean', default: '—', description: 'Enables HTML5 drag on the card' },
      { name: 'onDragStart', type: `(e, task) => void`, default: '—', description: 'Drag start handler' },
      { name: 'isMoveMode', type: 'boolean', default: `false`, description: 'Visually indicates this task is in move mode' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenTaskCard
  task={task}
  onClick={(t) => console.log(t.title)}
  draggable
  onDragStart={(e, t) => e.dataTransfer.setData('text/plain', t.id)}
/>
\`\`\`

Used by \`ZemenAgendaView\` to render each task. Displays title, time, priority badge,
and status. Supports drag-and-drop for rescheduling.
    `,
    `\
• Card is a focusable element with \`onClick\` and \`onKeyDown\` handlers
• Supports drag-and-drop with \`draggable\` and \`onDragStart\`
• Priority is communicated via color (red=high, yellow=medium, blue=low)
    `,
    <ZemenTaskCardPlayground />,
  ),

  componentPage(
    'components/task-pill', 'TaskPill',
    'A compact task pill used inside calendar day cells.',
    `npm install @zemen/react`,
    [
      { name: 'task', type: `ViewTask`, default: '—', description: 'The task to display (required)' },
      { name: 'onClick', type: `(task) => void`, default: '—', description: 'Called when the pill is clicked' },
      { name: 'onKeyDown', type: `(e) => void`, default: '—', description: 'Custom keydown handler' },
      { name: 'showTime', type: 'boolean', default: `false`, description: 'Show the task time next to the title' },
      { name: 'draggable', type: 'boolean', default: '—', description: 'Enables HTML5 drag' },
      { name: 'onDragStart', type: `(e, task) => void`, default: '—', description: 'Drag start handler' },
      { name: 'isMoveMode', type: 'boolean', default: `false`, description: 'Visually indicates move mode' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenTaskPill
  task={task}
  onClick={(t) => console.log(t.title)}
  showTime
/>
\`\`\`

Used inside \`ZemenMonthView\` day cells. Shows a truncated task title with priority-based
background color. Multi-day tasks show a \`↔\` prefix and dashed border.
    `,
    `\
• Pill is a \`<button>\` element, focusable and activatable
• Priority color-coded (red, yellow, blue, gray)
• \`aria-label\` includes title, time, priority, and all-day status
    `,
    <ZemenTaskPillPlayground />,
  ),

  componentPage(
    'components/holiday-badge', 'HolidayBadge',
    'Displays Ethiopian holiday names for a given date.',
    `npm install @zemen/react`,
    [
      { name: 'ethiopianMonth', type: 'number', default: '—', description: 'Ethiopian month (1–13)' },
      { name: 'ethiopianDay', type: 'number', default: '—', description: 'Ethiopian day (1–30, or 1–6 for Pagume)' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display language for holiday name' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenHolidayBadge
  ethiopianMonth={1}
  ethiopianDay={1}
  locale="en"
/>
\`\`\`

Holiday data comes from \`@zemen/core\`'s \`getHoliday()\` function. When a recognized
holiday is found, the badge renders its name. For non-holiday dates, nothing is rendered
(\`getHoliday\` returns \`null\`).
    `,
    `\
• Renders nothing when the date is not a holiday (\`getHoliday\` returns \`null\`)
• Holiday name is rendered as a text badge
• Good for surfacing context within day cells
    `,
    <ZemenHolidayBadgePlayground />,
  ),

  componentPage(
    'components/empty-state', 'EmptyState',
    'A shared empty-state component with icon, message, and optional action.',
    `npm install @zemen/react`,
    [
      { name: 'message', type: 'string', default: '—', description: 'Primary message text (required)' },
      { name: 'description', type: 'string', default: '—', description: 'Optional secondary description text' },
      { name: 'icon', type: `ReactNode`, default: '—', description: 'Custom icon. Defaults to a calendar outline.' },
      { name: 'action', type: `ReactNode`, default: '—', description: 'Optional action element (e.g. a button to add a task)' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenEmptyState
  message="No tasks for today"
  description="Add a task or navigate to another day"
  action={<button onClick={addTask}>Add Task</button>}
/>
\`\`\`

Used internally by all five view components when \`tasks\` array is empty and no
\`emptyState\` override prop is provided.
    `,
    `\
• Renders as a centered flex column with muted text
• Action slot allows adding contextual buttons
    `,
    <ZemenEmptyStatePlayground />,
  ),

  /* -- Shared Components -- */
  componentPage(
    'components/calendar-header', 'CalendarHeader',
    'Navigation bar with prev/next buttons, today button, and calendar toggle.',
    `npm install @zemen/react`,
    [
      { name: 'year', type: 'number', default: '—', description: 'Current year to display (required)' },
      { name: 'month', type: 'number', default: '—', description: 'Current month to display (required)' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: '—', description: 'Which calendar system is active (required)' },
      { name: 'onPrev', type: `() => void`, default: '—', description: 'Navigate to previous month/year' },
      { name: 'onNext', type: `() => void`, default: '—', description: 'Navigate to next month/year' },
      { name: 'onToday', type: `() => void`, default: '—', description: 'Navigate to today' },
      { name: 'onCalendarToggle', type: `(cal) => void`, default: '—', description: 'Callback when calendar toggle button is clicked' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale for month/year labels' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenCalendarHeader
  year={2017}
  month={1}
  calendar="ethiopian"
  onPrev={() => console.log('previous')}
  onNext={() => console.log('next')}
  onToday={() => console.log('today')}
/>
\`\`\`

Used by MonthView, WeekView, YearView, and ZemenCalendar. Displays the current month/year
label with navigation arrows and action buttons.
    `,
    `\
• Prev/next buttons have \`aria-label\` for screen readers
• Today button navigates to current date
• Calendar toggle switches between Ethiopian and Gregorian
    `,
    <ZemenCalendarHeaderPlayground />,
  ),

  componentPage(
    'components/mini-calendar', 'MiniCalendar',
    'A compact month-grid for use in sidebars, popovers, and widgets.',
    `npm install @zemen/react`,
    [
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'ethiopian'`, description: 'Calendar system' },
      { name: 'selectedDate', type: `{ year, month, day } \\| null`, default: '—', description: 'Currently selected date' },
      { name: 'onDateSelect', type: `(date) => void`, default: '—', description: 'Called when a date is selected' },
      { name: 'showHolidays', type: 'boolean', default: `false`, description: 'Show holiday badges on recognized dates' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
<ZemenMiniCalendar
  calendar="ethiopian"
  selectedDate={{ year: 2017, month: 1, day: 1 }}
  onDateSelect={(d) => console.log(d)}
/>
\`\`\`

Similar to \`ZemenCalendar\` but more compact — suitable for sidebars, filters, and
widget areas. Supports holiday display via \`showHolidays\`.
    `,
    `\
• Full WAI-ARIA grid with roving tabindex
• Arrow key navigation
• Holiday badges rendered inline when \`showHolidays\` is true
    `,
    <ZemenMiniCalendarPlayground />,
  ),

  componentPage(
    'components/quick-add', 'QuickAdd',
    'A modal dialog for quickly creating a task with minimal fields.',
    `npm install @zemen/react`,
    [
      { name: 'open', type: 'boolean', default: '—', description: 'Controls dialog visibility (required)' },
      { name: 'onClose', type: `() => void`, default: '—', description: 'Called when dialog should close (required)' },
      { name: 'onSubmit', type: `(input: QuickAddTaskInput) => void`, default: '—', description: 'Called with assembled task input on submit' },
      { name: 'defaultDate', type: 'Date', default: '—', description: 'Pre-selected date for the date picker' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'ethiopian'`, description: 'Calendar system for date selection' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
const [quickOpen, setQuickOpen] = useState(false);

<ZemenQuickAdd
  open={quickOpen}
  onClose={() => setQuickOpen(false)}
  onSubmit={(input) => {
    // input matches CreateTaskInput from @zemen/scheduler
    createTask(input);
  }}
/>
\`\`\`

Opens as a modal dialog with: task title input, date picker, time/end-date toggle,
all-day checkbox, priority selector, and submit/cancel buttons.
    `,
    `\
• **Escape** closes the dialog
• **Autofocus** on the title input when opened
• **Backdrop click** closes the dialog
• **\`aria-modal="true"\`** and **\`role="dialog"\`** on the overlay
    `,
    <ZemenQuickAddPlayground />,
  ),

  componentPage(
    'components/task-form', 'TaskForm',
    'A full task creation/editing form with recurrence and reminder support.',
    `npm install @zemen/react`,
    [
      { name: 'task', type: `ViewTask`, default: '—', description: 'Existing task for edit mode. Omit for create mode.' },
      { name: 'onSubmit', type: `(input: TaskFormInput) => void`, default: '—', description: 'Called with new task data on create' },
      { name: 'onUpdate', type: `(input: Partial<TaskFormInput>) => void`, default: '—', description: 'Called with partial updates on save' },
      { name: 'onClose', type: `() => void`, default: '—', description: 'Called when form should close (required)' },
      { name: 'calendar', type: `'ethiopian' \\| 'gregorian'`, default: `'ethiopian'`, description: 'Calendar system for date pickers' },
      { name: 'locale', type: `'en' \\| 'am'`, default: `'en'`, description: 'Display locale' },
      { name: 'className', type: 'string', default: `''`, description: 'Additional CSS classes' },
    ],
    `\
\`\`\`tsx
// Create mode
<ZemenTaskForm
  onClose={() => setFormOpen(false)}
  onSubmit={(input) => createTask(input)}
/>

// Edit mode
<ZemenTaskForm
  task={existingTask}
  onClose={() => setFormOpen(false)}
  onUpdate={(patch) => updateTask(task.id, patch)}
/>
\`\`\`

Full task form with fields: title, description, date pickers (dual-calendar), time,
all-day toggle, end date, priority, status, tags, recurrence rules (daily/weekly/monthly/yearly
with interval and end conditions), and reminder rules.
    `,
    `\
• Accessible form with proper labels and focus management
• Tags use a semantic list with remove buttons
• Date pickers within the form follow the ZemenCalendar accessibility model
    `,
    <ZemenTaskFormPlayground />,
  ),

  /* -- Hooks -- */
  page('hooks/use-calendar-navigation', 'useCalendarNavigation', 'Navigate months and years in Ethiopian or Gregorian calendars', [
    {
      id: 'playground',
      heading: 'Playground',
      content: playground('useCalendarNavigation'),
    },
    {
      id: 'signature',
      heading: 'Signature',
      content: md(`\
\`\`\`tsx
function useCalendarNavigation(
  initialDate?: { year: number; month: number; day: number },
  calendar?: 'ethiopian' | 'gregorian',
): UseCalendarNavigationResult
\`\`\`
      `),
    },
    {
      id: 'returns',
      heading: 'Return Value',
      content: md(`\
| Property | Type | Description |
|----------|------|-------------|
| \`year\` | \`number\` | Current year in the active calendar |
| \`month\` | \`number\` | Current month (1–12 or 1–13) |
| \`day\` | \`number\` | Current day |
| \`goToNextMonth\` | \`() => void\` | Advance by one month |
| \`goToPreviousMonth\` | \`() => void\` | Go back by one month |
| \`goToNextYear\` | \`() => void\` | Advance by one year |
| \`goToPreviousYear\` | \`() => void\` | Go back by one year |
| \`goToToday\` | \`() => void\` | Jump to today in the active calendar |
| \`setDate\` | \`(year, month, day?) => void\` | Set an arbitrary date |
| \`calendar\` | \`'ethiopian' \\| 'gregorian'\` | Which calendar is active |

All navigation functions handle month/year boundaries and Pagume (month 13) correctly.
      `),
    },
    {
      id: 'usage',
      heading: 'Usage',
      content: md(`\
\`\`\`tsx
import { useCalendarNavigation } from '@zemen/react';

function MyCalendar() {
  const { year, month, goToNextMonth, goToPreviousMonth, goToToday } =
    useCalendarNavigation(undefined, 'ethiopian');

  return (
    <div>
      <button onClick={goToPreviousMonth}>◀</button>
      <span>Month {month}, {year}</span>
      <button onClick={goToNextMonth}>▶</button>
      <button onClick={goToToday}>Today</button>
    </div>
  );
}
\`\`\`

When \`initialDate\` is provided, the hook starts at that date. When omitted,
it starts at today's date (converted to the active calendar).
      `),
    },
  ]),

  page('hooks/use-month-grid', 'useMonthGrid', 'Compute the weeks and day cells for a given month', [
    {
      id: 'playground',
      heading: 'Playground',
      content: playground('useMonthGrid'),
    },
    {
      id: 'signature',
      heading: 'Signature',
      content: md(`\
\`\`\`tsx
function useMonthGrid(
  year: number,
  month: number,
  calendar: 'ethiopian' | 'gregorian',
): MonthGridData
\`\`\`
      `),
    },
    {
      id: 'returns',
      heading: 'Return Value',
      content: md(`\
\`\`\`ts
type MonthGridData = {
  weeks: DayCell[][];   // Array of weeks, each week is 7 DayCells
  month: number;
  year: number;
  calendar: 'ethiopian' | 'gregorian';
};

type DayCell = {
  day: number | null;                              // null = empty cell
  isToday: boolean;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  ethiopian: { year: number; month: number; day: number } | null;
  gregorian: { year: number; month: number; day: number } | null;
};
\`\`\`

Each \`DayCell\` carries both Ethiopian and Gregorian date information regardless of
which calendar is active, enabling dual-label display.
      `),
    },
    {
      id: 'usage',
      heading: 'Usage',
      content: md(`\
\`\`\`tsx
import { useMonthGrid } from '@zemen/react';

function MonthGrid({ year, month, calendar }) {
  const { weeks } = useMonthGrid(year, month, calendar);

  return (
    <div className="grid grid-cols-7">
      {weeks.flat().map((cell, i) =>
        cell.day !== null ? (
          <div key={i} className="p-2 border">
            {cell.day}
            <span className="text-xs text-gray-400 ml-1">
              {cell.gregorian?.day}
            </span>
          </div>
        ) : (
          <div key={i} />
        )
      )}
    </div>
  );
}
\`\`\`
      `),
    },
  ]),

  page('hooks/use-day-timeline', 'useDayTimeline', 'Generate hour slots for a single-day timeline view', [
    {
      id: 'playground',
      heading: 'Playground',
      content: playground('useDayTimeline'),
    },
    {
      id: 'signature',
      heading: 'Signature',
      content: md(`\
\`\`\`tsx
function useDayTimeline(
  date: Date,
  calendar: 'ethiopian' | 'gregorian',
  startHour?: number,   // default 0
  endHour?: number,     // default 24
): DayTimelineData
\`\`\`
      `),
    },
    {
      id: 'returns',
      heading: 'Return Value',
      content: md(`\
\`\`\`ts
type DayTimelineData = {
  slots: HourSlot[];
  date: Date;
  calendar: 'ethiopian' | 'gregorian';
  startHour: number;
  endHour: number;
};

type HourSlot = {
  hour: number;
  displayLabel: string;       // e.g. "6:00 AM"
  labelEthiopian: string;     // e.g. "12:00 ☀️"
  isPast: boolean;
  isCurrent: boolean;
  isToday: boolean;
};
\`\`\`

The \`labelEthiopian\` field provides the Ethiopian timekeeping offset (roughly +6 hours from
local time) formatted as a display string. This enables optional "Ethiopian time" labels on
timeline slots.
      `),
    },
    {
      id: 'usage',
      heading: 'Usage',
      content: md(`\
\`\`\`tsx
import { useDayTimeline } from '@zemen/react';

function Timeline({ date }) {
  const { slots } = useDayTimeline(date, 'gregorian', 6, 22);

  return (
    <div>
      {slots.map((slot) => (
        <div
          key={slot.hour}
          className={slot.isPast ? 'opacity-50' : ''}
        >
          <span>{slot.displayLabel}</span>
          <span className="text-xs text-gray-400 ml-2">
            ({slot.labelEthiopian})
          </span>
        </div>
      ))}
    </div>
  );
}
\`\`\`
      `),
    },
  ]),

  page('hooks/use-roving-grid-focus', 'useRovingGridFocus', 'WAI-ARIA roving tabindex keyboard navigation for grid layouts', [
    {
      id: 'playground',
      heading: 'Playground',
      content: playground('useRovingGridFocus'),
    },
    {
      id: 'signature',
      heading: 'Signature',
      content: md(`\
\`\`\`tsx
function useRovingGridFocus(
  options: UseRovingGridFocusOptions,
): UseRovingGridFocusResult
\`\`\`
      `),
    },
    {
      id: 'options',
      heading: 'Options',
      content: md(`\
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`rows\` | \`number\` | — | Number of rows in the grid |
| \`cols\` | \`number\` | — | Number of columns in the grid |
| \`defaultRow\` | \`number\` | \`0\` | Initial focused row |
| \`defaultCol\` | \`number\` | \`0\` | Initial focused column |
| \`onActivate\` | \`(row, col) => void\` | — | Called when the focused cell is activated (Enter/Space) |
| \`onPageUp\` | \`() => boolean\` | — | Called on Page Up; return true to prevent default |
| \`onPageDown\` | \`() => boolean\` | — | Called on Page Down; return true to prevent default |

**Returns:**

\`\`\`ts
type UseRovingGridFocusResult = {
  containerRef: React.RefObject<HTMLDivElement>;
  focusRow: number;
  focusCol: number;
  focusCell: (row: number, col: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  getTabIndex: (row: number, col: number) => number;
};
\`\`\`

The \`getTabIndex\` function returns 0 only for the currently focused cell and -1 for all others,
implementing the roving tabindex pattern.
      `),
    },
    {
      id: 'usage',
      heading: 'Usage',
      content: md(`\
\`\`\`tsx
import { useRovingGridFocus } from '@zemen/react';

function MyGrid({ rows, cols }) {
  const grid = useRovingGridFocus({
    rows,
    cols,
    onActivate: (r, c) => console.log(\`Activated cell (\${r}, \${c})\`),
  });

  return (
    <div
      ref={grid.containerRef}
      role="grid"
      onKeyDown={grid.handleKeyDown}
    >
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} role="row">
          {Array.from({ length: cols }, (_, c) => (
            <div
              key={c}
              role="gridcell"
              tabIndex={grid.getTabIndex(r, c)}
              onClick={() => grid.onActivate?.(r, c)}
            >
              Cell ({r},{c})
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
\`\`\`

This is the same hook used internally by \`ZemenCalendar\`, \`ZemenMonthView\`, and
all other grid-based components.
      `),
    },
  ]),
];

/* -------------------------------------------------------------------------- */
/*  Lookup helpers                                                            */
/* -------------------------------------------------------------------------- */

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug);
}
