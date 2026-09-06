type Variant = "grid" | "blueprint" | "crates" | "barcode" | "contour" | "routes" | "compass";
const PATTERNS: Record<Variant, string> = {
  grid: `<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M40 0H0V40" fill="none" stroke="white" stroke-width="0.5"/>
  </pattern>`,
  blueprint: `<pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" fill="none" stroke="white" stroke-width="0.5"/>
    <circle cx="0" cy="0" r="1.5" fill="white"/>
  </pattern>`,
  crates: `<pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
    <rect x="4" y="4" width="36" height="36" fill="none" stroke="white" stroke-width="0.6"/>
  </pattern>`,
  barcode: `<pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse">
    <rect x="2" width="1.5" height="30" fill="white"/>
    <rect x="7" width="3" height="30" fill="white"/>
    <rect x="14" width="1.5" height="30" fill="white"/>
    <rect x="19" width="2" height="30" fill="white"/>
  </pattern>`,
  contour: `<pattern id="p" width="120" height="60" patternUnits="userSpaceOnUse">
    <path d="M0 30 Q30 10 60 30 T120 30" fill="none" stroke="white" stroke-width="0.5"/>
    <path d="M0 45 Q30 25 60 45 T120 45" fill="none" stroke="white" stroke-width="0.5"/>
  </pattern>`,
  routes: `<pattern id="p" width="80" height="80" patternUnits="userSpaceOnUse">
    <path d="M0 40 L80 40" stroke="white" stroke-width="0.6" stroke-dasharray="4 6"/>
    <path d="M40 0 L40 80" stroke="white" stroke-width="0.6" stroke-dasharray="4 6"/>
  </pattern>`,
  compass: `<pattern id="p" width="100" height="100" patternUnits="userSpaceOnUse">
    <circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="0.5"/>
    <circle cx="50" cy="50" r="1.5" fill="white"/>
  </pattern>`,
};

export default function PageBackground({ variant }: { variant: Variant }) {
  return (
    <svg
      className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.05]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs dangerouslySetInnerHTML={{ __html: PATTERNS[variant] }} />
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
}