import React from 'react';
import { WHEEL_PALETTES } from '../data/wheelData';
import {
  WHEEL_DATA_DEFAULT,
  getWheelData,
  getWheelPalette,
  wheelArc,
  wheelPos,
  wheelTextRotation,
  findWheelSector,
} from '../lib/wheel';

// Centro e raggi dei tre anelli concentrici, in coordinate del viewBox 800x800.
const CX = 400;
const CY = 400;
const R_INNER = 70; // bordo del cerchio centrale
const R_CORE = 155; // fine anello delle emozioni primarie
const R_MID = 260; // fine anello delle secondarie
const R_OUTER = 390; // fine anello delle terziarie

const glow = (color, near, far) =>
  `brightness(1.35) drop-shadow(0 0 ${near}px ${color}) drop-shadow(0 0 ${far}px ${color})`;

/**
 * Ruota delle emozioni disegnata proceduralmente.
 *
 * Quando `highlightEmotion` è valorizzata, lo spicchio corrispondente viene
 * acceso e tutto il resto viene attenuato, per un effetto faro che rende
 * evidente dove si trova l'emozione.
 */
export default function EmotionWheelSVG({
  wheelData,
  palette,
  highlightEmotion,
  onEmotionClick,
  editMode,
  onEditLabel,
}) {
  const data = wheelData || getWheelData() || WHEEL_DATA_DEFAULT;
  const pal = WHEEL_PALETTES[palette || getWheelPalette()] || WHEEL_PALETTES.insideout;

  const sectorAngle = 360 / data.length;
  const hl = highlightEmotion ? highlightEmotion.toLowerCase() : null;
  const hlSector = findWheelSector(data, highlightEmotion);

  const interaction = {
    pointerEvents: editMode ? 'auto' : 'none',
    cursor: editMode ? 'pointer' : 'default',
  };

  return (
    <svg viewBox="0 0 800 800" className="w-full h-full" style={{ maxHeight: '70vh' }}>
      {data.map((sector, si) => {
        const a0 = si * sectorAngle;
        const colors = pal[sector.core] || ['#ccc', '#ddd', '#eee'];
        const isHlSector = hlSector === sector.core;
        const isHlCore = hl && sector.core.toLowerCase() === hl;
        const dimmed = hl && !isHlSector;

        const coreMid = a0 + sectorAngle / 2;
        const [coreX, coreY] = wheelPos(CX, CY, (R_INNER + R_CORE) / 2, coreMid);
        const subAngle = sectorAngle / sector.secondary.length;

        return (
          <React.Fragment key={`sector-${si}`}>
            <path
              d={wheelArc(CX, CY, R_INNER, R_CORE, a0, a0 + sectorAngle)}
              fill={colors[0]}
              stroke="#1a1a1a"
              strokeWidth={isHlCore ? 5 : 3.5}
              style={{
                cursor: 'pointer',
                transition: 'all 0.25s',
                opacity: dimmed ? 0.22 : 1,
                filter: isHlCore ? glow(colors[0], 18, 36) : '',
              }}
              onClick={() => onEmotionClick && onEmotionClick(sector.core, 'core', sector.core)}
            />
            <text
              x={coreX}
              y={coreY}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${wheelTextRotation(coreMid)},${coreX},${coreY})`}
              fill="#000"
              fontWeight="900"
              fontSize="13"
              letterSpacing="0.3"
              paintOrder="stroke"
              stroke="#fff"
              strokeWidth="2.5"
              opacity={dimmed ? 0.3 : 1}
              style={interaction}
              onClick={editMode ? () => onEditLabel(sector.core, 'core', si) : undefined}
            >
              {sector.core}
            </text>

            {sector.secondary.map((secondary, mi) => {
              const sa0 = a0 + mi * subAngle;
              const isHlSec =
                hl &&
                (secondary.name.toLowerCase() === hl ||
                  secondary.tertiary.some((t) => t.toLowerCase() === hl));

              const midMid = sa0 + subAngle / 2;
              const [midX, midY] = wheelPos(CX, CY, (R_CORE + R_MID) / 2, midMid);
              const terAngle = subAngle / secondary.tertiary.length;

              return (
                <React.Fragment key={`sec-${si}-${mi}`}>
                  <path
                    d={wheelArc(CX, CY, R_CORE, R_MID, sa0, sa0 + subAngle)}
                    fill={colors[1]}
                    stroke="#1a1a1a"
                    strokeWidth={isHlSec ? 4 : 2.5}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      opacity: dimmed ? 0.2 : hl && !isHlSec ? 0.7 : 1,
                      filter: isHlSec
                        ? glow(colors[1], 16, 30)
                        : isHlSector
                          ? 'brightness(1.1) saturate(1.4)'
                          : '',
                    }}
                    onClick={() =>
                      onEmotionClick && onEmotionClick(secondary.name, 'secondary', sector.core)
                    }
                  />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${wheelTextRotation(midMid)},${midX},${midY})`}
                    fill="#000"
                    fontWeight="800"
                    fontSize="12"
                    paintOrder="stroke"
                    stroke="#fff"
                    strokeWidth="1"
                    opacity={dimmed ? 0.3 : 1}
                    style={interaction}
                    onClick={editMode ? () => onEditLabel(secondary.name, 'secondary', si, mi) : undefined}
                  >
                    {secondary.name}
                  </text>

                  {secondary.tertiary.map((tertiary, ti) => {
                    const ta0 = sa0 + ti * terAngle;
                    const isHlTer = hl && tertiary.toLowerCase() === hl;

                    const terMid = ta0 + terAngle / 2;
                    const [terX, terY] = wheelPos(CX, CY, (R_MID + R_OUTER) / 2, terMid);

                    return (
                      <React.Fragment key={`ter-${si}-${mi}-${ti}`}>
                        <path
                          d={wheelArc(CX, CY, R_MID, R_OUTER, ta0, ta0 + terAngle)}
                          fill={colors[2]}
                          stroke="#1a1a1a"
                          strokeWidth={isHlTer ? 3.5 : 1.5}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.25s',
                            opacity: dimmed ? 0.18 : hl && !isHlSec && !isHlTer ? 0.55 : 1,
                            filter: isHlTer
                              ? `brightness(1.4) drop-shadow(0 0 18px ${colors[0]}) drop-shadow(0 0 36px ${colors[0]})`
                              : isHlSec
                                ? 'brightness(1.1) saturate(1.4)'
                                : '',
                          }}
                          onClick={() =>
                            onEmotionClick && onEmotionClick(tertiary, 'tertiary', sector.core)
                          }
                        />
                        <text
                          x={terX}
                          y={terY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${wheelTextRotation(terMid)},${terX},${terY})`}
                          fill="#111"
                          fontWeight="700"
                          fontSize="9.5"
                          paintOrder="stroke"
                          stroke="#fff"
                          strokeWidth="0.5"
                          style={interaction}
                          onClick={
                            editMode ? () => onEditLabel(tertiary, 'tertiary', si, mi, ti) : undefined
                          }
                        >
                          {tertiary}
                        </text>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Cerchi di contorno: danno alla ruota il tratto marcato neobrutalista. */}
      <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#1a1a1a" strokeWidth={5} />
      <circle cx={CX} cy={CY} r={R_MID} fill="none" stroke="#1a1a1a" strokeWidth={3} />
      <circle cx={CX} cy={CY} r={R_CORE} fill="none" stroke="#1a1a1a" strokeWidth={3.5} />
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#1a1a1a" strokeWidth={4} />
      <circle cx={CX} cy={CY} r={R_INNER - 2} fill="white" stroke="#1a1a1a" strokeWidth={4} />

      {hl && (
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#000"
          fontWeight="900"
          fontSize="14"
          paintOrder="stroke"
          stroke="#fff"
          strokeWidth="3"
        >
          {highlightEmotion}
        </text>
      )}
    </svg>
  );
}
