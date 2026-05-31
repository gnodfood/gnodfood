import React from "react";

interface GnodLogoProps {
  className?: string;
  showText?: boolean;
}

export default function GnodLogo({ className = "w-10 h-10" }: GnodLogoProps) {
  return (
    <svg
      viewBox="0 0 500 500"
      className={`${className} transition-all duration-300`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients to match the colors of the uploaded logo */}
        {/* Main circular background gradient */}
        <radialGradient id="logoBgGrad" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
          <stop offset="0%" stopColor="#7cbcd5" />
          <stop offset="65%" stopColor="#4f9ebb" />
          <stop offset="100%" stopColor="#257f9c" />
        </radialGradient>

        {/* Outer watercolor circular stroke gradient */}
        <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0da9bf" />
          <stop offset="50%" stopColor="#008fa7" />
          <stop offset="100%" stopColor="#0a697c" />
        </linearGradient>

        {/* Light beam background glow behind manta */}
        <linearGradient id="mantaBeam" x1="100%" y1="35%" x2="0%" y2="70%">
          <stop offset="0%" stopColor="#a3e3fc" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#e3f6fe" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#021a30" floodOpacity="0.25" />
        </filter>

        <filter id="textDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#021624" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* 1. Outer Swirling Paint Brush Ring */}
      {/* Dynamic artistic waves around the circle to replicate the paint/watercolor brush strokes in the uploaded logo */}
      <path
        d="M 250,22 C 375,22 478,125 478,250 C 478,375 375,478 250,478 C 125,478 22,375 22,250 C 22,125 125,22 250,22 Z"
        fill="none"
        stroke="url(#brushGrad)"
        strokeWidth="28"
        strokeLinecap="round"
        strokeDasharray="900 100"
        transform="rotate(-15, 250, 250)"
      />
      {/* Secondary accent ring for artistic hand-drawn texture */}
      <path
        d="M 250,30 C 370,30 468,128 468,248 C 468,368 370,466 250,466 C 130,466 32,368 32,248 C 32,150 110,65 210,35"
        fill="none"
        stroke="#0da9bf"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Internal crescent highlights imitating brush strokes */}
      <path
        d="M 120,48 C 58,110 40,200 68,285 C 92,360 170,440 250,455 C 330,470 410,430 445,365"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M 320,38 C 390,56 448,115 464,190"
        fill="none"
        stroke="#ffffff"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* 2. Main Inner Circle Background */}
      <circle
        cx="250"
        cy="250"
        r="196"
        fill="url(#logoBgGrad)"
        filter="url(#logoShadow)"
      />

      {/* 3. Light Spotlight Beam emitting behind the Manta Ray */}
      <polygon
        points="390,165 423,172 210,335 155,300"
        fill="url(#mantaBeam)"
        opacity="0.65"
      />

      {/* 4. Manta Ray Symbol flying gracefully towards the upper-right */}
      <g id="manta-ray-logo" transform="translate(15, -10)">
        {/* Shadow */}
        <path
          d="M 245,215 C 275,190 325,178 395,175 C 360,208 350,225 365,268 M 365,268 C 360,245 325,235 245,215 Z"
          fill="#000000"
          opacity="0.15"
          transform="translate(4, 8)"
        />

        {/* Tail */}
        <path
          d="M 365,225 C 367,235 370,250 371,265 C 373,285 366,305 352,320"
          stroke="#051da3"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Core Body of Manta Ray */}
        {/* Facing right, sleek aerodynamic shapes exactly like the image upload */}
        <path
          d="M 245,215 
             C 285,188 328,172 395,173 
             C 399,173 401,176 397,179
             C 368,198 355,212 365,228 
             C 328,210 286,215 245,215 Z"
          fill="#051da3"
        />
        {/* Upper Wing Shading to provide sleek depth */}
        <path
          d="M 285,200 C 328,182 375,176 395,173 C 365,195 354,208 360,218 C 328,202 295,202 285,200 Z"
          fill="#0828cf"
        />
        <path
          d="M 335,176 C 365,174 388,173 395,173 C 368,186 358,192 362,198 C 348,188 338,180 335,176 Z"
          fill="#4a76ff"
          opacity="0.4"
        />
      </g>

      {/* 5. Gnod Food Text Backdrop Cards (Pill shapes in light translucent grey-white) */}
      <g id="text-backing" transform="translate(0, 10)">
        {/* For "GNOD" */}
        <rect x="105" y="248" width="142" height="52" rx="10" fill="#fcfcfc" fillOpacity="0.42" />
        {/* For "FOOD" */}
        <rect x="255" y="248" width="142" height="52" rx="10" fill="#fcfcfc" fillOpacity="0.42" />
      </g>

      {/* 6. Bold Modern Text: "GNOD FOOD" */}
      <text
        x="176"
        y="287"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontWeight="800"
        fontSize="44"
        fill="#041cb3"
        letterSpacing="1.5"
      >
        GNOD
      </text>
      <text
        x="326"
        y="287"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontWeight="800"
        fontSize="44"
        fill="#041cb3"
        letterSpacing="1.5"
      >
        FOOD
      </text>

      {/* 7. Elegant cursive calligraphy text underneath: "fresh & tasty" */}
      {/* Handcrafted coordinate offsets to match the artistic placement */}
      <g filter="url(#textDropShadow)" transform="translate(0, 10)">
        <text
          x="250"
          y="355"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', Times, serif"
          fontStyle="italic"
          fontWeight="bold"
          fontSize="36"
          fill="#ffffff"
          letterSpacing="0.5"
        >
          fresh & tasty
        </text>
      </g>
    </svg>
  );
}
