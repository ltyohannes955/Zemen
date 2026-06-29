'use client';

import * as React from 'react';
import Link from 'next/link';
import { ZemenCalendar } from '@zemen/react';
import { toEthiopianLocal, getMonthName } from '@zemen/core';
import { useTheme } from './theme-provider';
import {
  Sun01Icon,
  Moon01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  GithubIcon,
  LayoutGridIcon,
  ComputerPhoneSyncIcon,
  Calendar01Icon,
  Globe02Icon,
  Atom01Icon,
  CodeFolderIcon,
} from 'hugeicons-react';

const FEATURES = [
  {
    icon: LayoutGridIcon,
    title: 'Dual Rendering',
    description: 'Render both calendars in real-time with zero layout shift and perfect sync.',
  },
  {
    icon: ComputerPhoneSyncIcon,
    title: 'Live Sync',
    description: 'Real-time synchronization ensures both calendars always reflect the same moment.',
  },
  {
    icon: Calendar01Icon,
    title: 'Scheduling',
    description: 'Schedule events with dual-date support for seamless cross-calendar planning.',
  },
  {
    icon: Globe02Icon,
    title: 'Localization',
    description: 'Fully localized in Amharic, Oromo, Tigrinya, and English out of the box.',
  },
  {
    icon: Atom01Icon,
    title: 'React-First',
    description: 'Hooks, components, and utilities designed to feel native to React apps.',
  },
  {
    icon: CodeFolderIcon,
    title: 'Open Source',
    description: 'MIT licensed with active development under the Zemen Collective.',
  },
];

const COMPARISON = [
  {
    icon: 'X',
    iconFill: 'text-red-400',
    title: 'The Manual Burden',
    items: [
      'Complex leap-year logic & conversions',
      'High latency in cross-calendar libraries',
      'Non-existent UI libraries for dual display',
    ],
  },
  {
    icon: 'check',
    iconFill: 'text-emerald-400',
    title: 'The Zemen Solution',
    items: [
      'Zero-dependency core with math-based offsets',
      'Native micro-optimization for conversions',
      'Built-in Amharic localization support',
    ],
  },
];

