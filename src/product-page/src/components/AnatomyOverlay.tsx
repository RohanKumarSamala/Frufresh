import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { FruitSpecimen } from '../types';
import { useIsMobile } from '../hooks/useIsMobile';

interface AnatomyPoint {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  imageNormX: number; // 0..1 in 1920x1080 frame space
  imageNormY: number; // 0..1 in 1920x1080 frame space
  side: 'left' | 'right';
  className: string;
}

interface AnatomyOverlayProps {
  selectedFruit: FruitSpecimen;
  scrollProgress: number;
  onOpenPartnership: () => void;
  onSelectNextFruit: () => void;
}

export function AnatomyOverlay({
  selectedFruit,
  scrollProgress,
  onSelectNextFruit,
}: AnatomyOverlayProps) {
  const isApple = selectedFruit.id === 'apple';
  const isOrange = selectedFruit.id === 'orange';
  const isDragonFruit = selectedFruit.id === 'dragonfruit';
  // Sliced fruit phase starts at ~86% scrub. Fades out smoothly when scrolling past track into lower dossier.
  const scrubEl = typeof document !== 'undefined' ? document.getElementById('fruit-scrub-track') : null;
  const scrubHeight = scrubEl ? Math.max(1, scrubEl.offsetHeight - window.innerHeight) : 2000;
  const excess = typeof window !== 'undefined' ? Math.max(0, window.scrollY - scrubHeight) : 0;

  // Clean entry opacity: ONLY starts fading in at 0.86 (when slices expand), fully opaque by 0.91
  const entryOpacity = scrollProgress < 0.86
    ? 0
    : Math.min(1, (scrollProgress - 0.86) / 0.05);

  // Clean exit opacity: fades out smoothly over 40% of viewport height as commercial dossier enters
  const exitOpacity = excess > 0 ? Math.max(0, 1 - excess / (window.innerHeight * 0.40)) : 1;

  const totalOpacity = entryOpacity * exitOpacity;
  const isVisible = totalOpacity > 0.005;
  const isMobile = useIsMobile();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lineCoords, setLineCoords] = useState<
    Array<{
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      pathData: string;
    }>
  >([]);

  // Card element refs
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  /* Memoised commercial anatomy data with pinpoint precision on fruit slices */
  const anatomyData: AnatomyPoint[] = useMemo(
    () =>
      isApple
    ? [
        {
          id: 'layer',
          title: 'Cellular Wall & Firmness',
          subtitle: '7.8–9.0 kg/cm² penetrometer pressure for signature acoustic crispness.',
          accentColor: '#B87333',
          imageNormX: 0.445,
          imageNormY: 0.375, // Inside golden cut surface / cellular wall of Slice 2
          side: 'left',
          className: 'top-[30%] sm:top-[32%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'moisture',
          title: '86% Cold Juice Retention',
          subtitle: 'Turgid cellular structure locks cold juice throughout prolonged retail display.',
          accentColor: '#B87333',
          imageNormX: 0.585,
          imageNormY: 0.525, // Inside exposed golden succulent cut flesh of Slice 4
          side: 'right',
          className: 'top-[44%] sm:top-[46%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
        {
          id: 'sugar',
          title: 'Zero Internal Defects (NIR)',
          subtitle: '100% Near-Infrared optical sorting: zero watercore, zero internal browning.',
          accentColor: '#10b981',
          imageNormX: 0.450,
          imageNormY: 0.695, // Inside defect-free interior flesh of Slice 6
          side: 'left',
          className: 'top-[68%] sm:top-[70%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'core',
          title: 'Refractive Sugar Core',
          subtitle: '15.8° Brix gold-standard concentrated sugar distribution.',
          accentColor: '#f59e0b',
          imageNormX: 0.535,
          imageNormY: 0.770, // Sugar core / sweet flesh of lower slice (Slice 7)
          side: 'right',
          className: 'top-[70%] sm:top-[72%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
      ]
    : isOrange
    ? [
        {
          id: 'layer',
          title: 'Vesicle Turgor & Juice Density',
          subtitle: '52% extraction efficiency with microscopic juice vesicle membranes.',
          accentColor: '#ea580c',
          imageNormX: 0.440,
          imageNormY: 0.420,
          side: 'left',
          className: 'top-[30%] sm:top-[32%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'moisture',
          title: 'Aromatic Flavedo Terpenes',
          subtitle: 'Dense oil glands providing explosive citrus bouquet and natural wax defense.',
          accentColor: '#ea580c',
          imageNormX: 0.610,
          imageNormY: 0.440,
          side: 'right',
          className: 'top-[36%] sm:top-[38%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
        {
          id: 'sugar',
          title: 'High Soluble Solids (Brix)',
          subtitle: '13.5° Brix concentrated in segment pulp with harmonious 9.5:1 acid ratio.',
          accentColor: '#f59e0b',
          imageNormX: 0.435,
          imageNormY: 0.580,
          side: 'left',
          className: 'top-[68%] sm:top-[70%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'core',
          title: 'Pristine Segment Pith',
          subtitle: 'Tender albedo membrane allowing seamless separation without fibrous stringing.',
          accentColor: '#d97706',
          imageNormX: 0.505,
          imageNormY: 0.515,
          side: 'right',
          className: 'top-[70%] sm:top-[72%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
      ]
    : [
        {
          id: 'layer',
          title: 'Crystalline Betacyanin Flesh',
          subtitle: 'Dense anthocyanin matrix yielding rich floral sweetness and natural pigment.',
          accentColor: '#ec4899',
          imageNormX: 0.350,
          imageNormY: 0.540,
          side: 'left',
          className: 'top-[30%] sm:top-[32%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'moisture',
          title: 'Turgid Jade-Green Bracts',
          subtitle: 'Air-washed and refrigerated immediately to preserve fresh scales.',
          accentColor: '#10b981',
          imageNormX: 0.720,
          imageNormY: 0.510,
          side: 'right',
          className: 'top-[36%] sm:top-[38%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
        {
          id: 'sugar',
          title: 'Edible Micro-Seed Snap',
          subtitle: 'Delicate edible black seeds providing acoustic texture and Omega oils.',
          accentColor: '#be185d',
          imageNormX: 0.370,
          imageNormY: 0.580,
          side: 'left',
          className: 'top-[68%] sm:top-[70%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'core',
          title: 'Cold Sea Freight Integrity',
          subtitle: 'Chilled at 3.0°C directly from Binh Thuan packhouse to Indian arrival ports.',
          accentColor: '#059669',
          imageNormX: 0.630,
          imageNormY: 0.550,
          side: 'right',
          className: 'top-[70%] sm:top-[72%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
      ],
    [isApple, isOrange]
  );

  // Precise coordinate calculation matching ScrollFrameBackground canvas object-fit cover
  const updateCoordinates = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Dimensions of native 1920x1080 media frame
    const nativeW = 1920;
    const nativeH = 1080;

    // object-fit: cover exact scale
    const scale = Math.max(W / nativeW, H / nativeH);
    const renderW = nativeW * scale;
    const renderH = nativeH * scale;

    const offsetX = (W - renderW) / 2;
    const offsetY = (H - renderH) / 2;

    const calculated = anatomyData.map((item) => {
      // Calculate target point on fruit in screen coordinates
      const endX = offsetX + item.imageNormX * renderW;
      const endY = offsetY + item.imageNormY * renderH;

      // Calculate anchor point on card
      const cardEl = cardRefs.current[item.id];
      let startX = 0;
      let startY = 0;

      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        if (item.side === 'left') {
          startX = rect.right + 12;
          startY = rect.top + 16;
        } else {
          startX = rect.left - 12;
          startY = rect.top + 16;
        }
      } else {
        if (item.side === 'left') {
          startX = W * 0.28;
          startY = endY;
        } else {
          startX = W * 0.72;
          startY = endY;
        }
      }

      // Elegant architectural leader line with horizontal shoulders
      let pathData = '';
      if (item.side === 'left') {
        const span = Math.max(30, endX - startX);
        const cp1X = startX + span * 0.55;
        const cp1Y = startY;
        const cp2X = endX - span * 0.20;
        const cp2Y = endY;
        pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      } else {
        const span = Math.max(30, startX - endX);
        const cp1X = startX - span * 0.55;
        const cp1Y = startY;
        const cp2X = endX + span * 0.20;
        const cp2Y = endY;
        pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      }

      return {
        id: item.id,
        startX,
        startY,
        endX,
        endY,
        pathData,
      };
    });

    setLineCoords(calculated);
  }, [anatomyData]);

  // Recalculate on resize and fruit change
  useEffect(() => {
    if (isMobile) return;

    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);

    const timer = setTimeout(updateCoordinates, 60);
    const timer2 = setTimeout(updateCoordinates, 300);

    return () => {
      window.removeEventListener('resize', updateCoordinates);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updateCoordinates, selectedFruit.id, isMobile]);

  /* Phone layout. Four callouts pinned around the fruit become a sleek docked sheet along bottom */
  if (isMobile) {
    const accent = isApple ? '#8e1d24' : isOrange ? '#ea580c' : '#be185d';
    return (
      <div
        id="anatomy-section-container"
        style={{
          opacity: totalOpacity,
          pointerEvents: totalOpacity > 0.3 ? 'auto' : 'none',
          visibility: isVisible ? 'visible' : 'hidden',
          transition: 'opacity 0.35s ease',
        }}
        className="fixed inset-x-0 bottom-0 z-30 select-none"
      >
        <div className="fr-anatomy-sheet">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
              <p className="fr-anatomy-sheet-title !mb-0">[ 05 // INTERNAL SPECIFICATION ]</p>
            </div>
            <span className="font-mono text-[9px] text-black/50 uppercase tracking-wider">Internal Grading</span>
          </div>
          <ul className="fr-anatomy-sheet-list">
            {anatomyData.map((item) => (
              <li key={item.id}>
                <span
                  className="fr-anatomy-sheet-dot"
                  style={{ backgroundColor: item.accentColor }}
                  aria-hidden="true"
                />
                <div>
                  <span className="fr-anatomy-sheet-heading">{item.title}</span>
                  <p className="fr-anatomy-sheet-copy">{item.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div
      id="anatomy-section-container"
      style={{
        opacity: totalOpacity,
        pointerEvents: totalOpacity > 0.3 ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.35s ease',
      }}
      className="fixed inset-0 z-20 pointer-events-none select-none"
    >
      {/* 1. HIGH-PRECISION WHITE ANATOMICAL LEADER LINES SVG OVERLAY */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-15 select-none"
        style={{ width: '100vw', height: '100vh' }}
      >
        <defs>
          {/* Crisp White Glow & Drop-Shadow Filter */}
          <filter id="white-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFFFFF" floodOpacity="0.8" />
          </filter>

          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFFFFF" floodOpacity="0.9" />
          </filter>
        </defs>

        {lineCoords.map((line) => {
          const item = anatomyData.find((a) => a.id === line.id);
          const isHovered = hoveredId === line.id;
          const isDimmed = hoveredId !== null && !isHovered;

          return (
            <g
              key={line.id}
              style={{
                opacity: isDimmed ? 0.35 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {/* Primary White Anatomical Leader Line */}
              <path
                d={line.pathData}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 2.4 : 1.8}
                strokeLinecap="round"
                filter="url(#white-glow)"
              />

              {/* Card Connection Anchor Dot */}
              <circle
                cx={line.startX}
                cy={line.startY}
                r={isHovered ? 4 : 3}
                fill="#FFFFFF"
                filter="url(#white-glow)"
              />
              <circle
                cx={line.startX}
                cy={line.startY}
                r={isHovered ? 6.5 : 5}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />

              {/* Fruit Slice Target Node: High-precision botanical inspection reticle */}
              {/* Outer clean accent ring */}
              <circle
                cx={line.endX}
                cy={line.endY}
                r={isHovered ? 12 : 9}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity={isHovered ? '0.9' : '0.45'}
              />

              {/* Middle Glowing Ring */}
              <circle
                cx={line.endX}
                cy={line.endY}
                r={isHovered ? 6.5 : 4.5}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                filter="url(#node-glow)"
              />

              {/* Solid Center Core Dot */}
              <circle
                cx={line.endX}
                cy={line.endY}
                r={isHovered ? 3 : 2}
                fill={item?.accentColor || '#FFFFFF'}
                filter="url(#white-glow)"
              />

              {/* Crosshair Accent Ticks for Botanical Precision */}
              <line
                x1={line.endX - (isHovered ? 11 : 8)}
                y1={line.endY}
                x2={line.endX - (isHovered ? 6 : 4)}
                y2={line.endY}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#white-glow)"
              />
              <line
                x1={line.endX + (isHovered ? 6 : 4)}
                y1={line.endY}
                x2={line.endX + (isHovered ? 11 : 8)}
                y2={line.endY}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#white-glow)"
              />
              <line
                x1={line.endX}
                y1={line.endY - (isHovered ? 11 : 8)}
                x2={line.endX}
                y2={line.endY - (isHovered ? 6 : 4)}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#white-glow)"
              />
              <line
                x1={line.endX}
                y1={line.endY + (isHovered ? 6 : 4)}
                x2={line.endX}
                y2={line.endY + (isHovered ? 11 : 8)}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#white-glow)"
              />
            </g>
          );
        })}
      </svg>

      {/* 2. FLOATING ANATOMICAL CALLOUT LABELS (PURE TEXT ON BACKGROUND - NO BOXES) */}
      {anatomyData.map((item) => {
        const isHovered = hoveredId === item.id;

        return (
          <div
            key={item.id}
            ref={(el) => {
              cardRefs.current[item.id] = el;
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`fixed ${item.className} z-20 pointer-events-auto max-w-[210px] sm:max-w-[240px] cursor-pointer transition-transform duration-200 ${
              isHovered ? 'scale-105' : 'hover:scale-[1.02]'
            }`}
          >
            <div className="space-y-1.5 select-none">
              {/* Category / Accent Dot */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full transition-transform duration-200"
                  style={{
                    backgroundColor: item.accentColor,
                    transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
                <span className="font-sans text-sm font-semibold text-[#1A1A1A]">
                  {item.title}
                </span>
              </div>

              {/* Subtitle description (Pure text) */}
              <p className="font-sans text-[11px] text-[#1A1A1A]/80 leading-relaxed font-normal">
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
