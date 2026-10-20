/**
 * The friendly turquoise skeleton companion, after the one in Briz’s portrait.
 * Parts are tagged with data-part so scenes can animate the head, jaw and arm.
 */

type Props = {
  pose?: "peek" | "point-down" | "wave";
  className?: string;
  /** Show only the head and one hand (for peeking around doors). */
  headOnly?: boolean;
};

export default function Skeleton({ pose = "wave", className, headOnly }: Props) {
  const bone = "var(--teal-400)";
  const shade = "var(--teal-700)";
  const ink = "var(--line)";

  const arm =
    pose === "point-down" ? (
      <g data-part="arm">
        <path d="M118 186 C138 196 150 214 152 236" stroke={ink} strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M118 186 C138 196 150 214 152 236" stroke={bone} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M152 236 C153 252 154 262 156 276" stroke={ink} strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M152 236 C153 252 154 262 156 276" stroke={bone} strokeWidth="6.5" fill="none" strokeLinecap="round" />
        <path d="M150 274 L158 296 M156 276 L164 290 M152 276 L148 288" stroke={ink} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="152" cy="236" r="6" fill={bone} stroke={ink} strokeWidth="2.4" />
      </g>
    ) : pose === "wave" ? (
      <g data-part="arm" style={{ transformOrigin: "118px 186px" }}>
        <path d="M118 186 C140 178 154 160 158 138" stroke={ink} strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M118 186 C140 178 154 160 158 138" stroke={bone} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M158 138 C160 122 164 110 168 98" stroke={ink} strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M158 138 C160 122 164 110 168 98" stroke={bone} strokeWidth="6.5" fill="none" strokeLinecap="round" />
        <path d="M168 98 L162 80 M168 98 L170 78 M168 98 L178 82 M168 98 L184 92" stroke={ink} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="158" cy="138" r="6" fill={bone} stroke={ink} strokeWidth="2.4" />
      </g>
    ) : (
      <g data-part="arm">
        <path d="M40 120 C30 112 22 104 20 96" stroke={ink} strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M40 120 C30 112 22 104 20 96" stroke={bone} strokeWidth="6.5" fill="none" strokeLinecap="round" />
        <path d="M20 96 L10 88 M20 96 L14 82 M20 96 L22 80 M20 96 L29 84" stroke={ink} strokeWidth="3.4" strokeLinecap="round" />
      </g>
    );

  return (
    <svg
      viewBox={headOnly ? "0 0 200 190" : "0 0 200 310"}
      className={className}
      aria-hidden="true"
      overflow="visible"
    >
      {!headOnly && (
        <g data-part="body">
          {/* spine */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x="96" y={168 + i * 20} width="18" height="14" rx="6" fill={bone} stroke={ink} strokeWidth="2.6" />
          ))}
          {/* ribs */}
          {[0, 1, 2].map((i) => (
            <g key={i} fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round">
              <path d={`M100 ${200 + i * 18} C78 ${196 + i * 18} 66 ${208 + i * 18} 70 ${222 + i * 16}`} />
              <path d={`M110 ${200 + i * 18} C132 ${196 + i * 18} 144 ${208 + i * 18} 140 ${222 + i * 16}`} />
            </g>
          ))}
          {[0, 1, 2].map((i) => (
            <g key={`r${i}`} fill="none" stroke={bone} strokeWidth="4.5" strokeLinecap="round">
              <path d={`M100 ${200 + i * 18} C78 ${196 + i * 18} 66 ${208 + i * 18} 70 ${222 + i * 16}`} />
              <path d={`M110 ${200 + i * 18} C132 ${196 + i * 18} 144 ${208 + i * 18} 140 ${222 + i * 16}`} />
            </g>
          ))}
          {/* collarbone */}
          <path d="M70 186 C88 180 122 180 128 188" stroke={ink} strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M70 186 C88 180 122 180 128 188" stroke={bone} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )}
      {(!headOnly || pose === "peek") && arm}
      <g data-part="head" style={{ transformOrigin: "105px 160px" }}>
        {/* skull: long, tilted, a bit wonky, like the one in the portrait */}
        <path
          d="M34 92 C24 44 70 8 118 14 C166 20 186 66 172 108 C166 128 156 140 146 146 L142 160 L76 164 L70 148 C52 138 38 118 34 92 Z"
          fill={bone}
          stroke={ink}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M44 100 C42 70 60 44 86 34" fill="none" stroke="#c6fff2" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
        <path d="M150 40 C166 58 172 84 166 106" fill="none" stroke={shade} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
        {/* eye sockets */}
        <g data-part="eyes">
          <ellipse cx="78" cy="88" rx="19" ry="23" fill="var(--plum-950)" stroke={ink} strokeWidth="3" />
          <ellipse cx="130" cy="84" rx="22" ry="25" fill="var(--plum-950)" stroke={ink} strokeWidth="3" />
          <circle data-part="pupil" cx="82" cy="92" r="4" fill="var(--ochre-300)" />
          <circle data-part="pupil" cx="134" cy="88" r="4.5" fill="var(--ochre-300)" />
        </g>
        {/* nose */}
        <path d="M104 106 L96 122 L110 121 Z" fill="var(--plum-950)" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
        {/* grin */}
        <g data-part="jaw">
          <path d="M62 132 C84 146 128 146 152 128 L146 152 C120 166 88 166 70 154 Z" fill="var(--plum-900)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={70 + i * 11} y={134 + Math.sin(i / 2) * 3} width="9" height="10" rx="2" fill="#e9fff8" stroke={ink} strokeWidth="1.8" />
          ))}
        </g>
      </g>
    </svg>
  );
}
