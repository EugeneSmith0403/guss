import { useState, useCallback } from 'react';
import { throttle } from 'lodash';
import clsx from 'clsx';

interface GooseImageProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const GooseImage = ({ onClick, disabled = false, className }: GooseImageProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled || !onClick) return;

    setIsClicked(true);
    onClick();

    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  }, [disabled, onClick]);

  const throttledClick = useCallback(throttle(handleClick, 200), [handleClick]);

  return (
    <div
      className={clsx(
        'cursor-pointer select-none flex items-center justify-center',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      onClick={throttledClick}
    >
      <svg
        width="400"
        height="400"
        viewBox="0 0 300 300"
        className={clsx('transition-all duration-300', isClicked && 'animate-pulse')}
        style={{
          filter: isClicked
            ? 'drop-shadow(0 0 25px rgba(220,0,0,0.9)) brightness(1.2)'
            : 'drop-shadow(0 0 10px rgba(0,255,120,0.4))',
          transform: isClicked ? 'scale(1.1) rotate(1deg)' : 'scale(1)',
        }}
      >
        {/* === BODY === */}
        <ellipse cx="150" cy="200" rx="85" ry="65" fill="#4A524A" />
        <ellipse cx="150" cy="200" rx="78" ry="58" fill="#7A8578" />

        {/* === NECK === */}
        <path
          d="M 150 160 Q 160 120 175 80 Q 185 60 195 55"
          stroke="#4A524A"
          strokeWidth="32"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 150 160 Q 160 120 175 80 Q 185 60 195 55"
          stroke="#7A8578"
          strokeWidth="26"
          fill="none"
          strokeLinecap="round"
        />

        {/* === HEAD === */}
        <ellipse cx="195" cy="55" rx="38" ry="32" fill="#4A524A" />
        <ellipse cx="195" cy="55" rx="30" ry="26" fill="#7A8578" />

        {/* === ROTTING PATCHES === */}
        <ellipse cx="140" cy="185" rx="17" ry="14" fill="#1A1A1A" opacity="0.7" />
        <ellipse cx="165" cy="215" rx="13" ry="11" fill="#1A1A1A" opacity="0.7" />
        <ellipse cx="180" cy="75" rx="9" ry="7" fill="#1A1A1A" opacity="0.75" />

        {/* === BEAK === */}
        <polygon points="170,55 135,50 155,65" fill="#2A2A2A" />
        <polygon points="168,55 140,50 153,63" fill="#111" />

        {/* === EYES === */}
        <circle
          cx="210"
          cy="50"
          r="12"
          fill="#B80000"
          style={{ filter: 'drop-shadow(0 0 12px rgba(255,0,0,0.9))' }}
        />
        <circle cx="210" cy="50" r="6" fill="#000" />
        <circle cx="210" cy="50" r="3" fill="#FF6F6F" opacity="0.4" />

        {/* Damaged eye */}
        <ellipse cx="182" cy="48" rx="9" ry="7" fill="#B80000" opacity="0.8" />
        <ellipse cx="182" cy="48" rx="5" ry="4" fill="#000" />

        {/* === WING === */}
        <ellipse cx="125" cy="180" rx="40" ry="55" fill="#4A524A" />
        <ellipse cx="125" cy="180" rx="33" ry="48" fill="#7A8578" />
        <ellipse cx="118" cy="165" rx="9" ry="13" fill="#E5E7EB" opacity="0.5" />
        <ellipse cx="138" cy="195" rx="7" ry="11" fill="#E5E7EB" opacity="0.5" />

        {/* === LEGS === */}
        <rect x="140" y="250" width="10" height="30" fill="#222" />
        <rect x="160" y="250" width="10" height="30" fill="#222" />
        <rect x="143" y="260" width="4" height="15" fill="#D1D5DB" opacity="0.7" />
        <rect x="163" y="258" width="4" height="15" fill="#D1D5DB" opacity="0.7" />

        <ellipse cx="145" cy="283" rx="7" ry="5" fill="#111" />
        <ellipse cx="165" cy="283" rx="7" ry="5" fill="#111" />

        {/* === SCARS === */}
        <path d="M 175 60 Q 185 55 195 55" stroke="#111" strokeWidth="2" opacity="0.6" />
        <path d="M 185 40 Q 195 35 205 40" stroke="#111" strokeWidth="2" opacity="0.6" />

        {/* === CLICK BLOOD EFFECT === */}
        {isClicked && (
          <>
            <circle cx="150" cy="55" r="4" fill="#B80000" opacity="0.8">
              <animate attributeName="cy" values="55;40;55" dur="0.3s" repeatCount="1" />
              <animate attributeName="opacity" values="1;0;1" dur="0.3s" repeatCount="1" />
            </circle>
            <circle cx="215" cy="55" r="4" fill="#B80000" opacity="0.8">
              <animate attributeName="cy" values="55;40;55" dur="0.3s" repeatCount="1" />
              <animate attributeName="opacity" values="1;0;0" dur="0.3s" repeatCount="1" />
            </circle>
          </>
        )}

        <rect x="50" y="50" width="200" height="220" fill="transparent" pointerEvents="all" />
            {/* === EXTRA: FORKED TONGUE === */}
      <path d="M165 63 Q175 70 185 65 Q180 70 185 75 Q175 72 168 78" fill="#B80000" stroke="#7A0000" strokeWidth="1.5" />

      {/* === EXTRA: TORN FLESH & BONES === */}
      <path d="M130 210 Q140 220 150 210 Q145 230 135 235 Z" fill="#8B0000" opacity="0.8" />
      <rect x="138" y="224" width="5" height="18" fill="#F0F0F0" />
      <rect x="147" y="224" width="5" height="18" fill="#F0F0F0" />

      {/* === EXTRA: GLOWING TOXIC AURA === */}
      <circle cx="150" cy="180" r="120" fill="rgba(0,255,80,0.08)" />

      {/* === BREATHING ANIMATION === */}
      <ellipse cx="150" cy="200" rx="85" ry="65" fill="#4A524A">
        <animate attributeName="ry" values="65;70;65" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* === FIRE EYES ON CLICK === */}
      {isClicked && (
        <>
          <radialGradient id="fireEye">
            <stop offset="0%" stopColor="#FFEE00" />
            <stop offset="50%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#B80000" />
          </radialGradient>
          <circle cx="210" cy="50" r="15" fill="url(#fireEye)">
            <animate attributeName="r" values="12;18;12" dur="0.4s" repeatCount="1" />
          </circle>
          <circle cx="182" cy="48" r="12" fill="url(#fireEye)">
            <animate attributeName="r" values="9;15;9" dur="0.4s" repeatCount="1" />
          </circle>
        </>
      )}

    </svg>
    </div>
  );
};
