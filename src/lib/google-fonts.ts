// Popular Google Fonts curated list
export const googleFonts = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Inter", "Oswald", "Raleway", "Nunito", "Ubuntu",
  "Playfair Display", "Merriweather", "PT Sans", "Lora", "Rubik",
  "Work Sans", "Fira Sans", "Quicksand", "Mulish", "Barlow",
  "Manrope", "Karla", "Josefin Sans", "Libre Baskerville", "Inconsolata",
  "Source Code Pro", "Space Grotesk", "DM Serif Display", "Archivo", "Cabin",
  "Bitter", "Abel", "Abril Fatface", "Pacifico", "Lobster",
  "Dancing Script", "Satisfy", "Great Vibes", "Permanent Marker", "Bebas Neue",
  "Comfortaa", "Righteous", "Outfit", "Sora", "Lexend",
  "IBM Plex Sans", "IBM Plex Mono", "JetBrains Mono", "Fira Code", "Space Mono",
  "Cormorant Garamond", "Crimson Text", "EB Garamond", "Source Serif 4", "Spectral",
  "Caveat", "Kalam", "Shadows Into Light", "Indie Flower", "Patrick Hand",
  "Anton", "Black Ops One", "Bangers", "Press Start 2P", "Silkscreen",
  "Plus Jakarta Sans", "DM Sans",
];

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string): void {
  if (loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);

  const encoded = fontName.replace(/ /g, "+");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

export function getFontValue(fontName: string): string {
  const isSerif = ["Playfair Display", "Merriweather", "Lora", "Libre Baskerville",
    "Bitter", "Abril Fatface", "Cormorant Garamond", "Crimson Text", "EB Garamond",
    "Source Serif 4", "Spectral", "DM Serif Display"].includes(fontName);
  const isMono = ["Inconsolata", "Source Code Pro", "IBM Plex Mono", "JetBrains Mono",
    "Fira Code", "Space Mono", "Press Start 2P", "Silkscreen"].includes(fontName);
  const isHandwriting = ["Pacifico", "Lobster", "Dancing Script", "Satisfy", "Great Vibes",
    "Caveat", "Kalam", "Shadows Into Light", "Indie Flower", "Patrick Hand"].includes(fontName);

  if (isMono) return `"${fontName}", monospace`;
  if (isSerif) return `"${fontName}", serif`;
  if (isHandwriting) return `"${fontName}", cursive`;
  return `"${fontName}", sans-serif`;
}

export function getFontNameFromValue(value: string): string {
  const match = value.match(/^"([^"]+)"/);
  return match ? match[1] : value.split(",")[0].trim();
}
