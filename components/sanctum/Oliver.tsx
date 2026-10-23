/**
 * Oliver: Briz the Sage’s faithful dog. A Pembroke Welsh Corgi, tan and white,
 * pure white paws, short legs, big expressive ears, and an intact, fluffy tail.
 * Parts carry data-part so CSS can flick ears, blink, wag and look up.
 * Keep these markings consistent anywhere Oliver appears.
 */

const INK = "var(--line)";
const TAN = "#d98a3d";
const TAN_DARK = "#b56a26";
const WHITE = "#fbf3e4";
const PINK = "#e8a3a0";

export default function Oliver({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" overflow="visible">
      {/* tail: tan, fluffy, white tip; curls up behind him (wags from its base) */}
      <g data-part="tail" style={{ transformOrigin: "176px 176px" }}>
        <path
          d="M172 182 C186 170 194 150 200 132 C204 120 214 114 222 120 C230 128 224 142 216 152 C206 166 194 182 180 192 Z"
          fill={TAN}
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M206 120 C214 112 228 116 226 128 C222 132 214 128 206 120 Z" fill={WHITE} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M190 150 C196 146 202 140 206 132 M184 166 C192 162 198 156 202 148" fill="none" stroke={TAN_DARK} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* body (sitting) */}
      <path d="M92 116 C84 140 78 176 80 204 L176 204 C182 176 170 136 152 116 Z" fill={TAN} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* white chest */}
      <path d="M104 118 C98 140 100 170 112 196 L136 196 C146 170 146 140 138 118 Z" fill={WHITE} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {/* hind haunch, with a pure white paw */}
      <ellipse cx="160" cy="184" rx="28" ry="24" fill={TAN} stroke={INK} strokeWidth="3" />
      <ellipse cx="174" cy="208" rx="16" ry="8" fill={WHITE} stroke={INK} strokeWidth="2.6" />
      {/* short front legs, white, with white paws */}
      <g fill={WHITE} stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M100 176 L98 204 L116 204 L116 176 Z" />
        <path d="M124 176 L124 204 L142 204 L140 176 Z" />
        <ellipse cx="106" cy="208" rx="12" ry="7" />
        <ellipse cx="134" cy="208" rx="12" ry="7" />
      </g>
      <path d="M104 206 v4 M108 206 v4 M132 206 v4 M136 206 v4" stroke={INK} strokeWidth="1.4" />
      {/* collar with a tiny blue-house tag */}
      <path d="M96 116 C110 124 134 124 150 114" fill="none" stroke="var(--teal-500)" strokeWidth="7" strokeLinecap="round" />
      <path d="M96 116 C110 124 134 124 150 114" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="122" cy="128" r="6" fill="var(--ochre-300)" stroke={INK} strokeWidth="2" />
      <path d="M118.5 130 C118 126 120 124 122 124 C124 124 126 126 125.5 130 Z" fill="var(--teal-500)" />

      {/* head (tilts up toward the Sage) */}
      <g data-part="head" style={{ transformOrigin: "122px 112px" }}>
        {/* ears: big, upright, pink inside */}
        <g data-part="ear-l" style={{ transformOrigin: "96px 62px" }}>
          <path d="M82 70 C78 48 84 24 96 12 C106 26 112 46 110 62 Z" fill={TAN} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M88 64 C86 48 90 32 96 24 C102 34 104 48 104 60 Z" fill={PINK} />
        </g>
        <g data-part="ear-r" style={{ transformOrigin: "148px 62px" }}>
          <path d="M162 70 C166 48 160 24 148 12 C138 26 132 46 134 62 Z" fill={TAN} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M156 64 C158 48 154 32 148 24 C142 34 140 48 140 60 Z" fill={PINK} />
        </g>
        {/* head shape */}
        <path
          d="M78 84 C76 60 96 46 122 46 C148 46 168 60 166 84 C166 100 156 112 144 118 C134 122 110 122 100 118 C88 112 78 100 78 84 Z"
          fill={TAN}
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* white blaze and muzzle */}
        <path d="M116 52 C118 48 126 48 128 52 L132 84 C140 90 144 102 136 112 C128 120 116 120 108 112 C100 102 104 90 112 84 Z" fill={WHITE} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        {/* eyes (blink) */}
        <g data-part="eyes">
          <ellipse cx="102" cy="80" rx="5.5" ry="6.5" fill={INK} />
          <ellipse cx="142" cy="80" rx="5.5" ry="6.5" fill={INK} />
          <circle cx="104" cy="78" r="1.8" fill="#fff" />
          <circle cx="144" cy="78" r="1.8" fill="#fff" />
        </g>
        <path d="M94 70 C98 67 104 67 108 70 M136 70 C140 67 146 67 150 70" fill="none" stroke={TAN_DARK} strokeWidth="2" strokeLinecap="round" />
        {/* nose, smile, tongue */}
        <ellipse cx="122" cy="96" rx="7" ry="5" fill={INK} />
        <path d="M122 101 C122 106 116 109 112 106 M122 101 C122 106 128 109 132 106" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M118 107 C118 114 126 114 126 107 Z" fill="#e0707a" stroke={INK} strokeWidth="1.6" />
      </g>
    </svg>
  );
}
