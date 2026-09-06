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
  const isVisible = scrollProgress >= 0.78;
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

  /* Memoised, and it has to be. This array is a dependency of
     updateCoordinates, which is a dependency of the effect that calls
     setLineCoords. Rebuilt inline on every render it gave that callback
     a new identity each time, so the effect re-ran, set state, and
     re-rendered — a render loop that ran for as long as the page was
     open ("Maximum update depth exceeded", tens of thousands of times).
     Keyed on the cultivar, which is the only thing the contents vary on. */
  const anatomyData: AnatomyPoint[] = useMemo(
    () =>
      isApple
    ? [
        {
          id: 'layer',
          title: 'Layered Structure',
          subtitle: 'Dense cellular walls designed for maximum acoustic snap.',
          accentColor: '#B87333',
          imageNormX: 0.410,
          imageNormY: 0.405, // Exactly Slice 2 top slice cut
          side: 'left',
          className: 'top-[30%] sm:top-[32%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'moisture',
          title: 'Moisture Retention',
          subtitle: '86% cold juice retention locked within the core matrix.',
          accentColor: '#B87333',
          imageNormX: 0.605,
          imageNormY: 0.565, // Exactly Slice 4 center cut
          side: 'right',
          className: 'top-[46%] sm:top-[48%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
        {
          id: 'defects',
          title: 'Zero Internal Defects',
          subtitle: 'Pristine carpel cavity with balanced natural malic acid.',
          accentColor: '#059669',
          imageNormX: 0.435,
          imageNormY: 0.655, // Exactly Slice 5 internal carpel cavity
          side: 'left',
          className: 'bottom-[22%] sm:bottom-[24%] left-4 sm:left-[12%] lg:left-[16%] xl:left-[20%]',
        },
        {
          id: 'sugar',
          title: 'Refractive Sugar Core',
          subtitle: `${selectedFruit.brixLevel}° Brix gold-standard concentrated distribution.`,
          accentColor: '#D97706',
          imageNormX: 0.595,
          imageNormY: 0.735, // Exactly Slice 6 lower slice cut
          side: 'right',
          className: 'bottom-[22%] sm:bottom-[24%] right-4 sm:right-[12%] lg:right-[16%] xl:right-[20%]',
        },
      ]
    : isOrange
    ? [
        {
          id: 'layer',
          title: 'Anthocyanin Vesicles',
          subtitle: 'Deep ruby pigmentation rich in natural antioxidants.',
          accentColor: '#E11D48',
          imageNormX: 0.440,
          imageNormY: 0.440,
          side: 'left',
          className: 'top-[30%] sm:top-[32%] left-4 sm:left-[10%] lg:left-[14%] xl:left-[18%]',
        },
        {
          id: 'moisture',
          title: 'Flavedo Essential Oils',
          subtitle: 'Aromatic zest with intense terpene and citrus oil density.',
          accentColor: '#EA580C',
          imageNormX: 0.610,
          imageNormY: 0.500,
          side: 'right',
          className: 'top-[46%] sm:top-[48%] right-4 sm:right-[10%] lg:right-[14%] xl:right-[18%]',
        },
        {
          id: 'defects',
          title: 'Zero Bitter Pith',
          subtitle: 'Delicate albedo with seamless natural segment separation.',
          accentColor: '#059669',
          imageNormX: 0.430,
          imageNormY: 0.560,
          side: 'left',
          className: 'bottom-[22%] sm:bottom-[24%] left-4 sm:left-[12%] lg:left-[16%] xl:left-[20%]',
        },
        {
          id: 'sugar',
          title: 'Volcanic Sugar Core',
          subtitle: `${selectedFruit.brixLevel}° Brix gold-standard concentrated distribution.`,
          accentColor: '#D97706',
          imageNormX: 0.505,
          imageNormY: 0.505,
          side: 'right',
          className: 'bottom-[22%] sm:bottom-[24%] right-4 sm:right-[12%] lg:right-[16%] xl:right-[20%]',
        },
      ]
    : [
        {
          id: 'defects',
          title: 'Micro-Seed Matrix',
          subtitle: 'Thousands of edible black seeds loaded with oleic fatty acids & micro-crunch.',
          accentColor: '#4B5563',
          imageNormX: 0.365,
          imageNormY: 0.540,
          side: 'left',
          className: 'top-[26%] sm:top-[28%] left-4 sm:left-[8%] lg:left-[12%] xl:left-[15%]',
        },
        {
          id: 'layer',
          title: 'Foliar Bract Scales',
          subtitle: 'Chlorophyll-rich jade-tipped scales protecting tender epidermis.',
          accentColor: '#10B981',
          imageNormX: 0.285,
          imageNormY: 0.670,
          side: 'left',
          className: 'bottom-[18%] sm:bottom-[20%] left-4 sm:left-[8%] lg:left-[12%] xl:left-[15%]',
        },
        {
          id: 'sugar',
          title: 'Refractive Floral Core',
          subtitle: `${selectedFruit.brixLevel}° Brix crystalline sweetness with delicate melon-pear notes.`,
          accentColor: '#D97706',
          imageNormX: 0.655,
          imageNormY: 0.540,
          side: 'right',
          className: 'top-[26%] sm:top-[28%] right-4 sm:right-[8%] lg:right-[12%] xl:right-[15%]',
        },
        {
          id: 'moisture',
          title: 'Betacyanin Pericarp',
          subtitle: 'Vivid magenta protective rind rich in potent betalain antioxidants.',
          accentColor: '#E11D74',
          imageNormX: 0.655,
          imageNormY: 0.700,
          side: 'right',
          className: 'bottom-[18%] sm:bottom-[20%] right-4 sm:right-[8%] lg:right-[12%] xl:right-[15%]',
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
          startY = rect.top + 22;
        } else {
          startX = rect.left - 12;
          startY = rect.top + 22;
        }
      } else {
        if (item.side === 'left') {
          startX = W * 0.32;
          startY = endY;
        } else {
          startX = W * 0.68;
          startY = endY;
        }
      }

      // Generate leader line matching user's architectural guide aesthetics
      let pathData = '';
      if (isDragonFruit) {
        if (item.side === 'left') {
          const isTop = endY > startY;
          if (isTop) {
            // Horizontal out from card, smooth rounded bend, drops down into cut face
            const cp1X = startX + (endX - startX) * 0.72;
            const cp1Y = startY;
            const cp2X = endX;
            const cp2Y = startY + (endY - startY) * 0.45;
            pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
          } else {
            // Smooth upward swoop from bottom card into lower contour
            const dx = Math.max(20, endX - startX);
            const cp1X = startX + dx * 0.45;
            const cp1Y = startY;
            const cp2X = endX - dx * 0.15;
            const cp2Y = endY + (startY - endY) * 0.35;
            pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
          }
        } else {
          const isTop = endY > startY;
          if (isTop) {
            // Horizontal out from card (heading left), smooth rounded bend, drops down into cut face
            const cp1X = startX - (startX - endX) * 0.72;
            const cp1Y = startY;
            const cp2X = endX;
            const cp2Y = startY + (endY - startY) * 0.45;
            pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
          } else {
            // Smooth upward swoop from bottom card into lower contour
            const dx = Math.max(20, startX - endX);
            const cp1X = startX - dx * 0.45;
            const cp1Y = startY;
            const cp2X = endX + dx * 0.15;
            const cp2Y = endY + (startY - endY) * 0.35;
            pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
          }
        }
      } else {
        // Original S-curve path for apple & orange
        if (item.side === 'left') {
          const dx = Math.max(20, endX - startX);
          const cp1X = startX + dx * 0.40;
          const cp1Y = startY;
          const cp2X = endX - dx * 0.25;
          const cp2Y = endY;
          pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
        } else {
          const dx = Math.max(20, startX - endX);
          const cp1X = startX - dx * 0.40;
          const cp1Y = startY;
          const cp2X = endX + dx * 0.25;
          const cp2Y = endY;
          pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
        }
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

  // Recalculate on resize, scroll, and fruit change. Skipped on a phone,
  // where the callouts are a stacked list rather than pinned to points on
  // the fruit — there is nothing for a leader line to join up.
  useEffect(() => {
    if (isMobile) return;

    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    window.addEventListener('scroll', updateCoordinates, { passive: true });

    const timer = setTimeout(updateCoordinates, 50);
    const timer2 = setTimeout(updateCoordinates, 250);

    return () => {
      window.removeEventListener('resize', updateCoordinates);
      window.removeEventListener('scroll', updateCoordinates);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updateCoordinates, selectedFruit.id, isVisible, isMobile]);

  /* Phone layout. Four callouts pinned around the fruit need margins to
     sit in; at 390px they landed on top of each other and on the fruit.
     They become a sheet along the bottom instead — the fruit still reads
     above it, and the copy is finally legible. The leader lines go with
     them, since there is no longer a point on the image to lead to. */
  if (isMobile) {
    return (
      <div
        id="anatomy-section-container"
        className={`fixed inset-x-0 bottom-0 z-20 transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="fr-anatomy-sheet">
          <p className="fr-anatomy-sheet-title">Anatomy</p>
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
      className={`transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* 1. HIGH-PRECISION WHITE ANATOMICAL LEADER LINES SVG OVERLAY */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-15 select-none"
        style={{ width: '100vw', height: '100vh' }}
      >
        <defs>
          {/* Subtle Glow & Drop-Shadow Filter for Pure White Crispness */}
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
              className="transition-all duration-300"
              style={{ opacity: isDimmed ? 0.35 : 1 }}
            >
              {/* Primary White Anatomical Leader Line */}
              <path
                d={line.pathData}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 2.8 : 2.0}
                strokeLinecap="round"
                filter="url(#white-glow)"
                className="transition-all duration-300"
              />

              {/* Card Connection Anchor Dot */}
              <circle
                cx={line.startX}
                cy={line.startY}
                r={isHovered ? 4.5 : 3.5}
                fill="#FFFFFF"
                filter="url(#white-glow)"
                className="transition-all duration-300"
              />
              <circle
                cx={line.startX}
                cy={line.startY}
                r={isHovered ? 7 : 5.5}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />

              {/* Fruit Slice Target Node: Outer Expanding Radar Ping */}
              <circle
                cx={line.endX}
                cy={line.endY}
                r={isHovered ? 16 : 12}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity={isHovered ? '0.85' : '0.45'}
                className="animate-ping"
                style={{
                  animationDuration: isHovered ? '1.5s' : '3s',
                  transformOrigin: `${line.endX}px ${line.endY}px`,
                }}
              />

              {/* Fruit Slice Target Node: Middle Glowing Ring */}
              <circle
                cx={line.endX}
                cy={line.endY}
                r={isHovered ? 7.5 : 5.5}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                filter="url(#node-glow)"
                className="transition-all duration-300"
              />

              {/* Fruit Slice Target Node: Solid Center Core Dot */}
              <circle
                cx={line.endX}
                cy={line.endY}
                r={isHovered ? 3.5 : 2.5}
                fill={item?.accentColor || '#FFFFFF'}
                filter="url(#white-glow)"
                className="transition-all duration-300"
              />

              {/* Crosshair Accent Ticks for Botanical Precision */}
              <line
                x1={line.endX - (isHovered ? 12 : 9)}
                y1={line.endY}
                x2={line.endX - (isHovered ? 7 : 5)}
                y2={line.endY}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#white-glow)"
              />
              <line
                x1={line.endX + (isHovered ? 7 : 5)}
                y1={line.endY}
                x2={line.endX + (isHovered ? 12 : 9)}
                y2={line.endY}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#white-glow)"
              />
              <line
                x1={line.endX}
                y1={line.endY - (isHovered ? 12 : 9)}
                x2={line.endX}
                y2={line.endY - (isHovered ? 7 : 5)}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#white-glow)"
              />
              <line
                x1={line.endX}
                y1={line.endY + (isHovered ? 7 : 5)}
                x2={line.endX}
                y2={line.endY + (isHovered ? 12 : 9)}
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
            className={`fixed ${item.className} z-20 pointer-events-auto max-w-[210px] sm:max-w-[240px] cursor-pointer transition-all duration-300 ${
              isHovered ? 'scale-105' : 'hover:scale-[1.02]'
            }`}
          >
            <div className="space-y-1.5 select-none">
              {/* Category / Accent Dot */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full transition-transform duration-300"
                  style={{
                    backgroundColor: item.accentColor,
                    transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
                {/* The reading face, not the display serif: this is 14px, and
                    the display serif is a single weight — font-semibold on it
                    is a synthesised bold rather than a drawn one. */}
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
