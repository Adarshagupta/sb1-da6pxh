interface WidgetConfig {
  name: string;
  shortName: string;
  description: string;
  screenshots: Array<{
    src: string;
    sizes: string;
    type: string;
    label: string;
  }>;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

export const widgets: Record<string, WidgetConfig> = {
  'book-stats': {
    name: 'BookAI Stats',
    shortName: 'Book Stats',
    description: 'Quick access to your book generation stats',
    screenshots: [
      {
        src: '/AppImages/widgets/stats-widget.png',
        sizes: '600x400',
        type: 'image/png',
        label: 'BookAI Stats Widget'
      }
    ],
    icons: [
      {
        src: '/AppImages/widgets/stats-icon.png',
        sizes: '96x96',
        type: 'image/png'
      }
    ]
  },
  'quick-generate': {
    name: 'Quick Generate',
    shortName: 'Generate',
    description: 'Quickly generate a new book',
    screenshots: [
      {
        src: '/AppImages/widgets/generate-widget.png',
        sizes: '600x400',
        type: 'image/png',
        label: 'Quick Generate Widget'
      }
    ],
    icons: [
      {
        src: '/AppImages/widgets/generate-icon.png',
        sizes: '96x96',
        type: 'image/png'
      }
    ]
  }
}; 