type ViewMode = 'both' | 'ethiopian' | 'gregorian';

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = React.useState<ViewMode>('both');
  const ethToday = React.useMemo(() => toEthiopianLocal(new Date()), []);
  const gregToday = new Date();

  const toggleOptions: { label: string; value: ViewMode }[] = [
    { label: 'Both', value: 'both' },
    { label: 'Ethiopian', value: 'ethiopian' },
    { label: 'Gregorian', value: 'gregorian' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0a0e17]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <a href="#" className="text-xl font-bold tracking-tight">Zemen</a>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#why" className="hover:text-gray-900 dark:hover:text-white transition-colors">Why</a>
              <Link href="/docs/introduction" className="hover:text-gray-900 dark:hover:text-white transition-colors">Docs</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun01Icon className="w-4 h-4" />
                : <Moon01Icon className="w-4 h-4" />
              }
            </button>
            <a
              href="https://github.com"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 active:scale-95 transition-all duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              v1.0.0 Now Available
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Ethiopian & Gregorian{' '}
              <span className="gradient-text">calendars — finally in sync.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
              A high-performance calendar engine for modern applications.
              Seamlessly bridge the calendar gap with React-first components and
              zero-dependency core logic.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="https://github.com" className="btn-primary">
                Get Started
                <ArrowRight01Icon className="w-4 h-4" />
              </a>
              <a href="#demo" className="btn-secondary">
                Try Playground
              </a>
            </div>
          </div>

          {/* Calendar Display */}
          <div className="mt-8 p-4 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="flex items-start justify-end mb-3">
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-0.5">
                {toggleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setViewMode(opt.value)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 ${
                      viewMode === opt.value
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`w-full grid gap-3 ${viewMode === 'both' ? 'md:grid-cols-2' : 'max-w-xl mx-auto'}`}>
              {(viewMode === 'both' || viewMode === 'gregorian') && (
                <div className="card-hover p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase">Gregorian</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  <div className="text-center py-5">
                    <div className="text-3xl font-bold tracking-tight">
                      {gregToday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {gregToday.toLocaleDateString('en-US', { weekday: 'long' })}, {gregToday.getFullYear()}
                    </div>
                  </div>
                </div>
              )}

              {(viewMode === 'both' || viewMode === 'ethiopian') && (
                <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                  <div className="relative mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">Ethiopian</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                    </div>
                  </div>
                  <div className="relative text-center py-5">
                    <div className="text-3xl font-bold tracking-tight">
                      {getMonthName(ethToday.month, 'am')} {ethToday.day}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {getMonthName(ethToday.month, 'en')} {ethToday.year}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="features" className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <h2 className="text-3xl font-bold tracking-tight">Experience Native Dual-Context.</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Zemen isn&apos;t just a conversion tool. It&apos;s a full-featured UI suite that treats both systems as primary citizens.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckmarkCircle01Icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">Cross-system recurring tasks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckmarkCircle01Icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">Microsecond-conversion latency</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckmarkCircle01Icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">Native Amharic & Oromo support</span>
                </div>
              </div>
            </div>
            <div className="card p-6 animate-fade-in-scale" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white">Schedule</button>
                  <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Month</button>
                  <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Week</button>
                  <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Day</button>
                </div>
                <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 active:scale-95 transition-all duration-200">
                  + New Task
                </button>
              </div>
              <ZemenCalendar locale="am" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Zemen Section */}
      <section id="why" className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-12 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
            <h2 className="text-3xl font-bold tracking-tight">Why Zemen?</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Bridging the 7-year gap manually is error-prone and tedious. We built the engineering abstraction so you don&apos;t have to.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {COMPARISON.map((item, i) => (
              <div
                key={i}
                className={`card card-hover p-6 animate-fade-in-up ${i === 1 ? 'border-emerald-500/30' : ''}`}
                style={{ animationDelay: `${0.1 + i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-start gap-4">
                  {item.icon === 'X' ? (
                    <div className={`w-6 h-6 rounded-full border-2 ${item.iconFill} border-current flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                      X
                    </div>
                  ) : (
                    <CheckmarkCircle01Icon className={`w-6 h-6 ${item.iconFill} flex-shrink-0 mt-0.5`} />
                  )}
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {item.items.map((it, j) => (
                        <li key={j} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineered Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-12 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
            <h2 className="text-3xl font-bold tracking-tight">Engineered for Precision.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card card-hover p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
                >
                  <div className="mb-4 w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Code Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
              <h2 className="text-3xl font-bold tracking-tight">Built for Developers. By Developers.</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Zemen is built for simplicity and is optimized for the Edge. Zero external dependencies, just pure calendar math.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5">
                  <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    npm install zemen
                  </code>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 active:scale-95 transition-all duration-200">
                    <Copy01Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card bg-gray-50 dark:bg-gray-900/50 p-6 overflow-x-auto animate-fade-in-scale" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              <pre className="text-sm font-mono">
                <code className="text-gray-700 dark:text-gray-300">
                  {`import { ZemenCalendar } from '@zemen/react';

function App() {
  return (
    <ZemenCalendar 
      locale="am" 
      showDualDates 
    />
  );
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Docs Preview Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-12 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
            <h2 className="text-3xl font-bold tracking-tight">Documentation</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to integrate Zemen into your project.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { title: 'Getting Started', desc: 'Install, configure, and run your first dual-calendar app in under 5 minutes.', slug: 'installation' },
              { title: 'Core API', desc: 'Full reference for all conversion, arithmetic, and validation functions.', slug: 'core-api' },
              { title: 'React Components', desc: 'Component API, props, styling, and advanced usage patterns.', slug: 'react' },
            ].map((item, i) => (
              <a
                key={item.slug}
                href={`/docs/${item.slug}`}
                className="card card-hover p-6 text-left animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Link href="/docs/introduction" className="btn-secondary">
              Browse Full Docs
              <ArrowRight01Icon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { value: '12k+', label: 'Weekly Downloads' },
              { value: '2.4k', label: 'GitHub Stars' },
              { value: '80+', label: 'Contributors' },
              { value: '0', label: 'Dependencies' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="card card-hover p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="text-3xl font-bold text-emerald-500">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <a href="https://github.com" className="btn-secondary">
              <GithubIcon className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="font-bold text-lg mb-4 tracking-tight">Zemen</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Engineered Elegance for the Ethiopian Web.
              </p>
            </div>
            {[
              {
                title: 'Resources',
                links: ['Documentation', 'Playground', 'Examples', 'Community'],
              },
              {
                title: 'Social',
                links: ['Twitter', 'GitHub', 'Discord'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms'],
              },
            ].map((group) => (
              <div key={group.title}>
                <div className="font-semibold mb-4 text-emerald-600 dark:text-emerald-400 text-sm">{group.title}</div>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            &copy; 2024 Zemen Collective. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
