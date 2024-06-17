function convertHexColorToRGB01(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  if (!/^[0-9A-F]{6}$/i.test(hex)) {
    throw new Error(`Invalid color string '${hex}'`);
  }

  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  return [r, g, b];
}

type Palette = {
  ansi: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  foreground: string;
  background: string;
  badge: string;
  bold: string;
  cursor: string;
  cursorGuide: string;
  cursorText: string;
  link: string;
  selectionText: string;
  selection: string;
  matchBackground: string;
};

const dark: Palette = {
  ansi: [
    "#1c1c1c", // black
    "#af005f", // red
    "#5faf00", // green
    "#d7af5f", // yellow
    "#3994af", // blue
    "#8787AF", // magenta
    "#5f8787", // cyan
    "#d0d0d0", // white
    "#585858", // bright black
    "#ff5faf", // bright red
    "#afd700", // bright green
    "#ffaf00", // bright yellow
    "#5fafd7", // bright blue
    "#af87d7", // bright magenta
    "#00afaf", // bright cyan
    "#ffffff", // bright white
  ],
  foreground: "#d0d0d0",
  background: "#1c1c1c",
  badge: "#ea4024",
  link: "#5fafd7",
  bold: "#d0d0d0",
  cursor: "#d0d0d0",
  cursorText: "#1c1c1c",
  cursorGuide: "#beeafc",
  selection: "#8786ab",
  selectionText: "#1c1c1c",
  matchBackground: "#d7af5f",
};

const light: Palette = {
  ansi: [
    "#444444", // black
    "#af0000", // red
    "#008700", // green
    "#d75f00", // yellow
    "#005f87", // blue
    "#8700af", // magenta
    "#005f87", // cyan
    "#bcbcbc", // white
    "#878787", // bright black
    "#d70000", // bright red
    "#5f8700", // bright green
    "#d75f00", // bright yellow
    "#005faf", // bright blue
    "#d70087", // bright magenta
    "#0087af", // bright cyan
    "#eeeeee", // bright white
  ],
  foreground: "#1c1c1c",
  background: "#eeeeee",
  badge: "#ea4024",
  link: "#005f87",
  bold: "#4c4c4c",
  cursor: "#444444",
  cursorText: "#eeeeee",
  cursorGuide: "#beeafc",
  selection: "#878787",
  selectionText: "#eeeeee",
  matchBackground: "#f9d891",
};

type Theme = "default" | "dark" | "light";

function generateColorKeyValue(
  title: string,
  hexColor: string,
  theme: Theme,
  alpha: number = 1,
  colorSpace: string = "sRGB",
): string {
  const [r, g, b] = convertHexColorToRGB01(hexColor);
  const a = alpha;
  return `	<key>${title}${theme === "default" ? "" : theme === "dark" ? " (Dark)" : " (Light)"}</key>
	<dict>
		<key>Color Space</key>
		<string>${colorSpace}</string>
		<key>Red Component</key>
		<real>${r}</real>
		<key>Green Component</key>
		<real>${g}</real>
		<key>Blue Component</key>
		<real>${b}</real>
		<key>Alpha Component</key>
		<real>${a}</real>
	</dict>`;
}

const header = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>`;

const footer = `</dict>
</plist>`;

function generateThemeKVs(theme: Theme, palette: Palette): string {
  const colorKeys = [
    generateColorKeyValue("Ansi 0 Color", palette.ansi[0], theme),
    generateColorKeyValue("Ansi 1 Color", palette.ansi[1], theme),
    generateColorKeyValue("Ansi 2 Color", palette.ansi[2], theme),
    generateColorKeyValue("Ansi 3 Color", palette.ansi[3], theme),
    generateColorKeyValue("Ansi 4 Color", palette.ansi[4], theme),
    generateColorKeyValue("Ansi 5 Color", palette.ansi[5], theme),
    generateColorKeyValue("Ansi 6 Color", palette.ansi[6], theme),
    generateColorKeyValue("Ansi 7 Color", palette.ansi[7], theme),
    generateColorKeyValue("Ansi 8 Color", palette.ansi[8], theme),
    generateColorKeyValue("Ansi 9 Color", palette.ansi[9], theme),
    generateColorKeyValue("Ansi 10 Color", palette.ansi[10], theme),
    generateColorKeyValue("Ansi 11 Color", palette.ansi[11], theme),
    generateColorKeyValue("Ansi 12 Color", palette.ansi[12], theme),
    generateColorKeyValue("Ansi 13 Color", palette.ansi[13], theme),
    generateColorKeyValue("Ansi 14 Color", palette.ansi[14], theme),
    generateColorKeyValue("Ansi 15 Color", palette.ansi[15], theme),
    generateColorKeyValue("Background Color", palette.background, theme),
    generateColorKeyValue("Badge Color", palette.badge, theme, 0.5),
    generateColorKeyValue("Bold Color", palette.bold, theme),
    generateColorKeyValue("Cursor Color", palette.cursor, theme),
    generateColorKeyValue(
      "Cursor Guide Color",
      palette.cursorGuide,
      theme,
      0.25,
    ),
    generateColorKeyValue("Cursor Text Color", palette.cursorText, theme),
    generateColorKeyValue("Foreground Color", palette.foreground, theme),
    generateColorKeyValue("Link Color", palette.link, theme),
    generateColorKeyValue(
      "Match Background Color",
      palette.matchBackground,
      theme,
    ),
    generateColorKeyValue("Selected Text Color", palette.selectionText, theme),
    generateColorKeyValue("Selection Color", palette.selection, theme),
  ];

  return colorKeys.join("\n");
}

function generateThemeFile(): string {
  return `${header}
${generateThemeKVs("default", light)}
${generateThemeKVs("light", light)}
${generateThemeKVs("dark", dark)}
${footer}`;
}

console.log(generateThemeFile());
