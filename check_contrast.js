function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function luminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const l1 = luminance(c1.r, c1.g, c1.b);
  const l2 = luminance(c2.r, c2.g, c2.b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio.toFixed(2);
}

const darkColors = {
  bg: '#0C0A08',
  surface: '#17151A',
  textPrimary: '#F5F5F7',
  textSecondary: '#9B9BA3',
  accentPrimary: '#F5A623',
  accentSecondary: '#4F9E96',
  success: '#22c55e', // Current tailwind green
  error: '#ef4444', // Current tailwind red
};

const lightColors = {
  bg: '#FAF9F7',
  surface: '#FFFFFF',
  textPrimary: '#1A1816',
  textSecondary: '#6B6862',
  accentPrimary: '#B8650A', 
  accentSecondary: '#2C7A7B', // Deepened teal
  success: '#16a34a', // Darker green for light theme
  error: '#dc2626', // Darker red for light theme
};

console.log("--- DARK THEME CONTRAST ---");
console.log("Text Primary on BG: " + contrastRatio(darkColors.textPrimary, darkColors.bg));
console.log("Text Primary on Surface: " + contrastRatio(darkColors.textPrimary, darkColors.surface));
console.log("Text Secondary on Surface: " + contrastRatio(darkColors.textSecondary, darkColors.surface));
console.log("Accent Primary on Surface: " + contrastRatio(darkColors.accentPrimary, darkColors.surface));
console.log("Accent Secondary on Surface: " + contrastRatio(darkColors.accentSecondary, darkColors.surface));
console.log("Success on Surface: " + contrastRatio(darkColors.success, darkColors.surface));
console.log("Error on Surface: " + contrastRatio(darkColors.error, darkColors.surface));

console.log("\n--- LIGHT THEME CONTRAST ---");
console.log("Text Primary on BG: " + contrastRatio(lightColors.textPrimary, lightColors.bg));
console.log("Text Primary on Surface: " + contrastRatio(lightColors.textPrimary, lightColors.surface));
console.log("Text Secondary on Surface: " + contrastRatio(lightColors.textSecondary, lightColors.surface));
console.log("Accent Primary on Surface: " + contrastRatio(lightColors.accentPrimary, lightColors.surface));
console.log("Accent Secondary on Surface: " + contrastRatio(lightColors.accentSecondary, lightColors.surface));
console.log("Success on Surface: " + contrastRatio(lightColors.success, lightColors.surface));
console.log("Error on Surface: " + contrastRatio(lightColors.error, lightColors.surface));
