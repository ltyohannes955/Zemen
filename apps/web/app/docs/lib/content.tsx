export type DocSection = {
  id: string;
  heading: string;
  content: string;
};

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  sections: DocSection[];
};

export const DOC_PAGES: DocPage[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    description: 'What is Zemen and why you should use it.',
    sections: [
      {
        id: 'what-is-zemen',
        heading: 'What is Zemen?',
        content: `Zemen is a zero-dependency Ethiopian calendar engine for JavaScript and TypeScript. It provides precise Ethiopian-to-Gregorian and Gregorian-to-Ethiopian date conversions, date arithmetic, and a React component library — all built from pure calendar math with no external dependencies.`,
      },
      {
        id: 'key-features',
        heading: 'Key Features',
        content: `• Microsecond-precision conversions using math-based offset algorithms
• Zero external dependencies — pure TypeScript
• Ethiopian leap year rule: (year + 1) % 4 === 0
• Full 13-month Ethiopian calendar (months 1–12: 30 days, Pagume: 5–6 days)
• Locale support: English, Amharic, and extensible for more
• React components with dual-calendar display
• Works in Node.js, browser, and Edge runtimes`,
      },
      {
        id: 'packages',
        heading: 'Package Ecosystem',
        content: `\`@zemen/core\` — Framework-independent calendar engine. Handles conversions, date math, and localization data.

\`@zemen/react\` — React components built on \`@zemen/core\`. Includes \`ZemenCalendar\` and locale-aware display.

\`@zemen/web\` — Example Next.js application consuming \`@zemen/react\`.`,
      },
    ],
  },
  {
    slug: 'installation',
    title: 'Installation',
    description: 'Install Zemen packages in your project.',
    sections: [
      {
        id: 'core',
        heading: 'Core Package',
        content: `Install the framework-independent engine:

\`\`\`
npm install @zemen/core
\`\`\``,
      },
      {
        id: 'react',
        heading: 'React Package',
        content: `Install the React component library:

\`\`\`
npm install @zemen/react
\`\`\`

\`@zemen/react\` has peer dependencies on \`react ^18.2.0 || ^19.0.0\`.`,
      },
      {
        id: 'tailwind',
        heading: 'Tailwind CSS Setup',
        content: `For the calendar styles to work, ensure your Tailwind config scans the package source:

\`\`\`
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@zemen/react/src/**/*.{ts,tsx}',
  ],
}
\`\`\``,
      },
      {
        id: 'fonts',
        heading: 'Font Setup (Optional)',
        content: `Zemen uses the font stack \`Geist, Noto Sans Ethiopic, sans-serif\`. Add these via Google Fonts or self-host them:

\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap');
\`\`\``,
      },
    ],
  },
  {
    slug: 'quick-start',
    title: 'Quick Start',
    description: 'Get up and running with Zemen in minutes.',
    sections: [
      {
        id: 'core-usage',
        heading: 'Core Usage',
        content: `Convert between Ethiopian and Gregorian dates:

\`\`\`tsx
import { toEthiopian, toGregorian } from '@zemen/core';

// Gregorian → Ethiopian
const ethDate = toEthiopian(new Date());
// { year: 2017, month: 9, day: 14 }

// Ethiopian → Gregorian
const gregDate = toGregorian({ year: 2017, month: 9, day: 14 });
\`\`\``,
      },
      {
        id: 'date-math',
        heading: 'Date Arithmetic',
        content: `Add or subtract days from any Ethiopian date:

\`\`\`tsx
import { addDays, subtractDays } from '@zemen/core';

const nextWeek = addDays({ year: 2017, month: 9, day: 14 }, 7);
const lastWeek = subtractDays({ year: 2017, month: 9, day: 14 }, 7);
\`\`\``,
      },
      {
        id: 'month-names',
        heading: 'Month Names',
        content: `Get month names in English or Amharic:

\`\`\`tsx
import { getMonthName } from '@zemen/core';

getMonthName(9, 'en'); // "Genbot"
getMonthName(9, 'am'); // "ግንቦት (Genbot)"
\`\`\``,
      },
      {
        id: 'react-component',
        heading: 'React Component',
        content: `Use the calendar component in your React app:

\`\`\`tsx
import { ZemenCalendar } from '@zemen/react';

function App() {
  return <ZemenCalendar locale="am" />;
}
\`\`\`

The component handles month navigation, today highlighting, and dual-date display.`,
      },
    ],
  },
  {
    slug: 'core-api',
    title: 'Core API',
    description: 'Complete reference for all @zemen/core exports.',
    sections: [
      {
        id: 'ethiopian-date',
        heading: 'EthiopianDate Type',
        content: `All core functions use this type:

\`\`\`tsx
type EthiopianDate = {
  year: number;
  month: number; // 1–13
  day: number;   // 1–30 (Pagume: 1–5/6)
};
\`\`\``,
      },
      {
        id: 'conversion',
        heading: 'Conversion',
        content: `\`toGregorian(ethDate: EthiopianDate): Date\` — Convert an Ethiopian date to a Gregorian UTC Date.

\`\`\`tsx
const g = toGregorian({ year: 2015, month: 1, day: 1 });
// → new Date(Date.UTC(2022, 8, 11))
\`\`\`

\`toEthiopian(date: Date): EthiopianDate\` — Convert a Gregorian Date to Ethiopian date (UTC-based).

\`\`\`tsx
const e = toEthiopian(new Date(Date.UTC(2022, 8, 11)));
// → { year: 2015, month: 1, day: 1 }
\`\`\`

\`toEthiopianLocal(date: Date): EthiopianDate\` — Same as \`toEthiopian\` but uses local timezone getters. Use this for "today" in the user's timezone.`,
      },
      {
        id: 'date-helpers',
        heading: 'Date Helpers',
        content: `\`isLeapYear(year: number): boolean\` — Ethiopian leap year rule: \`(year + 1) % 4 === 0\`.

\`\`\`tsx
isLeapYear(2015); // true
isLeapYear(2016); // false
\`\`\`

\`getMonthDays(month: number, year: number): number\` — Returns \`30\` for months 1–12, \`5\` or \`6\` for Pagume (month 13).

\`\`\`tsx
getMonthDays(1, 2015);  // 30
getMonthDays(13, 2015); // 6 (leap year)
\`\`\`

\`getDayOfWeek(ethDate: EthiopianDate): number\` — Returns \`0–6\` (Sunday–Saturday).

\`\`\`tsx
getDayOfWeek({ year: 2015, month: 1, day: 1 }); // → 0 (Sunday)
\`\`\`

\`addDays(ethDate, n)\` / \`subtractDays(ethDate, n)\` — Add or subtract days from an Ethiopian date.

\`\`\`tsx
addDays({ year: 2015, month: 1, day: 30 }, 1);
// → { year: 2015, month: 2, day: 1 }
\`\`\``,
      },
      {
        id: 'validation',
        heading: 'Validation & Formatting',
        content: `\`isValid(ethDate: EthiopianDate): boolean\` — Returns \`true\` if the date is valid (within range, correct day count).

\`\`\`tsx
isValid({ year: 2015, month: 1, day: 1 });   // true
isValid({ year: 2015, month: 13, day: 7 });  // false
\`\`\`

\`toISOString(ethDate: EthiopianDate): string\` — Returns an ISO-like string: \`YYYY-MM-DD\`.

\`\`\`tsx
toISOString({ year: 2015, month: 1, day: 1 }); // "2015-01-01"
\`\`\``,
      },
    ],
  },
  {
    slug: 'localization',
    title: 'Localization',
    description: 'Locale support and adding new languages.',
    sections: [
      {
        id: 'supported',
        heading: 'Supported Locales',
        content: `\`"en"\` — English (Meskerem, Tikimt, Hidar, ...)
\`"am"\` — Amharic (መስከረም, ጥቅምት, ህዳር, ...)`,
      },
      {
        id: 'getmonthname',
        heading: 'getMonthName',
        content: `\`getMonthName(month: number, locale?: Locale): string\`

Returns the month name for the given locale. The Amharic locale returns both the native name and English transliteration.

\`\`\`tsx
getMonthName(1);        // "Meskerem"
getMonthName(1, 'en');  // "Meskerem"
getMonthName(1, 'am');  // "መስከረም (Meskerem)"
\`\`\``,
      },
      {
        id: 'adding-language',
        heading: 'Adding a Language',
        content: `Use \`registerLocale\` to add custom locales at runtime. The \`locale\` parameter accepts any string — add as many languages as you need.

\`\`\`tsx
import { registerLocale } from '@zemen/core';

registerLocale('om', {
  monthNames: [
    'Amajjii', 'Gurraandhala', 'Bitooteessa',
    'Elba', 'Caamsaa', 'Waxabajjii',
    'Adooleessa', 'Hagayya', 'Fuulbana',
    'Onkololeessa', 'Sadaasa', 'Muddee',
    'Guraandhala',
  ],
});

getMonthName(1, 'om'); // "Amajjii"
\`\`\``,
      },
      {
        id: 'api-ref',
        heading: 'API Reference',
        content: `• \`supportedLocales\` — Array of registered locale keys
• \`isSupportedLocale(locale)\` — Type guard, returns \`true\` if registered
• \`getLocaleData(locale)\` — Returns the full \`LocaleData\` object
• \`registerLocale(locale, data)\` — Register a new locale at runtime
• \`type Locale\` — \`"en" | "am"\`
• \`type LocaleData\` — \`{ monthNames: readonly string[] }\``,
      },
    ],
  },
  {
    slug: 'react',
    title: 'React',
    description: 'Complete guide for @zemen/react.',
    sections: [
      {
        id: 'zemen-calendar',
        heading: 'ZemenCalendar',
        content: `The main calendar component. Shows a combined Ethiopian + Gregorian month grid with navigation and today highlighting.

\`\`\`tsx
import { ZemenCalendar } from '@zemen/react';

function App() {
  return <ZemenCalendar locale="am" />;
}
\`\`\``,
      },
      {
        id: 'props',
        heading: 'Props',
        content: `\`locale: Locale\` (default: \`"en"\`) — Calendar display language. Controls month names and weekday headers.`,
      },
      {
        id: 'locale-table',
        heading: 'Locale Behavior',
        content: `\`"en"\` — Month names: January, February, ... — Weekday headers: Sun, Mon, Tue, ...
\`"am"\` — Month names: መስከረም (Meskerem), ... — Weekday headers: እሁ, ሰኞ, ማክ, ...`,
      },
      {
        id: 'styling',
        heading: 'Styling',
        content: `ZemenCalendar uses Tailwind CSS classes internally. For the styles to apply, ensure:

• Your app has Tailwind CSS set up
• Your Tailwind config scans the package source
• The consuming app handles dark mode via the \`dark\` class on \`<html>\`

The calendar inherits the parent's font family and respects dark mode via \`dark:\` Tailwind variants.`,
      },
    ],
  },
];

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug);
}

export function getDocSidebar(): { slug: string; title: string }[] {
  return DOC_PAGES.map((p) => ({ slug: p.slug, title: p.title }));
}
