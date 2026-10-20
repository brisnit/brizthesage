/**
 * Shared SVG definitions referenced across the site by id:
 *   filter="url(#ink)"      gives outlines a slightly wobbly, hand-inked edge
 *   filter="url(#ink-soft)" a gentler wobble for large shapes
 *   fill="url(#hatch)"      cross-hatching for shadows
 */
export default function InkDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-soft" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1a1022" strokeWidth="1.2" strokeOpacity="0.35" />
        </pattern>
        <pattern id="hatch-light" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#f3e7cc" strokeWidth="1" strokeOpacity="0.18" />
        </pattern>
        <radialGradient id="glow-amber">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#f0a944" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e0a23a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-teal">
          <stop offset="0" stopColor="#c6fff2" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#6cc8bd" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4fb3a9" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
