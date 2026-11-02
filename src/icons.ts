// Inline copies of public/assets/icons/*.svg, tagged with an `.icon` class so
// style.css can drive hover/press micro-animations (scale + wiggle + glow)
// without an extra network request per icon.

export type IconName = 'star' | 'ticket' | 'close' | 'sound-on' | 'sound-off';

const ICONS: Record<IconName, string> = {
  star: `<svg viewBox="0 0 9 8" shape-rendering="crispEdges" aria-hidden="true">
    <g fill="#12151b"><rect x="4" y="0" width="1" height="1"/><rect x="4" y="1" width="1" height="1"/><rect x="2" y="2" width="1" height="1"/><rect x="6" y="2" width="1" height="1"/><rect x="0" y="3" width="2" height="1"/><rect x="7" y="3" width="2" height="1"/><rect x="0" y="4" width="1" height="1"/><rect x="8" y="4" width="1" height="1"/><rect x="1" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="0" y="6" width="2" height="1"/><rect x="7" y="6" width="2" height="1"/><rect x="0" y="7" width="1" height="1"/><rect x="8" y="7" width="1" height="1"/></g>
    <g fill="#d9b84a"><rect x="3" y="2" width="3" height="1"/><rect x="2" y="3" width="5" height="1"/><rect x="1" y="4" width="7" height="1"/><rect x="2" y="5" width="5" height="1"/></g>
  </svg>`,
  ticket: `<svg viewBox="0 0 16 10" shape-rendering="crispEdges" aria-hidden="true">
    <g fill="#12151b"><rect x="0" y="0" width="16" height="1"/><rect x="0" y="1" width="1" height="1"/><rect x="0" y="2" width="1" height="1"/><rect x="15" y="2" width="1" height="1"/><rect x="0" y="3" width="1" height="1"/><rect x="3" y="3" width="1" height="1"/><rect x="15" y="3" width="1" height="1"/><rect x="0" y="4" width="1" height="1"/><rect x="3" y="4" width="1" height="1"/><rect x="15" y="4" width="1" height="1"/><rect x="0" y="5" width="1" height="1"/><rect x="3" y="5" width="1" height="1"/><rect x="15" y="5" width="1" height="1"/><rect x="0" y="6" width="1" height="1"/><rect x="3" y="6" width="1" height="1"/><rect x="15" y="6" width="1" height="1"/><rect x="0" y="7" width="1" height="1"/><rect x="15" y="7" width="1" height="1"/><rect x="0" y="8" width="1" height="1"/><rect x="0" y="9" width="16" height="1"/></g>
    <g fill="#c0531c"><rect x="1" y="1" width="15" height="1"/><rect x="1" y="2" width="1" height="1"/><rect x="14" y="2" width="1" height="1"/><rect x="1" y="3" width="1" height="1"/><rect x="14" y="3" width="1" height="1"/><rect x="1" y="4" width="1" height="1"/><rect x="14" y="4" width="1" height="1"/><rect x="1" y="5" width="1" height="1"/><rect x="14" y="5" width="1" height="1"/><rect x="1" y="6" width="1" height="1"/><rect x="14" y="6" width="1" height="1"/><rect x="1" y="7" width="1" height="1"/><rect x="14" y="7" width="1" height="1"/><rect x="1" y="8" width="15" height="1"/></g>
    <g fill="#f4ead2"><rect x="2" y="2" width="12" height="1"/><rect x="2" y="3" width="1" height="1"/><rect x="4" y="3" width="10" height="1"/><rect x="2" y="4" width="1" height="1"/><rect x="4" y="4" width="10" height="1"/><rect x="2" y="5" width="1" height="1"/><rect x="4" y="5" width="10" height="1"/><rect x="2" y="6" width="1" height="1"/><rect x="4" y="6" width="10" height="1"/><rect x="2" y="7" width="12" height="1"/></g>
  </svg>`,
  close: `<svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
    <g fill="#ff4fa3"><rect x="0" y="0" width="1" height="1"/><rect x="7" y="0" width="1" height="1"/><rect x="0" y="1" width="2" height="1"/><rect x="6" y="1" width="2" height="1"/><rect x="1" y="2" width="2" height="1"/><rect x="5" y="2" width="2" height="1"/><rect x="2" y="3" width="4" height="1"/><rect x="2" y="4" width="4" height="1"/><rect x="1" y="5" width="2" height="1"/><rect x="5" y="5" width="2" height="1"/><rect x="0" y="6" width="2" height="1"/><rect x="6" y="6" width="2" height="1"/><rect x="0" y="7" width="1" height="1"/><rect x="7" y="7" width="1" height="1"/></g>
  </svg>`,
  'sound-on': `<svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
    <g fill="#4ddbff"><rect x="2" y="0" width="2" height="1"/><rect x="2" y="1" width="2" height="1"/><rect x="5" y="1" width="2" height="1"/><rect x="2" y="2" width="2" height="1"/><rect x="5" y="2" width="2" height="1"/><rect x="2" y="3" width="2" height="1"/><rect x="5" y="3" width="2" height="1"/><rect x="0" y="4" width="7" height="1"/><rect x="0" y="5" width="4" height="1"/><rect x="0" y="6" width="4" height="1"/></g>
  </svg>`,
  'sound-off': `<svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
    <g fill="#8a8497"><rect x="2" y="0" width="2" height="1"/><rect x="2" y="1" width="2" height="1"/><rect x="2" y="2" width="2" height="1"/><rect x="2" y="3" width="2" height="1"/><rect x="0" y="4" width="7" height="1"/><rect x="0" y="5" width="4" height="1"/><rect x="0" y="6" width="4" height="1"/></g>
  </svg>`,
};

/** Returns an animated pixel icon (`.icon .icon-<name>`); see style.css for the hover/press effects. */
export function iconSVG(name: IconName, extraClass = ''): string {
  const svg = ICONS[name];
  const classAttr = `icon icon-${name}${extraClass ? ` ${extraClass}` : ''}`;
  return svg.replace('<svg ', `<svg class="${classAttr}" `);
}
