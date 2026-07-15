export type SidebarGroup = {
  title: string;
  items: { slug: string; title: string }[];
};

export function getSidebar(): SidebarGroup[] {
  return [
    {
      title: 'Getting Started',
      items: [
        { slug: 'introduction', title: 'Introduction' },
        { slug: 'installation', title: 'Installation' },
        { slug: 'quick-start', title: 'Quick Start' },
      ],
    },
    {
      title: 'Concepts',
      items: [
        { slug: 'concepts/ethiopian-calendar', title: 'Ethiopian Calendar' },
        { slug: 'concepts/theming', title: 'Theming' },
        { slug: 'concepts/localization', title: 'Localization' },
      ],
    },
    {
      title: 'Date Pickers',
      items: [
        { slug: 'components/calendar', title: 'Calendar' },
        { slug: 'components/date-picker', title: 'DatePicker' },
        { slug: 'components/date-range-picker', title: 'DateRangePicker' },
      ],
    },
    {
      title: 'Calendar Views',
      items: [
        { slug: 'components/month-view', title: 'MonthView' },
        { slug: 'components/week-view', title: 'WeekView' },
        { slug: 'components/day-view', title: 'DayView' },
        { slug: 'components/year-view', title: 'YearView' },
        { slug: 'components/agenda-view', title: 'AgendaView' },
      ],
    },
    {
      title: 'Task Display',
      items: [
        { slug: 'components/task-timeline', title: 'TaskTimeline' },
        { slug: 'components/task-card', title: 'TaskCard' },
        { slug: 'components/task-pill', title: 'TaskPill' },
        { slug: 'components/holiday-badge', title: 'HolidayBadge' },
        { slug: 'components/empty-state', title: 'EmptyState' },
      ],
    },
    {
      title: 'Shared Components',
      items: [
        { slug: 'components/calendar-header', title: 'CalendarHeader' },
        { slug: 'components/mini-calendar', title: 'MiniCalendar' },
        { slug: 'components/quick-add', title: 'QuickAdd' },
        { slug: 'components/task-form', title: 'TaskForm' },
      ],
    },
    {
      title: 'Hooks',
      items: [
        { slug: 'hooks/use-calendar-navigation', title: 'useCalendarNavigation' },
        { slug: 'hooks/use-month-grid', title: 'useMonthGrid' },
        { slug: 'hooks/use-day-timeline', title: 'useDayTimeline' },
        { slug: 'hooks/use-roving-grid-focus', title: 'useRovingGridFocus' },
      ],
    },
  ];
}
