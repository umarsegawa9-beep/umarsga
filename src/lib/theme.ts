export interface ThemePalette {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export const PRESET_THEMES: ThemePalette[] = [
  { id: 'iris', name: 'Electric Iris', hex: '#6366f1', description: 'Fluid, modern indigo with violet undertones' },
  { id: 'emerald', name: 'Emerald Sage', hex: '#059669', description: 'Calm, grounding botanical mineral green' },
  { id: 'azure', name: 'Ocean Azure', hex: '#0284c7', description: 'Crisp, lucid alpine sky and sea water' },
  { id: 'amber', name: 'Sunset Amber', hex: '#d97706', description: 'Warm champagne glow, golden hour' },
  { id: 'rose', name: 'Rose Quartz', hex: '#e11d48', description: 'Vibrant, elegant berry blossom' },
  { id: 'amethyst', name: 'Royal Amethyst', hex: '#9333ea', description: 'Deep, luxurious velvet purple' },
  { id: 'teal', name: 'Cyber Mint', hex: '#0d9488', description: 'Refreshing, clean bioluminescent teal' },
  { id: 'titanium', name: 'Midnight Titanium', hex: '#475569', description: 'Minimalist metallic slate restraint' },
];

// Helper to convert hex to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    return { r: 99, g: 102, b: 241 }; // fallback to Electric Iris
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

// Calculate luminance to decide contrast text color (white or dark slate)
export const getContrastForeground = (hex: string): string => {
  const { r, g, b } = hexToRgb(hex);
  // Relative luminance formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0f172a' : '#ffffff';
};

// Apply dynamic theme variables to DOM root
export const applyThemeColor = (hex: string): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const { r, g, b } = hexToRgb(hex);
  const fg = getContrastForeground(hex);

  root.style.setProperty('--liquid-accent', `${r}, ${g}, ${b}`);
  root.style.setProperty('--liquid-accent-hex', hex);
  root.style.setProperty('--liquid-accent-light', `rgba(${r}, ${g}, ${b}, 0.12)`);
  root.style.setProperty('--liquid-accent-glow', `rgba(${r}, ${g}, ${b}, 0.28)`);
  root.style.setProperty('--liquid-accent-fg', fg);
};
