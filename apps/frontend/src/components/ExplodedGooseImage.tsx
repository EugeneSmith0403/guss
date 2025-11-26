import clsx from 'clsx';

interface ExplodedGooseImageProps {
  className?: string;
}

export const ExplodedGooseImage = ({ className }: ExplodedGooseImageProps) => {
  return (
    <div
      className={clsx('select-none flex items-center justify-center', className)}
    >
      <svg
        width="400"
        height="400"
        viewBox="0 0 300 300"
        className="transition-all duration-300"
        style={{
          filter: 'drop-shadow(0 0 15px rgba(184,0,0,0.6))',
        }}
      >
        <ellipse cx="150" cy="240" rx="100" ry="40" fill="#8B0000" opacity="0.7" />
        <ellipse cx="150" cy="240" rx="90" ry="35" fill="#B80000" opacity="0.8" />
        <ellipse cx="150" cy="240" rx="75" ry="28" fill="#DC143C" opacity="0.6" />

        <rect x="140" y="250" width="10" height="30" fill="#222" />
        <rect x="160" y="250" width="10" height="30" fill="#222" />
        <rect x="143" y="260" width="4" height="15" fill="#D1D5DB" opacity="0.7" />
        <rect x="163" y="258" width="4" height="15" fill="#D1D5DB" opacity="0.7" />
        <ellipse cx="145" cy="283" rx="7" ry="5" fill="#111" />
        <ellipse cx="165" cy="283" rx="7" ry="5" fill="#111" />

        <circle cx="80" cy="120" r="8" fill="#B80000" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.4;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="220" cy="100" r="6" fill="#8B0000" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="100" cy="180" rx="12" ry="8" fill="#DC143C" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="200" cy="190" rx="10" ry="7" fill="#B80000" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.8s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="70" cy="200" r="5" fill="#8B0000" opacity="0.5" />
        <circle cx="230" cy="210" r="7" fill="#DC143C" opacity="0.4" />

        <path
          d="M 150 200 Q 120 150 90 120 Q 100 100 120 90 Q 140 95 150 100 Q 160 85 180 80 Q 200 85 210 100 Q 220 120 200 140 Q 180 160 150 200"
          fill="#8B4513"
          opacity="0.8"
        />
        <path
          d="M 150 200 Q 130 180 110 160 Q 100 140 110 120 Q 130 110 150 115 Q 170 105 190 110 Q 210 125 200 150 Q 180 180 150 200"
          fill="#654321"
          opacity="0.7"
        />
        <path
          d="M 150 200 Q 140 170 130 140 Q 125 120 135 105 Q 150 100 165 105 Q 180 115 175 135 Q 170 160 150 200"
          fill="#A0522D"
          opacity="0.6"
        />

        <ellipse cx="110" cy="130" rx="8" ry="4" fill="#F0F0F0" opacity="0.8" transform="rotate(45 110 130)" />
        <ellipse cx="190" cy="110" rx="6" ry="3" fill="#E5E7EB" opacity="0.7" transform="rotate(-30 190 110)" />
        <ellipse cx="130" cy="90" rx="5" ry="2.5" fill="#F5F5F5" opacity="0.6" transform="rotate(60 130 90)" />
        <ellipse cx="170" cy="85" rx="7" ry="3.5" fill="#E8E8E8" opacity="0.7" transform="rotate(-45 170 85)" />

        <ellipse cx="100" cy="140" rx="12" ry="8" fill="#8B0000" opacity="0.7" />
        <ellipse cx="200" cy="125" rx="10" ry="6" fill="#A52A2A" opacity="0.6" />
        <ellipse cx="120" cy="100" rx="8" ry="5" fill="#8B0000" opacity="0.5" />
        <ellipse cx="180" cy="95" rx="9" ry="6" fill="#B80000" opacity="0.6" />

        <ellipse cx="60" cy="80" rx="6" ry="3" fill="#4A524A" opacity="0.6" transform="rotate(20 60 80)">
          <animate attributeName="cy" values="80;60;80" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="240" cy="70" rx="5" ry="2.5" fill="#7A8578" opacity="0.5" transform="rotate(-15 240 70)">
          <animate attributeName="cy" values="70;50;70" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="50" cy="150" rx="4" ry="2" fill="#4A524A" opacity="0.4" transform="rotate(45 50 150)">
          <animate attributeName="cy" values="150;130;150" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="250" cy="160" rx="5" ry="2.5" fill="#7A8578" opacity="0.5" transform="rotate(-30 250 160)">
          <animate attributeName="cy" values="160;140;160" dur="2.8s" repeatCount="indefinite" />
        </ellipse>

        <path
          d="M 145 250 L 143 260 L 147 260 Z"
          fill="#B80000"
          opacity="0.8"
        >
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path
          d="M 165 250 L 163 260 L 167 260 Z"
          fill="#B80000"
          opacity="0.8"
        >
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.3s" repeatCount="indefinite" />
        </path>
        <path
          d="M 150 250 L 148 255 L 152 255 Z"
          fill="#DC143C"
          opacity="0.6"
        >
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.7s" repeatCount="indefinite" />
        </path>

        <circle cx="150" cy="200" r="15" fill="rgba(100,100,100,0.3)">
          <animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="190" r="10" fill="rgba(120,120,120,0.2)">
          <animate attributeName="r" values="10;18;10" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="195" r="12" fill="rgba(110,110,110,0.25)">
          <animate attributeName="r" values="12;22;12" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.08;0.25" dur="1.8s" repeatCount="indefinite" />
        </circle>

        <ellipse cx="150" cy="240" rx="100" ry="40" fill="rgba(184,0,0,0.1)">
          <animate attributeName="rx" values="100;105;100" dur="3s" repeatCount="indefinite" />
          <animate attributeName="ry" values="40;42;40" dur="3s" repeatCount="indefinite" />
        </ellipse>

        <rect x="50" y="50" width="200" height="250" fill="transparent" pointerEvents="none" />
      </svg>
    </div>
  );
};

