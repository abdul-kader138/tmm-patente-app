import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Ellipse,
  G,
  SvgProps,
} from 'react-native-svg';

interface YellowCarIllustrationProps extends SvgProps {
  width?: number;
  height?: number;
}

/**
 * Custom vector illustration of the TMM Driving School yellow sedan car.
 * Recreated with pure SVG vector geometry matching Figma reference Screen F3.
 */
export const YellowCarIllustration: React.FC<YellowCarIllustrationProps> = ({
  width = 136,
  height = 48,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 136 48"
      fill="none"
      {...props}
    >
      {/* Soft ground shadow under car */}
      <Ellipse cx={68} cy={44} rx={60} ry={3.5} fill="#0F172A" opacity={0.25} />

      {/* Tires (Back & Front) */}
      <Circle cx={29} cy={35} r={9.5} fill="#1F2937" />
      <Circle cx={104} cy={35} r={9.5} fill="#1F2937" />

      {/* Car Body */}
      <Path
        d="M 6,31 C 4,30 3.5,25 6,23 C 9,21 17,20 24,20 L 36,10 C 40,7 45,7 48,7 L 76,7 C 82,7 86,9 90,12 L 102,20 C 106,20 120,22 128,25 C 131,26 132,28.5 131,31 C 130,33 126,34 118,34 L 115,34 C 113.5,29.5 109,26.5 104,26.5 C 99,26.5 94.5,29.5 93,34 L 40,34 C 38.5,29.5 34,26.5 29,26.5 C 24,26.5 19.5,29.5 18,34 L 9,34 C 7,34 6,32 6,31 Z"
        fill="#FDB022"
      />

      {/* Rear Window */}
      <Path
        d="M 38,11 L 53,11 L 53,19 L 26,19 L 36,12 C 37,11.2 37.5,11 38,11 Z"
        fill="#BFD7FF"
      />

      {/* Front Window */}
      <Path
        d="M 58,11 L 76,11 C 79,11 82.5,12 85,14.5 L 98,19 L 58,19 Z"
        fill="#BFD7FF"
      />

      {/* B-Pillar divider */}
      <Rect x={53.5} y={8} width={4} height={11.5} fill="#FDB022" />

      {/* Front Headlight */}
      <Path
        d="M 127,26 L 131,27.5 C 131.5,28.5 131,30.5 129,31 L 126,30 Z"
        fill="#FEF08A"
      />

      {/* Rear Taillight */}
      <Path
        d="M 5,24 C 4.5,25 4.5,27.5 5.5,28.5 L 8,28.5 L 8,24 Z"
        fill="#EF4444"
      />

      {/* Door handles & seam lines */}
      <Rect x={61} y={22.5} width={7} height={1.8} rx={0.9} fill="#FDE68A" />
      <Line x1={55.5} y1={19.5} x2={55.5} y2={34} stroke="#D97706" strokeWidth={0.9} opacity={0.6} />
      <Line x1={88} y1={19.5} x2={88} y2={34} stroke="#D97706" strokeWidth={0.9} opacity={0.6} />

      {/* Wheel Hubcaps (Silver with dark center) */}
      <Circle cx={29} cy={35} r={5.2} fill="#D1D5DB" />
      <Circle cx={29} cy={35} r={2.2} fill="#4B5563" />
      <Circle cx={104} cy={35} r={5.2} fill="#D1D5DB" />
      <Circle cx={104} cy={35} r={2.2} fill="#4B5563" />
    </Svg>
  );
};
